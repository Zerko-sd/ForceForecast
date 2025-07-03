import React, { useState, useEffect, useRef } from 'react';
import { Swords, Zap, Shield, Star, Trophy, X, Play, RotateCcw } from 'lucide-react';

interface GameState {
  playerHealth: number;
  enemyHealth: number;
  playerForce: number;
  enemyForce: number;
  currentEnemy: number;
  score: number;
  isGameActive: boolean;
  gamePhase: 'menu' | 'playing' | 'victory' | 'defeat';
  achievements: string[];
  combo: number;
  lastAction: string;
}

interface Enemy {
  name: string;
  health: number;
  force: number;
  difficulty: number;
  quote: string;
  color: string;
}

const enemies: Enemy[] = [
  {
    name: "Padawan Trainee",
    health: 80,
    force: 60,
    difficulty: 1,
    quote: "I will prove myself to the Council!",
    color: "blue"
  },
  {
    name: "Jedi Knight",
    health: 120,
    force: 100,
    difficulty: 2,
    quote: "The Force will guide me to victory.",
    color: "green"
  },
  {
    name: "Sith Apprentice",
    health: 150,
    force: 120,
    difficulty: 3,
    quote: "Your fear will be your downfall!",
    color: "red"
  },
  {
    name: "Jedi Master",
    health: 200,
    force: 150,
    difficulty: 4,
    quote: "Size matters not. Judge me by my size, do you?",
    color: "purple"
  },
  {
    name: "Darth Vader",
    health: 300,
    force: 200,
    difficulty: 5,
    quote: "I find your lack of faith disturbing.",
    color: "crimson"
  }
];

const achievements = [
  "First Blood - Defeat your first opponent",
  "Force Sensitive - Use Force powers 10 times",
  "Combo Master - Achieve a 5-hit combo",
  "Sith Lord - Defeat Darth Vader",
  "No Mercy - Win without taking damage",
  "The Chosen One - Complete all battles",
  "Do or Do Not - Use only Force powers to win",
  "These Aren't The Droids - Find the hidden easter egg"
];

interface StarWarsGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StarWarsGame({ isOpen, onClose }: StarWarsGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    playerHealth: 100,
    enemyHealth: 100,
    playerForce: 100,
    enemyForce: 100,
    currentEnemy: 0,
    score: 0,
    isGameActive: false,
    gamePhase: 'menu',
    achievements: [],
    combo: 0,
    lastAction: ''
  });

  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);

  // Konami code for easter egg
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      const newKonami = [...konami, e.code].slice(-10);
      setKonami(newKonami);
      
      if (newKonami.join(',') === konamiCode.join(',')) {
        setShowEasterEgg(true);
        unlockAchievement("These Aren't The Droids");
        addToBattleLog("🤖 R2-D2 appears and beeps encouragingly!");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [konami, isOpen]);

  const addToBattleLog = (message: string) => {
    setBattleLog(prev => [...prev.slice(-4), message]);
  };

  const unlockAchievement = (achievement: string) => {
    setGameState(prev => {
      if (!prev.achievements.includes(achievement)) {
        addToBattleLog(`🏆 Achievement Unlocked: ${achievement}`);
        return { ...prev, achievements: [...prev.achievements, achievement] };
      }
      return prev;
    });
  };

  const startGame = () => {
    setGameState({
      playerHealth: 100,
      enemyHealth: enemies[0].health,
      playerForce: 100,
      enemyForce: enemies[0].force,
      currentEnemy: 0,
      score: 0,
      isGameActive: true,
      gamePhase: 'playing',
      achievements: gameState.achievements,
      combo: 0,
      lastAction: ''
    });
    setBattleLog([`⚔️ Battle begins against ${enemies[0].name}!`]);
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'menu',
      isGameActive: false
    }));
    setBattleLog([]);
  };

  const performAction = (action: 'attack' | 'force' | 'defend') => {
    if (!gameState.isGameActive) return;

    const enemy = enemies[gameState.currentEnemy];
    let newState = { ...gameState };
    let damage = 0;
    let forceCost = 0;

    // Player action
    switch (action) {
      case 'attack':
        damage = Math.floor(Math.random() * 30) + 15;
        newState.enemyHealth = Math.max(0, newState.enemyHealth - damage);
        addToBattleLog(`⚔️ You strike for ${damage} damage!`);
        newState.combo = newState.lastAction === 'attack' ? newState.combo + 1 : 1;
        break;
      
      case 'force':
        if (newState.playerForce >= 20) {
          forceCost = 20;
          damage = Math.floor(Math.random() * 40) + 20;
          newState.enemyHealth = Math.max(0, newState.enemyHealth - damage);
          newState.playerForce -= forceCost;
          addToBattleLog(`⚡ Force lightning strikes for ${damage} damage!`);
          newState.combo = newState.lastAction === 'force' ? newState.combo + 1 : 1;
          
          // Track force usage for achievement
          if (gameState.achievements.filter(a => a.includes("Force Sensitive")).length === 0) {
            const forceCount = (gameState.score || 0) + 1;
            if (forceCount >= 10) {
              unlockAchievement("Force Sensitive");
            }
          }
        } else {
          addToBattleLog("❌ Not enough Force energy!");
          return;
        }
        break;
      
      case 'defend':
        newState.playerForce = Math.min(100, newState.playerForce + 15);
        addToBattleLog("🛡️ You focus and restore Force energy!");
        newState.combo = 0;
        break;
    }

    newState.lastAction = action;

    // Check for combo achievement
    if (newState.combo >= 5) {
      unlockAchievement("Combo Master");
    }

    // Enemy defeated
    if (newState.enemyHealth <= 0) {
      newState.score += enemy.difficulty * 100;
      addToBattleLog(`💀 ${enemy.name} has been defeated!`);
      
      // First victory achievement
      if (gameState.currentEnemy === 0 && !gameState.achievements.includes("First Blood")) {
        unlockAchievement("First Blood");
      }
      
      // No damage achievement
      if (newState.playerHealth === 100) {
        unlockAchievement("No Mercy");
      }
      
      // Check if this was Vader
      if (enemy.name === "Darth Vader") {
        unlockAchievement("Sith Lord");
      }
      
      // Next enemy or victory
      if (newState.currentEnemy < enemies.length - 1) {
        newState.currentEnemy++;
        const nextEnemy = enemies[newState.currentEnemy];
        newState.enemyHealth = nextEnemy.health;
        newState.enemyForce = nextEnemy.force;
        addToBattleLog(`⚔️ ${nextEnemy.name} approaches: "${nextEnemy.quote}"`);
      } else {
        newState.gamePhase = 'victory';
        newState.isGameActive = false;
        unlockAchievement("The Chosen One");
        addToBattleLog("🎉 You have brought balance to the Force!");
      }
    } else {
      // Enemy turn
      setTimeout(() => {
        enemyTurn(newState);
      }, 1000);
    }

    setGameState(newState);
  };

  const enemyTurn = (currentState: GameState) => {
    const enemy = enemies[currentState.currentEnemy];
    const actions = ['attack', 'force', 'defend'];
    const enemyAction = actions[Math.floor(Math.random() * actions.length)];
    
    let newState = { ...currentState };
    let damage = 0;

    switch (enemyAction) {
      case 'attack':
        damage = Math.floor(Math.random() * 25) + 10;
        newState.playerHealth = Math.max(0, newState.playerHealth - damage);
        addToBattleLog(`💥 ${enemy.name} attacks for ${damage} damage!`);
        break;
      
      case 'force':
        if (newState.enemyForce >= 20) {
          damage = Math.floor(Math.random() * 35) + 15;
          newState.playerHealth = Math.max(0, newState.playerHealth - damage);
          newState.enemyForce -= 20;
          addToBattleLog(`🌩️ ${enemy.name} uses the Force for ${damage} damage!`);
        } else {
          addToBattleLog(`${enemy.name} tries to use the Force but fails!`);
        }
        break;
      
      case 'defend':
        newState.enemyForce = Math.min(enemy.force, newState.enemyForce + 15);
        addToBattleLog(`${enemy.name} focuses and restores energy.`);
        break;
    }

    // Check if player is defeated
    if (newState.playerHealth <= 0) {
      newState.gamePhase = 'defeat';
      newState.isGameActive = false;
      addToBattleLog("💀 You have been defeated. The dark side clouds everything.");
    }

    setGameState(newState);
  };

  if (!isOpen) return null;

  const currentEnemy = enemies[gameState.currentEnemy];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 via-black to-red-950/20 border border-red-900/50 rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-900/50">
          <div className="flex items-center gap-3">
            <Swords className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-red-400 tracking-wide">LIGHTSABER COMBAT SIMULATOR</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-900/30 rounded-md transition-colors duration-200"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          {/* Menu Phase */}
          {gameState.gamePhase === 'menu' && (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
                  JEDI TRIALS
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Face the greatest warriors in the galaxy. Master the lightsaber. Embrace your destiny.
                  Use the Force wisely, young Padawan.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-black/50 border border-red-900/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-bold mb-2">Combat Controls</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>⚔️ Attack - Deal damage</p>
                    <p>⚡ Force - High damage, costs energy</p>
                    <p>🛡️ Defend - Restore Force energy</p>
                  </div>
                </div>
                
                <div className="bg-black/50 border border-red-900/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-bold mb-2">Achievements</h4>
                  <div className="text-sm text-gray-300">
                    <p>{gameState.achievements.length}/{achievements.length} unlocked</p>
                    <p className="text-xs mt-1">Try the Konami code... 👀</p>
                  </div>
                </div>
              </div>

              <button
                onClick={startGame}
                className="bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                BEGIN TRIALS
              </button>
            </div>
          )}

          {/* Playing Phase */}
          {gameState.gamePhase === 'playing' && (
            <div className="space-y-6">
              {/* Battle Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Player Stats */}
                <div className="bg-black/50 border border-blue-900/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    You (Sith Apprentice)
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Health</span>
                        <span className="text-blue-400">{gameState.playerHealth}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${gameState.playerHealth}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Force</span>
                        <span className="text-purple-400">{gameState.playerForce}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${gameState.playerForce}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enemy Stats */}
                <div className="bg-black/50 border border-red-900/30 rounded-lg p-4">
                  <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                    <Swords className="w-5 h-5" />
                    {currentEnemy.name}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Health</span>
                        <span className="text-red-400">{gameState.enemyHealth}/{enemies[gameState.currentEnemy].health}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(gameState.enemyHealth / enemies[gameState.currentEnemy].health) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Force</span>
                        <span className="text-orange-400">{gameState.enemyForce}/{enemies[gameState.currentEnemy].force}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(gameState.enemyForce / enemies[gameState.currentEnemy].force) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Battle Actions */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => performAction('attack')}
                  className="bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold py-4 px-6 rounded-md transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2"
                >
                  <Swords className="w-6 h-6" />
                  ATTACK
                </button>
                
                <button
                  onClick={() => performAction('force')}
                  disabled={gameState.playerForce < 20}
                  className="bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 disabled:from-gray-800 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-md transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex flex-col items-center gap-2"
                >
                  <Zap className="w-6 h-6" />
                  FORCE
                </button>
                
                <button
                  onClick={() => performAction('defend')}
                  className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-md transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2"
                >
                  <Shield className="w-6 h-6" />
                  DEFEND
                </button>
              </div>

              {/* Battle Log */}
              <div className="bg-black/50 border border-gray-700/30 rounded-lg p-4">
                <h4 className="text-gray-300 font-bold mb-3">Battle Log</h4>
                <div className="space-y-1 text-sm text-gray-400 max-h-32 overflow-y-auto">
                  {battleLog.map((log, index) => (
                    <p key={index}>{log}</p>
                  ))}
                </div>
              </div>

              {/* Game Stats */}
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Score: {gameState.score}</span>
                <span>Enemy: {gameState.currentEnemy + 1}/{enemies.length}</span>
                <span>Combo: {gameState.combo}x</span>
              </div>
            </div>
          )}

          {/* Victory/Defeat Phase */}
          {(gameState.gamePhase === 'victory' || gameState.gamePhase === 'defeat') && (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h3 className={`text-3xl font-bold ${
                  gameState.gamePhase === 'victory' 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-300' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300'
                }`}>
                  {gameState.gamePhase === 'victory' ? 'VICTORY' : 'DEFEAT'}
                </h3>
                <p className="text-gray-300">
                  {gameState.gamePhase === 'victory' 
                    ? 'You have proven yourself worthy. The Force is strong with you.'
                    : 'The path to mastery is long. Learn from this defeat and grow stronger.'
                  }
                </p>
                <p className="text-xl text-yellow-400 font-bold">Final Score: {gameState.score}</p>
              </div>

              {/* Achievements */}
              <div className="bg-black/50 border border-yellow-900/30 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements ({gameState.achievements.length}/{achievements.length})
                </h4>
                <div className="space-y-1 text-sm text-gray-300 max-h-32 overflow-y-auto">
                  {gameState.achievements.map((achievement, index) => (
                    <p key={index} className="text-yellow-300">🏆 {achievement}</p>
                  ))}
                </div>
              </div>

              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                RETURN TO MENU
              </button>
            </div>
          )}

          {/* Easter Egg */}
          {showEasterEgg && (
            <div className="fixed bottom-4 right-4 bg-blue-900/90 border border-blue-500 rounded-lg p-4 animate-bounce">
              <p className="text-blue-300 text-sm">🤖 Beep boop beep! R2-D2 believes in you!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
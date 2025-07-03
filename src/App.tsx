import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInput } from './components/PromptInput';
import { Schedule } from './components/Schedule';
import { Goals } from './components/Goals';
import { Journal } from './components/Journal';
import { ActionPanel } from './components/ActionPanel';
import { ChatBox } from './components/ChatBox';
import { StarWarsGame } from './components/StarWarsGame';
import { Calendar } from './components/Calendar';
import { PomodoroSidebar } from './components/PomodoroSidebar';
import { generateContent, getDefaultPrompt } from './utils/generator';
import { savePlan, exportPlans, exportPlanAsText } from './utils/storage';
import { DailyPlan, GeneratedContent } from './types';
import { Skull, MessageSquare, Gamepad2, Calendar as CalendarIcon, Timer } from 'lucide-react';
import DarthVader from './components/icons/DarthVader';
import yodaImg from '../public/assets/yoda.png'; // Will work with Vite/CRA, else use <img src="/assets/yoda.png" />

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<DailyPlan | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lightsaberCursor, setLightsaberCursor] = useState(false);
  const [yodaMode, setYodaMode] = useState(false);

  const handlePromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    setShowResults(false);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalPrompt = prompt || getDefaultPrompt();
    const content = await generateContent(finalPrompt);
    
    if (!content || !Array.isArray(content.schedule) || !Array.isArray(content.goals) || typeof content.journalPrompt !== 'string') {
      // Handle error: show a message, set a default, etc.
      setIsLoading(false);
      alert("Failed to generate a valid plan. Please try again.");
      return;
    }
    
    const newPlan: DailyPlan = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      prompt: finalPrompt,
      schedule: content.schedule,
      goals: content.goals,
      journalPrompt: content.journalPrompt,
      journalEntry: '',
      createdAt: new Date().toISOString(),
    };
    
    setCurrentPlan(newPlan);
    setJournalEntry('');
    setIsLoading(false);
    
    // Trigger results animation
    setTimeout(() => setShowResults(true), 100);
  };

  const handleSave = () => {
    if (currentPlan) {
      const updatedPlan = { ...currentPlan, journalEntry };
      savePlan(updatedPlan);
      setCurrentPlan(updatedPlan);
      
      // Visual feedback
      const button = document.querySelector('[data-save-button]');
      if (button) {
        button.textContent = 'PLAN SECURED';
        setTimeout(() => {
          button.textContent = 'SAVE PLAN';
        }, 2000);
      }
    }
  };

  const handleExport = () => {
    const data = exportPlans();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'force-forecast-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    if (currentPlan) {
      const updatedPlan = { ...currentPlan, journalEntry };
      const textData = exportPlanAsText(updatedPlan);
      const blob = new Blob([textData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `force-forecast-${currentPlan.date.replace(/\//g, '-')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleClear = () => {
    setCurrentPlan(null);
    setJournalEntry('');
    setShowResults(false);
  };

  // Generate stars for background
  const stars = Array.from({ length: 150 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute bg-white rounded-full"
      style={{
        width: Math.random() * 3 + 1 + 'px',
        height: Math.random() * 3 + 1 + 'px',
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.3, 1, 0],
        scale: [1, 1.5, 1, 1.2, 1],
      }}
      transition={{
        duration: Math.random() * 8 + 4,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: "easeInOut"
      }}
    />
  ));

  // Floating particles animation
  const particles = Array.from({ length: 30 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-red-500/30 rounded-full"
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: 0
      }}
      animate={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: Math.random() * 15 + 10,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  ));

  // Hexagonal grid pattern
  const hexGrid = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute border border-red-500/10 transform rotate-45"
      style={{
        width: '100px',
        height: '100px',
        left: (i % 5) * 200 + 'px',
        top: Math.floor(i / 5) * 200 + 'px',
      }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.1, 1],
        rotate: [45, 50, 45],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: i * 0.5,
        ease: "easeInOut"
      }}
    />
  ));

  useEffect(() => {
    if (lightsaberCursor) {
      document.body.classList.add('lightsaber-cursor');
    } else {
      document.body.classList.remove('lightsaber-cursor');
    }
    return () => {
      document.body.classList.remove('lightsaber-cursor');
    };
  }, [lightsaberCursor]);

  // Konami code logic
  useEffect(() => {
    const konami = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let keyBuffer: string[] = [];
    const onKeyDown = (e: KeyboardEvent) => {
      keyBuffer.push(e.key);
      if (keyBuffer.length > konami.length) keyBuffer.shift();
      if (keyBuffer.join(',') === konami.join(',')) {
        setYodaMode((v) => !v);
        keyBuffer = [];
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Yoda-speak transformation (placeholder)
  function toYodaSpeak(text: string): string {
    if (!yodaMode) return text;
    // Simple fake Yoda-speak: reverse word order
    return text.split(' ').reverse().join(' ');
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Yoda Easter Egg */}
      {yodaMode && (
        <img
          src={yodaImg}
          alt="Yoda"
          style={{
            position: 'fixed',
            bottom: -48,
            right: -24,
            width: 220,
            zIndex: 10001,
            filter: 'drop-shadow(0 0 32px #a3e635)',
            transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Secret clickable spot for lightsaber cursor */}
      <div
        style={{ position: 'fixed', top: 0, left: 0, width: 32, height: 32, zIndex: 10000, opacity: 0.01, cursor: 'pointer' }}
        title="The Force is strong here..."
        onClick={() => setLightsaberCursor((v) => !v)}
        aria-label="Activate the Force"
      />
      {/* Futuristic Star Wars Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950/20">
        
        {/* Starfield */}
        <div className="absolute inset-0 overflow-hidden">
          {stars}
        </div>

        {/* Hexagonal Grid Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {hexGrid}
        </div>

        {/* Death Star-like Circular Patterns */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-red-500/20 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.div 
            className="absolute top-1/2 left-1/2 w-48 h-48 border border-red-500/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              rotate: [360, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <motion.div 
              className="absolute top-1/2 left-1/2 w-24 h-24 border border-red-500/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Secondary Circular Pattern */}
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 border border-blue-500/15 rounded-full"
          animate={{
            rotate: [360, 0],
            scale: [1, 0.9, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.div 
            className="absolute top-1/2 left-1/2 w-40 h-40 border border-blue-500/25 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Tactical Grid Lines */}
        <div className="absolute inset-0">
          {/* Vertical Lines */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-red-500/20 to-transparent"
              style={{ left: `${(i + 1) * 12.5}%` }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scaleY: [1, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Horizontal Lines */}
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
              style={{ top: `${(i + 1) * 16.66}%` }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scaleX: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Animated Energy Orbs */}
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-radial from-red-500/30 via-red-500/10 to-transparent rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div 
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-radial from-blue-500/20 via-blue-500/5 to-transparent rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles}
        </div>
        
        {/* Scanning lines */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent h-4"
          animate={{
            y: [-100, window.innerHeight + 100],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent w-4"
          animate={{
            x: [-100, window.innerWidth + 100],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 3
          }}
        />

        {/* Holographic Interface Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 border-2 border-red-500/30 transform rotate-45"
          animate={{
            rotate: [45, 90, 45],
            borderColor: ["rgba(239, 68, 68, 0.3)", "rgba(239, 68, 68, 0.6)", "rgba(239, 68, 68, 0.3)"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div 
          className="absolute bottom-10 right-10 w-16 h-16 border border-blue-500/40 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="absolute top-1/2 left-1/2 w-8 h-8 bg-blue-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 0.5, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Corner Interface Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-red-500/40"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-red-500/40"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-red-500/40"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-red-500/40"></div>

        {/* Central Targeting Reticle */}
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-red-500/20 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute top-1/2 left-0 w-full h-px bg-red-500/30"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-red-500/30"></div>
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-red-500/50 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="fixed top-4 right-4 z-30 flex gap-2"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.button
          onClick={() => setIsCalendarOpen(true)}
          className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-blue-900/50 transition-all duration-300"
          title="Tactical Calendar"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <CalendarIcon className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          onClick={() => setIsGameOpen(true)}
          className="bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-purple-900/50 transition-all duration-300"
          title="Lightsaber Combat Training"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Gamepad2 className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          onClick={() => setIsChatOpen(true)}
          className={`bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-red-900/50 transition-all duration-300 ${
            isChatOpen ? 'hidden' : 'block'
          }`}
          title="Tactical Advisor"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Pomodoro Timer Button */}
      <motion.div 
        className="fixed top-4 left-4 z-30"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.button
          onClick={() => setIsPomodoroOpen(true)}
          className={`bg-gradient-to-r from-orange-900 to-orange-700 hover:from-orange-800 hover:to-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-orange-900/50 transition-all duration-300 ${
            isPomodoroOpen ? 'hidden' : 'block'
          }`}
          title="Tactical Station - Pomodoro & Music"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Timer className="w-6 h-6" />
        </motion.button>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <DarthVader className="w-12 h-12 text-red-500" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300 tracking-wider"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              FORCE FORECAST
            </motion.h1>
            <motion.div
              animate={{ 
                rotate: [360, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            >
              <DarthVader className="w-12 h-12 text-red-500" />
            </motion.div>
          </motion.div>
          <motion.p 
            className="text-red-300 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            HARNESS THE DARK SIDE. DOMINATE YOUR DAY.
          </motion.p>
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} />
          </motion.div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {currentPlan && showResults && (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              >
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Schedule schedule={currentPlan.schedule} />
                  <Goals goals={currentPlan.goals} />
                </motion.div>
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Journal 
                    prompt={currentPlan.journalPrompt}
                    entry={journalEntry}
                    onEntryChange={setJournalEntry}
                  />
                  <ActionPanel
                    onSave={handleSave}
                    onExport={handleExport}
                    onExportText={handleExportText}
                    onClear={handleClear}
                    canSave={true}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="bg-black/50 border border-red-900/30 rounded-lg p-8 max-w-md mx-auto backdrop-blur-sm"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(220, 38, 38, 0.3)",
                      "0 0 40px rgba(220, 38, 38, 0.6)",
                      "0 0 20px rgba(220, 38, 38, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <DarthVader className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  </motion.div>
                  <motion.p 
                    className="text-red-300 text-lg font-medium mb-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    The Force is awakening...
                  </motion.p>
                  <motion.p 
                    className="text-gray-400"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Channeling dark energy into your tactical plan.
                  </motion.p>
                  
                  {/* Loading bar */}
                  <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          <AnimatePresence>
            {!currentPlan && !isLoading && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="bg-black/50 border border-red-900/30 rounded-lg p-8 max-w-md mx-auto backdrop-blur-sm"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(220, 38, 38, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <DarthVader className="w-16 h-16 text-red-500/50 mx-auto mb-4" />
                  </motion.div>
                  <motion.p 
                    className="text-red-300 text-lg font-medium mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Your destiny awaits command.
                  </motion.p>
                  <motion.p 
                    className="text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Enter your directive above to unleash the power of the dark side.
                  </motion.p>
                  <motion.div 
                    className="mt-4 space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.div 
                      className="p-3 bg-orange-950/30 border border-orange-700/30 rounded-md"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(154, 52, 18, 0.4)" }}
                    >
                      <p className="text-orange-300 text-sm">
                        ⏱️ Use the Tactical Station for Pomodoro focus sessions!
                      </p>
                    </motion.div>
                    <motion.div 
                      className="p-3 bg-purple-950/30 border border-purple-700/30 rounded-md"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(88, 28, 135, 0.4)" }}
                    >
                      <p className="text-purple-300 text-sm">
                        🎮 Try the lightsaber combat simulator for Jedi training!
                      </p>
                    </motion.div>
                    <motion.div 
                      className="p-3 bg-blue-950/30 border border-blue-700/30 rounded-md"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 58, 138, 0.4)" }}
                    >
                      <p className="text-blue-300 text-sm">
                        📅 Use the tactical calendar to plan your empire!
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 pt-8 border-t border-red-900/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.p 
            className="text-red-500/70 text-sm font-medium"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            "The Force is strong with this one." - Embrace your power.
          </motion.p>
        </motion.div>
      </div>

      {/* Chat Box */}
      <ChatBox 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentPlan={currentPlan}
      />

      {/* Star Wars Game */}
      <StarWarsGame 
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />

      {/* Calendar */}
      <Calendar 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        currentPlan={currentPlan}
      />

      {/* Pomodoro Sidebar */}
      <PomodoroSidebar 
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
      />
    </div>
  );
}

export default App;
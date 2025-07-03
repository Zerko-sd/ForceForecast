import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack,
  Music,
  Timer,
  Coffee,
  Target,
  Zap,
  X
} from 'lucide-react';

interface PomodoroSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  session: number;
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: 'focus' | 'ambient' | 'epic' | 'dark';
  url?: string;
}

const musicTracks: MusicTrack[] = [
  { id: '1', title: 'Imperial March', artist: 'John Williams', duration: '3:02', category: 'epic', url: '/assets/Imperial-March.mp3' },
  { id: '2', title: 'Duel of the Fates', artist: 'John Williams', duration: '4:14', category: 'epic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '3', title: 'The Force Theme', artist: 'John Williams', duration: '5:12', category: 'ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '4', title: 'Dark Side Meditation', artist: 'Sith Academy', duration: '8:30', category: 'dark', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '5', title: 'Binary Sunset', artist: 'John Williams', duration: '2:46', category: 'ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '6', title: 'Cantina Band', artist: 'John Williams', duration: '2:46', category: 'focus', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '7', title: 'Vader\'s Theme', artist: 'John Williams', duration: '3:15', category: 'dark', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '8', title: 'Jedi Temple March', artist: 'John Williams', duration: '4:02', category: 'focus', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '9', title: 'Throne Room', artist: 'John Williams', duration: '5:41', category: 'epic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '10', title: 'Asteroid Field', artist: 'John Williams', duration: '4:18', category: 'ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
];

export function PomodoroSidebar({ isOpen, onClose }: PomodoroSidebarProps) {
  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    timeLeft: 25 * 60, // 25 minutes in seconds
    isRunning: false,
    mode: 'work',
    session: 1,
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15
  });

  const [showSettings, setShowSettings] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pomodoro Timer Logic
  useEffect(() => {
    if (pomodoro.isRunning && pomodoro.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setPomodoro(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (pomodoro.timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pomodoro.isRunning, pomodoro.timeLeft]);

  const handleTimerComplete = () => {
    setPomodoro(prev => {
      let newMode: 'work' | 'shortBreak' | 'longBreak';
      let newTimeLeft: number;
      let newSession = prev.session;

      if (prev.mode === 'work') {
        if (prev.session % 4 === 0) {
          newMode = 'longBreak';
          newTimeLeft = prev.longBreakTime * 60;
        } else {
          newMode = 'shortBreak';
          newTimeLeft = prev.shortBreakTime * 60;
        }
        newSession = prev.session + 1;
      } else {
        newMode = 'work';
        newTimeLeft = prev.workTime * 60;
      }

      return {
        ...prev,
        mode: newMode,
        timeLeft: newTimeLeft,
        session: newSession,
        isRunning: false
      };
    });

    // Play notification sound or show notification
    showNotification();
  };

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ForceForecast Timer', {
        body: `${pomodoro.mode === 'work' ? 'Work session' : 'Break'} completed!`,
        icon: '/favicon.ico'
      });
    }
  };

  const startTimer = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setPomodoro(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setPomodoro(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setPomodoro(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.mode === 'work' ? prev.workTime * 60 : 
                prev.mode === 'shortBreak' ? prev.shortBreakTime * 60 : 
                prev.longBreakTime * 60
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeIcon = () => {
    switch (pomodoro.mode) {
      case 'work': return <Target className="w-5 h-5" />;
      case 'shortBreak': return <Coffee className="w-5 h-5" />;
      case 'longBreak': return <Zap className="w-5 h-5" />;
    }
  };

  const getModeColor = () => {
    switch (pomodoro.mode) {
      case 'work': return 'from-red-900 to-red-700';
      case 'shortBreak': return 'from-green-900 to-green-700';
      case 'longBreak': return 'from-blue-900 to-blue-700';
    }
  };

  // Music Player Logic
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }, 0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      setCurrentTrackIndex(nextIndex);
      playTrack(playlist[nextIndex]);
    }
  };

  const previousTrack = () => {
    if (playlist.length > 0) {
      const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      playTrack(playlist[prevIndex]);
    }
  };

  const filteredTracks = selectedCategory === 'all' 
    ? musicTracks 
    : musicTracks.filter(track => track.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'focus': return 'from-blue-900 to-blue-700';
      case 'ambient': return 'from-purple-900 to-purple-700';
      case 'epic': return 'from-red-900 to-red-700';
      case 'dark': return 'from-gray-900 to-gray-700';
      default: return 'from-gray-800 to-gray-600';
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, currentTrack]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div 
        className="fixed top-0 left-0 h-full w-full lg:w-96 bg-gradient-to-b from-gray-900 via-black to-red-950/20 border-r border-red-900/50 z-50 overflow-y-auto"
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-900/50 sticky top-0 bg-black/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Timer className="w-6 h-6 text-red-500" />
            </motion.div>
            <h2 className="text-xl font-bold text-red-400 tracking-wide">TACTICAL STATION</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-900/30 rounded-md transition-colors duration-200"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Pomodoro Timer Section */}
          <motion.div 
            className="bg-black/50 border border-red-900/30 rounded-lg p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getModeIcon()}
                <h3 className="text-lg font-bold text-red-400">
                  {pomodoro.mode === 'work' ? 'FOCUS MODE' : 
                   pomodoro.mode === 'shortBreak' ? 'SHORT BREAK' : 'LONG BREAK'}
                </h3>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-red-900/30 rounded-md transition-colors duration-200"
              >
                <Settings className="w-4 h-4 text-red-400" />
              </button>
            </div>

            {/* Timer Display */}
            <motion.div 
              className="text-center mb-6"
              animate={{ 
                scale: pomodoro.isRunning ? [1, 1.02, 1] : 1,
                color: pomodoro.timeLeft < 60 ? ["#ef4444", "#dc2626", "#ef4444"] : "#ef4444"
              }}
              transition={{ 
                duration: 1,
                repeat: pomodoro.isRunning ? Infinity : 0
              }}
            >
              <div className="text-6xl font-mono font-bold text-red-400 mb-2">
                {formatTime(pomodoro.timeLeft)}
              </div>
              <div className="text-sm text-gray-400">
                Session {pomodoro.session} • {pomodoro.mode.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${getModeColor()}`}
                style={{
                  width: `${((pomodoro.mode === 'work' ? pomodoro.workTime * 60 : 
                            pomodoro.mode === 'shortBreak' ? pomodoro.shortBreakTime * 60 : 
                            pomodoro.longBreakTime * 60) - pomodoro.timeLeft) / 
                           (pomodoro.mode === 'work' ? pomodoro.workTime * 60 : 
                            pomodoro.mode === 'shortBreak' ? pomodoro.shortBreakTime * 60 : 
                            pomodoro.longBreakTime * 60) * 100}%`
                }}
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((pomodoro.mode === 'work' ? pomodoro.workTime * 60 : 
                            pomodoro.mode === 'shortBreak' ? pomodoro.shortBreakTime * 60 : 
                            pomodoro.longBreakTime * 60) - pomodoro.timeLeft) / 
                           (pomodoro.mode === 'work' ? pomodoro.workTime * 60 : 
                            pomodoro.mode === 'shortBreak' ? pomodoro.shortBreakTime * 60 : 
                            pomodoro.longBreakTime * 60) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-3">
              <motion.button
                onClick={pomodoro.isRunning ? pauseTimer : startTimer}
                className={`bg-gradient-to-r ${getModeColor()} hover:opacity-80 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 flex items-center gap-2`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pomodoro.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {pomodoro.isRunning ? 'PAUSE' : 'START'}
              </motion.button>
              
              <motion.button
                onClick={resetTimer}
                className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  className="mt-4 p-4 bg-gray-900/50 border border-gray-700/30 rounded-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-red-400 font-bold mb-3">Timer Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Work Time (minutes)</label>
                      <input
                        type="number"
                        value={pomodoro.workTime}
                        onChange={(e) => setPomodoro(prev => ({ ...prev, workTime: parseInt(e.target.value) || 25 }))}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-100"
                        min="1"
                        max="60"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Short Break (minutes)</label>
                      <input
                        type="number"
                        value={pomodoro.shortBreakTime}
                        onChange={(e) => setPomodoro(prev => ({ ...prev, shortBreakTime: parseInt(e.target.value) || 5 }))}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-100"
                        min="1"
                        max="30"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Long Break (minutes)</label>
                      <input
                        type="number"
                        value={pomodoro.longBreakTime}
                        onChange={(e) => setPomodoro(prev => ({ ...prev, longBreakTime: parseInt(e.target.value) || 15 }))}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-100"
                        min="1"
                        max="60"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Music Player Section */}
          <motion.div 
            className="bg-black/50 border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold text-purple-400">IMPERIAL SOUNDTRACKS</h3>
            </div>

            {/* Current Track Display */}
            {currentTrack && (
              <motion.div 
                className="bg-purple-950/30 border border-purple-700/30 rounded-md p-4 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-purple-300 font-medium">{currentTrack.title}</h4>
                    <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
                  </div>
                  <span className="text-purple-400 text-sm">{currentTrack.duration}</span>
                </div>
                
                {/* Playback Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={previousTrack}
                      className="p-2 hover:bg-purple-900/30 rounded-md transition-colors duration-200"
                    >
                      <SkipBack className="w-4 h-4 text-purple-400" />
                    </button>
                    
                    <motion.button
                      onClick={togglePlayPause}
                      className="bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-white p-3 rounded-full transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </motion.button>
                    
                    <button
                      onClick={nextTrack}
                      className="p-2 hover:bg-purple-900/30 rounded-md transition-colors duration-200"
                    >
                      <SkipForward className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-purple-900/30 rounded-md transition-colors duration-200"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16 accent-purple-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'focus', 'ambient', 'epic', 'dark'].map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-950/30 text-purple-300 hover:bg-purple-900/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.toUpperCase()}
                </motion.button>
              ))}
            </div>

            {/* Track List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                    currentTrack?.id === track.id
                      ? 'border-purple-500/50 bg-purple-950/50'
                      : 'border-gray-700/30 bg-gray-900/30 hover:bg-purple-950/30'
                  }`}
                  onClick={() => playTrack(track)}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-gray-100 font-medium text-sm">{track.title}</h5>
                      <p className="text-gray-400 text-xs">{track.artist}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-purple-400 text-xs">{track.duration}</span>
                      <div className={`text-xs px-2 py-1 rounded-full mt-1 bg-gradient-to-r ${getCategoryColor(track.category)} text-white`}>
                        {track.category}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="bg-black/50 border border-gray-700/30 rounded-lg p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-gray-300 font-bold mb-3">Today's Progress</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{pomodoro.session - 1}</div>
                <div className="text-xs text-gray-400">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{Math.floor((pomodoro.session - 1) * pomodoro.workTime / 60)}h</div>
                <div className="text-xs text-gray-400">Focus Time</div>
              </div>
            </div>
          </motion.div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack?.url}
          autoPlay={isPlaying}
          onEnded={nextTrack}
        />
      </motion.div>
    </>
  );
}
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame } from 'lucide-react';

interface JournalProps {
  prompt: string;
  entry: string;
  onEntryChange: (entry: string) => void;
}

export function Journal({ prompt, entry, onEntryChange }: JournalProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="bg-black/80 border border-red-900/50 rounded-lg p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      whileHover={{ 
        boxShadow: "0 0 30px rgba(220, 38, 38, 0.2)",
        borderColor: "rgba(220, 38, 38, 0.6)"
      }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotateY: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <BookOpen className="w-6 h-6 text-red-500" />
        </motion.div>
        <h2 className="text-xl font-bold text-red-400 tracking-wide">MINDSET CONDITIONING</h2>
      </motion.div>
      
      <div className="space-y-4">
        <motion.div 
          className="p-4 bg-red-950/30 border border-red-800/30 rounded-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ 
            scale: 1.02,
            backgroundColor: "rgba(127, 29, 29, 0.4)"
          }}
        >
          <motion.div 
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Flame className="w-4 h-4 text-red-500" />
            </motion.div>
            <span className="text-red-300 font-bold text-sm">CONDITIONING PROMPT</span>
          </motion.div>
          <motion.p 
            className="text-gray-100 font-medium italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {prompt}
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <motion.textarea
            value={entry}
            onChange={(e) => onEntryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Channel your thoughts into power. Write with intensity and purpose..."
            className={`w-full h-32 bg-gray-900/50 border ${
              isFocused ? 'border-red-500' : 'border-red-800/30'
            } rounded-md px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-300`}
            animate={{
              boxShadow: isFocused 
                ? "0 0 20px rgba(220, 38, 38, 0.3)" 
                : "0 0 0px rgba(220, 38, 38, 0)"
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="absolute bottom-3 right-3"
            animate={{ 
              scale: isFocused ? [1, 1.3, 1] : 1,
              rotate: isFocused ? [0, 10, -10, 0] : 0,
              color: isFocused ? "#ef4444" : "#dc2626"
            }}
            transition={{ 
              duration: isFocused ? 1 : 0.3,
              repeat: isFocused ? Infinity : 0
            }}
          >
            <Flame className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-4 p-3 bg-gradient-to-r from-yellow-950/30 to-red-950/30 border border-yellow-700/30 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        whileHover={{ 
          backgroundImage: "linear-gradient(to right, rgba(133, 77, 14, 0.4), rgba(127, 29, 29, 0.4))"
        }}
      >
        <motion.p 
          className="text-yellow-300 text-sm font-medium"
          animate={{
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.span 
            className="text-yellow-500"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity
            }}
          >
            🔥
          </motion.span> 
          Embrace the darkness. Let your anger fuel your strength.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Command, Zap } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() || !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <motion.div 
      className="bg-black/80 border border-red-900/50 rounded-lg p-6 backdrop-blur-sm"
      whileHover={{ 
        boxShadow: "0 0 30px rgba(220, 38, 38, 0.3)",
        borderColor: "rgba(220, 38, 38, 0.7)"
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: isFocused ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Command className="w-6 h-6 text-red-500" />
        </motion.div>
        <h2 className="text-xl font-bold text-red-400 tracking-wide">MISSION DIRECTIVE</h2>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <motion.textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your command... or let the Force guide you to victory."
            className={`w-full h-20 bg-gray-900/50 border ${
              isFocused ? 'border-red-500' : 'border-red-800/30'
            } rounded-md px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-300`}
            disabled={isLoading}
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
              scale: isFocused ? 1.2 : 1,
              color: isFocused ? "#ef4444" : "#dc2626"
            }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="w-4 h-4" />
          </motion.div>
        </motion.div>
        
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 disabled:from-gray-800 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-red-900/50"
          whileHover={{ 
            scale: isLoading ? 1 : 1.05,
            boxShadow: "0 0 40px rgba(220, 38, 38, 0.5)"
          }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          animate={{
            backgroundPosition: isLoading ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
          }}
          transition={{
            backgroundPosition: {
              duration: 2,
              repeat: isLoading ? Infinity : 0,
              ease: "linear"
            }
          }}
        >
          {isLoading ? (
            <motion.span 
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              GENERATING TACTICAL PLAN...
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              EXECUTE FORCE FORECAST
            </motion.span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
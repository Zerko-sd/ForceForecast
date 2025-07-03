import React from 'react';
import { motion } from 'framer-motion';
import { Target, Swords, Crown } from 'lucide-react';

interface GoalsProps {
  goals: string[];
}

export function Goals({ goals }: GoalsProps) {
  const getGoalIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-5 h-5 text-red-500" />;
      case 1: return <Swords className="w-5 h-5 text-red-500" />;
      default: return <Target className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <motion.div 
      className="bg-black/80 border border-red-900/50 rounded-lg p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ 
        boxShadow: "0 0 30px rgba(220, 38, 38, 0.2)",
        borderColor: "rgba(220, 38, 38, 0.6)"
      }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Target className="w-6 h-6 text-red-500" />
        </motion.div>
        <h2 className="text-xl font-bold text-red-400 tracking-wide">STRATEGIC OBJECTIVES</h2>
      </motion.div>
      
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4 p-4 bg-red-950/30 border border-red-800/30 rounded-md hover:bg-red-950/40 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.2 + 0.4,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.03,
              x: 5,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="mt-1"
              animate={{
                rotate: index === 0 ? [0, 360] : 0,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, delay: index * 0.5 }
              }}
            >
              {getGoalIcon(index)}
            </motion.div>
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 + 0.6 }}
            >
              <p className="text-gray-100 font-medium leading-relaxed">{goal}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-4 p-3 bg-gradient-to-r from-red-950/30 to-red-900/30 border border-red-700/30 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ 
          backgroundImage: "linear-gradient(to right, rgba(127, 29, 29, 0.4), rgba(153, 27, 27, 0.4))"
        }}
      >
        <motion.p 
          className="text-red-300 text-sm font-medium text-center"
          animate={{
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.span 
            className="text-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⚡
          </motion.span> 
          Channel your anger. Focus your hatred. Achieve absolute victory.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
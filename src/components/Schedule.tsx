import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, AlertTriangle } from 'lucide-react';
import { ScheduleItem } from '../types';

interface ScheduleProps {
  schedule: ScheduleItem[];
}

export function Schedule({ schedule = [] }: ScheduleProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <Target className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500/50 bg-red-950/30';
      case 'high': return 'border-orange-500/50 bg-orange-950/30';
      default: return 'border-gray-600/50 bg-gray-950/30';
    }
  };

  return (
    <motion.div 
      className="bg-black/80 border border-red-900/50 rounded-lg p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        boxShadow: "0 0 30px rgba(220, 38, 38, 0.2)",
        borderColor: "rgba(220, 38, 38, 0.6)"
      }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="w-6 h-6 text-red-500" />
        </motion.div>
        <h2 className="text-xl font-bold text-red-400 tracking-wide">TACTICAL SCHEDULE</h2>
      </motion.div>
      
      <div className="space-y-3">
        {schedule.map((item, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-4 p-3 rounded-md border ${getPriorityColor(item.priority)} transition-all duration-300 hover:bg-opacity-50`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              x: 10,
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-center gap-2 min-w-0"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                animate={{ 
                  scale: item.priority === 'critical' ? [1, 1.2, 1] : 1,
                  rotate: item.priority === 'critical' ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: 2,
                  repeat: item.priority === 'critical' ? Infinity : 0
                }}
              >
                {getPriorityIcon(item.priority)}
              </motion.div>
              <motion.span 
                className="text-red-300 font-mono text-sm font-bold min-w-[50px]"
                animate={{
                  color: item.priority === 'critical' ? ["#fca5a5", "#ef4444", "#fca5a5"] : "#fca5a5"
                }}
                transition={{
                  duration: 1.5,
                  repeat: item.priority === 'critical' ? Infinity : 0
                }}
              >
                {item.time}
              </motion.span>
            </motion.div>
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <p className="text-gray-100 font-medium">{item.task}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-4 p-3 bg-red-950/20 border border-red-800/30 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ backgroundColor: "rgba(127, 29, 29, 0.3)" }}
      >
        <motion.p 
          className="text-red-300 text-sm font-medium"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-red-500">⚠</span> No mercy. No breaks. Execute with precision.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
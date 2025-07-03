import React from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Trash2, FileText } from 'lucide-react';

interface ActionPanelProps {
  onSave: () => void;
  onExport: () => void;
  onExportText: () => void;
  onClear: () => void;
  canSave: boolean;
}

export function ActionPanel({ onSave, onExport, onExportText, onClear, canSave }: ActionPanelProps) {
  return (
    <motion.div 
      className="bg-black/80 border border-red-900/50 rounded-lg p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      whileHover={{ 
        boxShadow: "0 0 30px rgba(220, 38, 38, 0.2)",
        borderColor: "rgba(220, 38, 38, 0.6)"
      }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 360]
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }}
        >
          <Save className="w-6 h-6 text-red-500" />
        </motion.div>
        <h2 className="text-xl font-bold text-red-400 tracking-wide">COMMAND ACTIONS</h2>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.button
          onClick={onSave}
          disabled={!canSave}
          data-save-button
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 disabled:from-gray-800 disabled:to-gray-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300"
          whileHover={{ 
            scale: canSave ? 1.05 : 1,
            boxShadow: canSave ? "0 0 20px rgba(220, 38, 38, 0.4)" : "none"
          }}
          whileTap={{ scale: canSave ? 0.98 : 1 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            animate={{ rotate: canSave ? [0, 360] : 0 }}
            transition={{ duration: 2, repeat: canSave ? Infinity : 0, ease: "linear" }}
          >
            <Save className="w-4 h-4" />
          </motion.div>
          SAVE PLAN
        </motion.button>
        
        <motion.button
          onClick={onExportText}
          disabled={!canSave}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-900 to-orange-700 hover:from-orange-800 hover:to-orange-600 disabled:from-gray-800 disabled:to-gray-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300"
          whileHover={{ 
            scale: canSave ? 1.05 : 1,
            boxShadow: canSave ? "0 0 20px rgba(234, 88, 12, 0.4)" : "none"
          }}
          whileTap={{ scale: canSave ? 0.98 : 1 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ 
              y: canSave ? [0, -2, 0] : 0,
              rotate: canSave ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 1.5,
              repeat: canSave ? Infinity : 0
            }}
          >
            <FileText className="w-4 h-4" />
          </motion.div>
          EXPORT TEXT
        </motion.button>
        
        <motion.button
          onClick={onExport}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Download className="w-4 h-4" />
          </motion.div>
          EXPORT DATA
        </motion.button>
        
        <motion.button
          onClick={onClear}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(75, 85, 99, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.div>
          CLEAR ALL
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
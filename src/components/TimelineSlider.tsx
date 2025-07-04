import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Expanded Star Wars timeline with more checkpoints
const TIMELINE = [
  { label: 'High Republic Begins', year: -300, era: 'High Republic', details: 'Jedi Order at its height. Galactic peace.' },
  { label: 'The Acolyte', year: -132, era: 'High Republic', details: 'Dark side stirs. The Acolyte (Show).' },
  { label: 'The Phantom Menace', year: -32, era: 'Fall of the Republic', details: 'Palpatine rises. Episode I.' },
  { label: 'Attack of the Clones', year: -22, era: 'Fall of the Republic', details: 'Clone Wars begin. Episode II.' },
  { label: 'The Clone Wars', year: -22, era: 'Fall of the Republic', details: 'Jedi generals. The Clone Wars (Show).' },
  { label: 'Revenge of the Sith', year: -19, era: 'Fall of the Republic', details: 'Jedi fall. Empire rises. Episode III.' },
  { label: 'The Bad Batch', year: -19, era: 'Empire', details: 'Clones on the run. The Bad Batch (Show).' },
  { label: 'Solo: A Star Wars Story', year: -10, era: 'Empire', details: "Han Solo's early years." },
  { label: 'Obi-Wan Kenobi', year: -9, era: 'Empire', details: 'Kenobi in exile. Obi-Wan Kenobi (Show).' },
  { label: 'Rebels', year: -5, era: 'Empire', details: 'Rebellion grows. Star Wars Rebels (Show).' },
  { label: 'Rogue One', year: 0, era: 'Empire', details: 'Death Star plans stolen. Rogue One.' },
  { label: 'A New Hope', year: 0, era: 'Empire', details: "Luke's journey begins. Episode IV." },
  { label: 'The Empire Strikes Back', year: 3, era: 'Empire', details: 'Rebels on the run. Episode V.' },
  { label: 'Return of the Jedi', year: 4, era: 'Empire', details: 'Vader redeemed. Episode VI.' },
  { label: 'The Mandalorian', year: 9, era: 'New Republic', details: 'Din Djarin and Grogu. The Mandalorian (Show).' },
  { label: 'The Book of Boba Fett', year: 9, era: 'New Republic', details: 'Boba Fett rules Tatooine.' },
  { label: 'Ahsoka', year: 11, era: 'New Republic', details: "Ahsoka's quest. Ahsoka (Show)." },
  { label: 'Skeleton Crew', year: 15, era: 'New Republic', details: 'New adventures. Skeleton Crew (Show).' },
  { label: 'The Force Awakens', year: 34, era: 'First Order', details: 'First Order rises. Episode VII.' },
  { label: 'The Last Jedi', year: 34, era: 'First Order', details: "Rey's training. Episode VIII." },
  { label: 'The Rise of Skywalker', year: 35, era: 'First Order', details: "Palpatine returns. Episode IX." },
  { label: 'Resistance', year: 34, era: 'First Order', details: 'Resistance fights back. Resistance (Show).' },
];

export const TimelineSlider: React.FC = () => {
  const [selected, setSelected] = useState(11); // Start at A New Hope
  const [dragY, setDragY] = useState(0);
  const navigate = useNavigate();

  // Slider logic
  const min = 0;
  const max = TIMELINE.length - 1;
  const sliderHeight = 600; // Increased for a longer slider
  const step = sliderHeight / (TIMELINE.length - 1);

  // Snap to nearest checkpoint
  const handleDrag = (_event: any, info: { point: { y: number } }) => {
    let idx = Math.round(info.point.y / step);
    idx = Math.max(min, Math.min(max, idx));
    setSelected(idx);
    setDragY(idx * step);
  };

  // Click on checkpoint
  const handleCheckpointClick = (idx: number) => {
    setSelected(idx);
    setDragY(idx * step);
  };

  return (
    <div className="w-full flex flex-col items-center py-8 pb-24 select-none">
      {/* Star Wars phrase above slider */}
      <div className="mb-4 text-center">
        <div style={{
          fontFamily: 'Star Jedi, Arial Black, Arial',
          color: '#ffe81f',
          fontSize: 26,
          letterSpacing: 2,
          textShadow: '0 0 8px #000',
        }}>
          Navigate the Timeline
        </div>
        <div style={{
          fontFamily: 'Star Jedi, Arial Black, Arial',
          color: '#60a5fa',
          fontSize: 16,
          letterSpacing: 1.5,
          marginTop: 4,
          textShadow: '0 0 4px #000',
        }}>
          Discover the Saga of Star Wars
        </div>
      </div>
      <motion.div
        className="relative flex flex-col items-center"
        style={{ minHeight: sliderHeight + 40, height: sliderHeight + 40 }}
      >
        {/* Vertical slider track - clean, no glow */}
        <div
          className="absolute left-1/2 top-8 bottom-8 w-2 bg-gray-800 border border-yellow-400"
          style={{ transform: 'translateX(-50%)', height: sliderHeight, borderRadius: 8, opacity: 0.85 }}
        />
        {/* Checkpoints */}
        {TIMELINE.map((point, idx) => (
          <div
            key={point.label}
            className="absolute left-1/2"
            style={{
              top: 8 + idx * step,
              transform: 'translateX(-50%)',
              zIndex: 10,
              cursor: 'pointer',
            }}
            onClick={() => handleCheckpointClick(idx)}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: idx === selected ? '#ffe81f' : '#222',
                border: idx === selected ? '3px solid #ffe81f' : '2px solid #888',
                boxShadow: idx === selected ? '0 0 0 2px #181a22' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: idx === selected ? '#ffe81f' : '#888',
                }}
              />
            </div>
          </div>
        ))}
        {/* Draggable handle */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: sliderHeight }}
          dragElastic={0.12}
          onDrag={handleDrag}
          style={{ y: dragY, zIndex: 20 }}
          className="absolute left-1/2 w-12 h-12 rounded-full flex items-center justify-center border-2 cursor-pointer bg-gray-900 border-yellow-400"
          initial={{ y: selected * step }}
          animate={{ y: dragY }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <span
            style={{
              fontFamily: 'Star Jedi, Arial Black, Arial',
              color: '#ffe81f',
              fontSize: 20,
              letterSpacing: 2,
              textShadow: '0 0 4px #000',
            }}
          >
            {TIMELINE[selected].label[0]}
          </span>
        </motion.div>
        {/* Popout detail card above handle */}
        <AnimatePresence>
          <motion.div
            key={selected}
            className="absolute left-1/2 bottom-32 w-96 max-w-sm bg-black/95 border-2 rounded-xl shadow-xl px-6 py-4"
            style={{
              transform: 'translateX(-50%)',
              borderColor: '#ffe81f',
              color: '#ffe81f',
              fontFamily: 'Star Jedi, Arial Black, Arial',
              zIndex: 30,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="text-lg font-bold mb-1" style={{ letterSpacing: 2 }}>{TIMELINE[selected].label}</div>
            <div className="text-xs text-gray-300 mb-2" style={{ fontFamily: 'inherit', opacity: 0.8 }}>{TIMELINE[selected].era} &middot; {TIMELINE[selected].year > 0 ? `${TIMELINE[selected].year} ABY` : `${-TIMELINE[selected].year} BBY`}</div>
            <div className="text-sm mb-1" style={{ color: '#fff', fontFamily: 'inherit', opacity: 0.95 }}>{TIMELINE[selected].details}</div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {/* Go to Map button */}
      <div className="mt-10 flex flex-col items-center">
        <div style={{
          fontFamily: 'Star Jedi, Arial Black, Arial',
          color: '#dc2626',
          fontSize: 20,
          letterSpacing: 2,
          marginBottom: 8,
          textShadow: '0 0 8px #000',
        }}>
          Go to Map
        </div>
        <button
          onClick={() => navigate('/galaxy-map')}
          style={{
            fontFamily: 'Star Jedi, Arial Black, Arial',
            background: '#181a22',
            color: '#fff',
            border: '2.5px solid #dc2626',
            borderRadius: 14,
            fontSize: 22,
            padding: '16px 48px',
            letterSpacing: 2,
            boxShadow: '0 0 24px 4px #dc2626, 0 0 48px 8px #dc2626aa',
            cursor: 'pointer',
            marginTop: 4,
            transition: 'all 0.2s',
            textShadow: '0 0 8px #dc2626, 0 0 16px #fff',
          }}
        >
          LAUNCH GALAXY MAP
        </button>
      </div>
    </div>
  );
}; 
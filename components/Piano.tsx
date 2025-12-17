import React, { useRef, useEffect } from 'react';
import Key from './Key';
import { GameStatus } from '../types';

interface PianoProps {
  onKeyPress: (noteCode: string) => void;
  pressedKeys: string[]; 
  errorKeys: string[];   
  status: GameStatus;
}

const Piano: React.FC<PianoProps> = ({ onKeyPress, pressedKeys, errorKeys, status }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Expanded Range: 5 Octaves (C2 to B6)
  const octaves = [2, 3, 4, 5, 6];
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  
  // Scroll to middle C (C4) on mount for better initial UX
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Approximate center calculation:
      // Total width approx 1500px, center is around 750px.
      // C4 is the 3rd octave out of 5.
      const scrollPos = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, []); // Run once on mount

  const renderKeys = () => {
    const whiteKeys = [];
    const blackKeys = [];
    let whiteKeyIndex = 0;
    const totalWhiteKeys = octaves.length * 7;
    
    // Calculate precise width for absolute positioning of black keys
    // White keys are min-width 44px (touch target size)
    // We use a fixed percentage logic based on the container size required to hold all keys
    
    octaves.forEach(octave => {
      notes.forEach((note) => {
        const fullCode = `${note}${octave}`;
        const isMiddleC = fullCode === 'C4';
        
        whiteKeys.push(
          <div key={fullCode} className="flex-shrink-0 w-11 sm:w-14 relative group">
             <Key
                label={fullCode}
                isSharp={false}
                onClick={() => onKeyPress(fullCode)}
                status={status}
                isPressed={pressedKeys.includes(fullCode)}
                isError={errorKeys.includes(fullCode)}
            />
            {isMiddleC && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-50 pointer-events-none" title="Middle C"></div>
            )}
          </div>
        );

        if (['C', 'D', 'F', 'G', 'A'].includes(note)) {
          const sharpNote = `${note}#${octave}`;
          // ... logic for black keys handled below in unified loop
        }
        whiteKeyIndex++;
      });
    });
    
    // Re-rendering strategy for better structure
    const keys = [];
    
    for (let o = 0; o < octaves.length; o++) {
        const octave = octaves[o];
        for (let n = 0; n < notes.length; n++) {
            const note = notes[n];
            const fullCode = `${note}${octave}`;
            const isMiddleC = fullCode === 'C4';
            
            const hasSharp = ['C', 'D', 'F', 'G', 'A'].includes(note);
            const sharpNote = `${note}#${octave}`;

            keys.push(
                <div key={fullCode} className="relative flex-shrink-0 w-10 sm:w-14 h-full">
                    {/* White Key */}
                    <Key
                        label={fullCode}
                        isSharp={false}
                        onClick={() => onKeyPress(fullCode)}
                        status={status}
                        isPressed={pressedKeys.includes(fullCode)}
                        isError={errorKeys.includes(fullCode)}
                    />
                     {isMiddleC && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full z-[5] pointer-events-none"></div>
                    )}
                    
                    {/* Black Key (if applicable) */}
                    {hasSharp && (
                        <div 
                            className="absolute top-0 -right-3 sm:-right-4 w-6 sm:w-8 h-[60%] z-20 pointer-events-auto"
                        >
                            <Key
                                label={sharpNote}
                                isSharp={true}
                                onClick={() => onKeyPress(sharpNote)}
                                status={status}
                                isPressed={pressedKeys.includes(sharpNote)}
                                isError={errorKeys.includes(sharpNote)}
                            />
                        </div>
                    )}
                </div>
            );
        }
    }
    return keys;
  };

  return (
    <div className="w-full mt-4">
        <div 
            className="relative bg-slate-900 py-3 shadow-2xl overflow-hidden border-t-8 border-red-900 w-full"
            style={{ boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.3)' }}
        >
            {/* Scroll Container */}
            <div 
                ref={scrollContainerRef}
                className="overflow-x-auto overflow-y-hidden pb-4 pt-1 hide-scrollbar"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {/* 
                  Use justify-center to center keys if they fit on screen (large displays).
                  Use mx-auto to center content.
                */}
                <div className="flex h-48 sm:h-64 min-w-max px-0 mx-auto">
                    {renderKeys()}
                </div>
            </div>
            
            {/* Scroll Hints (Gradients) - Only useful if content overflows */}
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-slate-900 to-transparent pointer-events-none opacity-40"></div>
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-900 to-transparent pointer-events-none opacity-40"></div>
        </div>
        <div className="text-center mt-2 text-xs text-slate-400">
             Scroll to see more octaves
        </div>
    </div>
  );
};

export default Piano;
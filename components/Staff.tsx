import React, { useEffect, useRef } from 'react';
import { Factory } from 'vexflow';
import { Question, ClefType, KeySignature } from '../types';

interface StaffProps {
  question: Question;
  clefMode: ClefType;
  keySignature: KeySignature;
  width?: number;
  height?: number;
}

const Staff: React.FC<StaffProps> = ({ 
  question, 
  clefMode, 
  keySignature, 
  width = 300, 
  height = 200 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const vf = new Factory({
      renderer: { elementId: containerRef.current, width, height },
    });

    const score = vf.EasyScore();
    const system = vf.System();

    // Logic to determine display Clef
    let displayClef = clefMode;
    if (displayClef === 'auto') {
      // Use root note to decide. C4+ = treble, <C4 = bass
      const root = question.notes[0];
      displayClef = root.octave >= 4 ? 'treble' : 'bass';
    }

    // Construct chord keys string for VexFlow
    // EasyScore syntax for chords: "(C4 E4 G4)/w"
    // Also need to handle accidentals. 
    // VexFlow's EasyScore + addKeySignature usually handles diatonics automatically,
    // but sometimes explicit accidentals are safer if the logic is complex.
    // However, since we strictly generate diatonic notes, let's pass the raw keys.
    // Example: F# in G Major. keySignature='G'. Note='F#4'. VexKey='f#/4'.
    // VexFlow auto-hides the sharp symbol if it matches key signature.
    
    const keys = question.notes.map(n => n.vexKey).join(' ');
    const noteString = question.notes.length > 1 ? `(${keys})/w` : `${keys}/w`;

    system
      .addStave({
        voices: [
          score.voice(score.notes(noteString, { clef: displayClef, stem: 'up' })),
        ],
      })
      .addClef(displayClef)
      .addKeySignature(keySignature)
      .addTimeSignature('4/4');

    vf.draw();
  }, [question, clefMode, keySignature, width, height]);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center items-center bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    />
  );
};

export default Staff;

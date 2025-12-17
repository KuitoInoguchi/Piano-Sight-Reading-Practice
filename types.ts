export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = '#' | 'b' | 'n' | '';

export interface NoteObj {
  name: NoteName;
  octave: number;
  accidental: Accidental;
  fullCode: string; // The theoretical name, e.g., "Db4", "E#4"
  vexKey: string;   // Format for VexFlow, e.g., "db/4"
  frequency: number;
  pianoKey: string; // The physical key on the keyboard, e.g., "C#4", "F4"
}

export interface Question {
  notes: NoteObj[];
  rootFullCode: string; 
}

export type GameStatus = 'waiting' | 'correct' | 'incorrect';

export type ClefType = 'treble' | 'bass' | 'auto';
export type GameMode = 'single' | 'chord' | 'challenge';

// All standard major keys
export type KeySignature = 
  // No sharps/flats
  'C' | 
  // Sharps
  'G' | 'D' | 'A' | 'E' | 'B' | 'F#' | 'C#' | 
  // Flats
  'F' | 'Bb' | 'Eb' | 'Ab' | 'Db' | 'Gb' | 'Cb';

export type Difficulty = 'normal' | 'hard';
export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'ja';

export interface ScoreRecord {
  id: string;
  timestamp: number;
  score: number;
  maxStreak: number;
  difficulty: Difficulty;
}

export interface PianoKeyProps {
  label: string;
  isSharp: boolean;
  leftPos?: number;
  onClick: () => void;
  status: GameStatus;
  isTarget: boolean; 
  isPressed: boolean; 
  isError: boolean;   
}
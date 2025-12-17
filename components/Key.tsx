import React from 'react';
import { GameStatus } from '../types';

interface KeyProps {
  label: string;
  isSharp: boolean;
  leftPos?: number; // No longer used in new layout, but kept for interface compatibility
  onClick: () => void;
  isPressed: boolean; 
  isError: boolean;   
  status: GameStatus; 
}

const Key: React.FC<KeyProps> = ({ label, isSharp, onClick, isPressed, isError, status }) => {
  
  // Base Colors
  let bgColorClass = isSharp ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900';
  let borderClass = isSharp ? 'border-b-4 border-slate-950' : 'border border-b-4 border-slate-300';
  
  // Interaction Colors
  if (isError) {
     bgColorClass = 'bg-rose-500 text-white';
     borderClass = 'border-rose-700 border-b-4';
  } else if (isPressed) {
     if (status === 'correct') {
       bgColorClass = 'bg-emerald-500 text-white';
       borderClass = 'border-emerald-700 border-b-4';
     } else {
       bgColorClass = 'bg-indigo-500 text-white';
       borderClass = 'border-indigo-700 border-b-4';
     }
  }

  // Hover effects
  const hoverClass = (!isPressed && !isError && status === 'waiting')
    ? (isSharp ? 'active:bg-slate-800' : 'active:bg-slate-100') // Use active for touch feel
    : '';

  const commonStyles = "w-full flex flex-col justify-end items-center transition-all duration-75 shadow-sm no-select rounded-b-md";
  
  const heightStyle = isSharp ? 'h-full pb-2' : 'h-full pb-3';

  return (
    <button
      onClick={onClick}
      className={`${commonStyles} ${bgColorClass} ${borderClass} ${hoverClass} ${heightStyle}`}
      disabled={status === 'correct'} 
      aria-label={label}
    >
      <span className={`text-[9px] sm:text-[10px] font-semibold opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity ${isPressed || isError ? 'opacity-100' : ''}`}>
        {/* Only show label on hover/press to keep UI clean, or helpful for learning */}
        {label}
      </span>
    </button>
  );
};

export default Key;
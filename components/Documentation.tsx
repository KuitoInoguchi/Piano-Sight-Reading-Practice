import React from 'react';
import { TRANSLATIONS } from '../utils/translations';
import { Language } from '../types';
import { X, BookOpen, Music } from 'lucide-react';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const Documentation: React.FC<DocumentationProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang].docs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{t.title}</h2>
              <p className="text-xs text-slate-500">{t.intro}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-6 space-y-8 text-slate-700">
          
          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-700 mb-2">
               <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> 
               {t.staffTitle}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line ml-3.5">
              {t.staffBody}
            </p>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-700 mb-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> 
                {t.clefTitle}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line ml-3.5">
              {t.clefBody}
            </p>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-700 mb-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> 
                {t.notesTitle}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line ml-3.5">
              {t.notesBody}
            </p>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-700 mb-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> 
                {t.accTitle}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line ml-3.5">
              {t.accBody}
            </p>
          </section>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Music className="w-4 h-4" /> {t.tipsTitle}
            </h3>
            <p className="text-sm text-amber-900 whitespace-pre-line leading-relaxed">
               {t.tipsBody}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
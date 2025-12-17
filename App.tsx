import React, { useState, useEffect, useCallback, useRef } from 'react';
import Staff from './components/Staff';
import Piano from './components/Piano';
import Documentation from './components/Documentation';
import { generateQuestion, playTone, getFrequency } from './utils/music';
import { Question, GameStatus, GameMode, ClefType, KeySignature, Difficulty, Language, ScoreRecord } from './types';
import { TRANSLATIONS } from './utils/translations';
import { Music, Trophy, Zap, Clock, Settings, ChevronDown, Award, Book, Globe, Play, X, History as HistoryIcon } from 'lucide-react';

const App: React.FC = () => {
  // Settings State
  const [mode, setMode] = useState<GameMode>('single');
  const [clef, setClef] = useState<ClefType>('auto');
  const [keySig, setKeySig] = useState<KeySignature>('C');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [language, setLanguage] = useState<Language>('en');
  const [showSettings, setShowSettings] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Game State
  const [question, setQuestion] = useState<Question | null>(null);
  const [status, setStatus] = useState<GameStatus>('waiting');
  
  // Scoring State
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  // Challenge Mode State
  const [timeLeft, setTimeLeft] = useState(60);
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [gameHistory, setGameHistory] = useState<ScoreRecord[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);

  // Interaction State
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [errorKeys, setErrorKeys] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  const t = TRANSLATIONS[language];

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('piano_sight_history');
    if (saved) {
      try {
        setGameHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  // Save History
  const saveHistory = (newRecord: ScoreRecord) => {
    const updated = [newRecord, ...gameHistory].slice(0, 50); // Keep last 50
    setGameHistory(updated);
    localStorage.setItem('piano_sight_history', JSON.stringify(updated));
  };

  // Reset feedback text when language/mode changes
  useEffect(() => {
    if (status === 'waiting' && !isChallengeActive && mode !== 'challenge') {
        setFeedback(mode === 'single' ? t.waitingSingle : t.waitingChord);
    }
  }, [language, mode, status, t, isChallengeActive]);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (mode === 'challenge' && isChallengeActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (mode === 'challenge' && isChallengeActive && timeLeft === 0) {
      // Game Over
      setIsChallengeActive(false);
      setShowGameOver(true);
      playTone(300, 'sine', 0.5); // Game over sound (low pitch)
      
      const record: ScoreRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        score,
        maxStreak: streak, // Note: current streak might not be max, but simplifying for now. Ideally track maxStreak separately.
        difficulty
      };
      saveHistory(record);
    }
    return () => clearInterval(interval);
  }, [mode, isChallengeActive, timeLeft, score, streak, difficulty]);

  // Generator
  const nextQuestion = useCallback(() => {
    // If challenge mode ends, don't generate
    if (mode === 'challenge' && !isChallengeActive && timeLeft === 0) return;

    // Challenge mode enforces single note logic for fairness/speed
    // But we pass 'single' to generator if mode is challenge
    const genMode = mode === 'challenge' ? 'single' : mode;

    const q = generateQuestion(genMode, clef, keySig, difficulty);
    setQuestion(prev => {
       if (prev && prev.rootFullCode === q.rootFullCode) {
         return generateQuestion(genMode, clef, keySig, difficulty);
       }
       return q;
    });
    setStatus('waiting');
    setPressedKeys([]);
    setErrorKeys([]);
    setLastPoints(null);
    setFeedback(genMode === 'single' ? t.waitingSingle : t.waitingChord);
    startTimeRef.current = Date.now();
  }, [mode, clef, keySig, difficulty, t, isChallengeActive, timeLeft]);

  // Initial load
  useEffect(() => {
    if (mode !== 'challenge') {
        nextQuestion();
    }
  }, [nextQuestion, mode]);

  const startChallenge = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setIsChallengeActive(true);
    setShowGameOver(false);
    nextQuestion();
  };

  const calculateScore = (isCorrect: boolean) => {
      if (!isCorrect) {
          setStreak(0);
          setScore(s => Math.max(0, s - 50)); 
          return;
      }

      const timeTaken = Date.now() - startTimeRef.current;
      const basePoints = 100;
      
      const timeBonus = Math.max(0, Math.floor(50 * (1 - timeTaken / 10000)));
      const streakBonus = Math.min(streak * 10, 100);
      
      const totalPoints = basePoints + timeBonus + streakBonus;
      
      setScore(s => s + totalPoints);
      setStreak(s => s + 1);
      setLastPoints(totalPoints);
  };

  const handleKeyPress = (pianoKeyCode: string) => {
    if (mode === 'challenge' && !isChallengeActive) return;
    if (status === 'correct' || !question) return;

    // Play Sound
    const match = pianoKeyCode.match(/^([A-G][#b]?)([0-9])$/);
    if (match) {
        const freq = getFrequency(match[1], parseInt(match[2]));
        playTone(freq, 'triangle', 0.3); // Shorter duration for rapid fire
    }

    // Determine current logic (Challenge uses 'single' logic)
    const currentLogic = mode === 'challenge' ? 'single' : mode;

    if (currentLogic === 'single') {
        const targetPianoKey = question.notes[0].pianoKey;
        if (pianoKeyCode === targetPianoKey) {
            handleSuccess([pianoKeyCode]);
        } else {
            handleError(pianoKeyCode);
        }
    } else {
        // Chord Logic
        const isTarget = question.notes.some(n => n.pianoKey === pianoKeyCode);
        if (isTarget) {
            if (!pressedKeys.includes(pianoKeyCode)) {
                const newPressed = [...pressedKeys, pianoKeyCode];
                setPressedKeys(newPressed);
                if (newPressed.length === question.notes.length) {
                    handleSuccess(newPressed);
                }
            }
        } else {
            handleError(pianoKeyCode);
        }
    }
  };

  const handleSuccess = (winningKeys: string[]) => {
    setPressedKeys(winningKeys);
    setStatus('correct');
    calculateScore(true);
    setFeedback(t.correct);
    
    // Faster transition in Challenge Mode
    const delay = mode === 'challenge' ? 300 : 1200;
    setTimeout(nextQuestion, delay);
  };

  const handleError = (wrongKey: string) => {
    setErrorKeys(prev => [...prev, wrongKey]);
    calculateScore(false);
    setFeedback(t.incorrect);
    
    setTimeout(() => {
        setErrorKeys(prev => prev.filter(k => k !== wrongKey));
    }, 500);
  };

  const keysMajor = [
      'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 
      'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden relative">
      
      <Documentation isOpen={showDocs} onClose={() => setShowDocs(false)} lang={language} />

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
             <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b flex justify-between items-center bg-indigo-50">
                    <h3 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
                        <HistoryIcon className="w-5 h-5"/> {t.challenge.history}
                    </h3>
                    <button onClick={() => setShowHistory(false)}><X className="w-5 h-5 text-slate-500"/></button>
                </div>
                <div className="overflow-y-auto p-4 flex-1">
                    {gameHistory.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">{t.challenge.noHistory}</p>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-2 py-2">{t.challenge.date}</th>
                                    <th className="px-2 py-2">{t.score}</th>
                                    <th className="px-2 py-2">{t.difficulty}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gameHistory.map(rec => (
                                    <tr key={rec.id} className="border-b border-slate-100 last:border-0">
                                        <td className="px-2 py-3 text-slate-600">
                                            {new Date(rec.timestamp).toLocaleDateString()}
                                        </td>
                                        <td className="px-2 py-3 font-bold text-indigo-600">{rec.score}</td>
                                        <td className="px-2 py-3 text-slate-500 capitalize">{t.diffs[rec.difficulty]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
             </div>
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOver && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in zoom-in-95">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-indigo-100">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">{t.challenge.gameOver}</h2>
                  <p className="text-slate-500 mb-6">{t.challenge.finalScore}</p>
                  
                  <div className="text-5xl font-black text-indigo-600 mb-8 tracking-tight">
                      {score}
                  </div>

                  <div className="flex gap-3">
                      <button 
                        onClick={() => setShowHistory(true)}
                        className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                      >
                          {t.challenge.history}
                      </button>
                      <button 
                        onClick={startChallenge}
                        className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                      >
                          {t.challenge.playAgain}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Center Content Wrapper */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center flex-1">
          
          {/* Header & Stats */}
          <header className="w-full mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                        <Music className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 leading-tight">{t.title}</h1>
                        <p className="text-xs text-slate-500 font-medium">{t.subtitle}</p>
                    </div>
                </div>

                {/* Stats Display */}
                <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-center">
                    {/* Timer (Challenge Mode Only) */}
                    {mode === 'challenge' && (
                        <>
                         <div className={`flex flex-col items-center min-w-[60px] ${timeLeft < 10 ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {t.challenge.timeLeft}
                            </span>
                            <span className="text-2xl font-black leading-none mt-1 font-mono">{timeLeft}</span>
                         </div>
                         <div className="w-px h-8 bg-slate-200"></div>
                        </>
                    )}

                    <div className="flex flex-col items-center min-w-[60px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> {t.score}
                        </span>
                        <span className="text-2xl font-black text-indigo-900 leading-none mt-1">{score}</span>
                    </div>
                    
                    <div className="w-px h-8 bg-slate-200"></div>
                    
                    <div className="flex flex-col items-center min-w-[60px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Zap className={`w-3 h-3 ${streak > 2 ? 'text-amber-500 fill-amber-500' : ''}`} /> {t.combo}
                        </span>
                        <span className={`text-2xl font-black leading-none mt-1 ${streak > 4 ? 'text-amber-500' : 'text-slate-700'}`}>
                            {streak}x
                        </span>
                    </div>
                </div>

                {/* Desktop Controls */}
                <div className="hidden md:flex items-center gap-2">
                    <button 
                        onClick={() => setShowHistory(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
                        title={t.challenge.history}
                    >
                        <HistoryIcon className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setShowDocs(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
                        title={t.help}
                    >
                        <Book className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
                    >
                        <Settings className="w-4 h-4" /> {t.settings}
                    </button>
                </div>
            </div>

            {/* Mobile Settings Toggle */}
            <div className="md:hidden w-full mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold shadow-sm"
                >
                    <Settings className="w-4 h-4" /> {t.settings} {showSettings ? <ChevronDown className="w-4 h-4 rotate-180"/> : <ChevronDown className="w-4 h-4"/>}
                </button>
                 <button 
                    onClick={() => setShowHistory(true)}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm"
                >
                    <HistoryIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setShowDocs(true)}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm"
                >
                    <Book className="w-5 h-5" />
                </button>
            </div>

            {/* Settings Panel */}
            {(showSettings) && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Language */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Globe className="w-3 h-3"/> {t.language}</label>
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="w-full bg-slate-100 text-sm font-bold text-slate-600 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="en">English</option>
                                <option value="zh-CN">简体中文</option>
                                <option value="zh-TW">繁體中文</option>
                                <option value="ja">日本語</option>
                            </select>
                        </div>

                        {/* Mode */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">{t.mode}</label>
                            <div className="flex p-1 bg-slate-100 rounded-lg overflow-hidden">
                                {(['single', 'chord', 'challenge'] as GameMode[]).map(m => (
                                    <button 
                                        key={m} 
                                        onClick={() => {
                                            setMode(m);
                                            // Reset game state when switching modes
                                            setIsChallengeActive(false);
                                            setTimeLeft(60);
                                            setScore(0);
                                            setStreak(0);
                                        }} 
                                        className={`flex-1 py-1.5 text-[10px] sm:text-xs font-bold capitalize transition-colors ${mode === m ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}
                                    >
                                        {t.modes[m]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Difficulty */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">{t.difficulty}</label>
                            <div className="flex p-1 bg-slate-100 rounded-lg">
                                {(['normal', 'hard'] as Difficulty[]).map(d => (
                                    <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize ${difficulty === d ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>
                                        {t.diffs[d]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Clef */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">{t.clef}</label>
                            <div className="flex p-1 bg-slate-100 rounded-lg">
                                {(['treble', 'bass', 'auto'] as ClefType[]).map(c => (
                                    <button key={c} onClick={() => setClef(c)} className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize ${clef === c ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>
                                        {t.clefs[c]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Key */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">{t.keySig}</label>
                            <select 
                                value={keySig}
                                onChange={(e) => setKeySig(e.target.value as KeySignature)}
                                className="w-full bg-slate-100 text-sm font-bold text-slate-600 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {keysMajor.map(k => (
                                    <option key={k} value={k}>{k} Major</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
          </header>

          {/* Feedback / Score Floating Popup */}
          <div className="relative h-8 w-full flex justify-center items-center">
              {lastPoints && status === 'correct' && (
                  <div className="absolute -top-4 animate-bounce text-emerald-600 font-black text-lg flex items-center gap-1">
                      +{lastPoints} pts <Award className="w-5 h-5" />
                  </div>
              )}
              <div className={`
                  px-6 py-1.5 rounded-full font-bold text-sm transition-all duration-300 transform shadow-sm
                  ${status === 'correct' ? 'bg-emerald-100 text-emerald-700 scale-110' : ''}
                  ${status === 'incorrect' ? 'bg-rose-100 text-rose-700 shake' : ''}
                  ${status === 'waiting' ? 'bg-white border border-slate-200 text-slate-500' : ''}
              `}>
                  {feedback}
              </div>
          </div>

          {/* Staff Card */}
          <div className="mt-6 bg-white p-4 sm:p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 flex flex-col items-center relative transition-all">
              
              {/* Challenge Start Overlay */}
              {mode === 'challenge' && !isChallengeActive && !showGameOver && (
                <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.challenge.start}</h2>
                    <p className="text-slate-500 mb-6 max-w-[200px]">{t.challenge.desc}</p>
                    <button 
                        onClick={startChallenge}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Play className="w-5 h-5 fill-current" /> {t.challenge.start}
                    </button>
                </div>
              )}

              <div className="absolute top-4 left-5 flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wide">{t.clefs[clef]}</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wide">{keySig} Major</span>
              </div>
              
              <div className="mt-2">
                  {question && (
                      <Staff 
                          question={question} 
                          clefMode={clef} 
                          keySignature={keySig}
                          width={window.innerWidth < 400 ? 280 : 340} 
                          height={200} 
                      />
                  )}
              </div>
          </div>

          {/* Instructions */}
          <p className="mt-6 text-slate-400 text-xs text-center max-w-xs leading-relaxed">
              {difficulty === 'hard' && <span className="block text-amber-600 font-semibold mb-1">{t.hardModeActive}</span>}
              {t.instruction}
          </p>
      </div>

      {/* Piano Component - Full Width */}
      <div className="w-full">
        <Piano 
            onKeyPress={handleKeyPress} 
            pressedKeys={pressedKeys}
            errorKeys={errorKeys}
            status={status}
        />
      </div>

    </div>
  );
};

export default App;
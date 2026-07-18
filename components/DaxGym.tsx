import React, { useState, useMemo, useEffect } from 'react';
import { Page, Difficulty } from '../types';
import {
  Home as HomeIcon, Menu, ChevronLeft, ChevronRight, Lightbulb, Unlock, Lock,
  TrendingUp, Check, X, BarChart3, Play, Database, Shuffle,
} from 'lucide-react';
import UserBadge from './UserBadge';
import {
  DAX_TOPICS, DAX_EXERCISES, DAX_MODEL_NOTE, DAX_TOPIC_TOTALS, getDaxExercises,
} from '../services/daxExercises';
import { DaxExercise, DaxTopicId, checkDaxFormula } from '../daxTypes';
import AiExplainButton from './AiExplainButton';

interface DaxGymProps {
  onBack: () => void;
  onNavigate?: (page: Page) => void;
}

const COMPLETED_KEY = 'dax_completed_v1';

// Exercises shown at once. The pool is larger, so shuffle / reopen swaps some.
const DAX_SHOWN_PER_SET = 8;

function loadCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

const DaxGym: React.FC<DaxGymProps> = ({ onBack, onNavigate }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [topic, setTopic] = useState<DaxTopicId | 'all'>('all');
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [formula, setFormula] = useState('');
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompleted());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Bumping this re-draws a fresh random subset from the (larger) pool.
  const [shuffleNonce, setShuffleNonce] = useState(0);

  const exercises = useMemo<DaxExercise[]>(() => {
    const byDiff = getDaxExercises(difficulty);
    const pool = topic === 'all' ? byDiff : byDiff.filter((e) => e.topicId === topic);
    // Show only a subset; shuffle / reopen swaps some out and reshuffles order.
    // (shuffleNonce is a dependency so the button re-draws.)
    void shuffleNonce;
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, DAX_SHOWN_PER_SET);
  }, [difficulty, topic, shuffleNonce]);

  const exercise = exercises[index];

  // Reset per-exercise state whenever the visible exercise changes.
  useEffect(() => {
    setChoice(null);
    setFormula('');
    setResult('idle');
    setShowHint(false);
    setShowSolution(false);
  }, [exercise?.id]);

  // Keep the index valid when difficulty/topic shrink the list.
  useEffect(() => {
    if (index > exercises.length - 1) setIndex(0);
  }, [exercises.length, index]);

  const markCompleted = (id: string) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem(COMPLETED_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const check = () => {
    if (!exercise) return;
    let ok = false;
    if (exercise.kind === 'mcq') {
      if (choice === null) return;
      ok = choice === exercise.correctIndex;
    } else {
      ok = checkDaxFormula(formula, exercise.accepted);
    }
    setResult(ok ? 'correct' : 'wrong');
    if (ok) markCompleted(exercise.id);
  };

  const go = (delta: number) => {
    setIndex((i) => Math.min(Math.max(i + delta, 0), exercises.length - 1));
  };

  const totalDone = completed.size;
  const totalAll = DAX_EXERCISES.length;

  // Per-topic completion count for the sidebar (across all difficulties).
  const doneByTopic = useMemo(() => {
    const map: Record<string, number> = {};
    for (const ex of DAX_EXERCISES) {
      if (completed.has(ex.id)) map[ex.topicId] = (map[ex.topicId] || 0) + 1;
    }
    return map;
  }, [completed]);

  const difficulties = Object.values(Difficulty);

  return (
    <div className="h-screen flex bg-transparent text-slate-200 font-sans overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-72' : 'hidden'} md:relative md:flex md:w-[270px] flex-col shrink-0 bg-[#0c0c0c] md:bg-transparent border-r border-white/5 h-full`}
      >
        <div className="px-5 pt-5 pb-3 flex items-center gap-2">
          <BarChart3 size={22} className="text-yellow-400" />
          <span className="font-black tracking-tight text-lg text-white">DAX <span className="text-yellow-400">LAB</span></span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">
          <button
            onClick={() => { setTopic('all'); setIndex(0); setMobileSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${topic === 'all' ? 'bg-yellow-500/10 ring-1 ring-yellow-500/30' : 'hover:bg-white/5'}`}
          >
            <span className={`text-sm font-bold ${topic === 'all' ? 'text-yellow-300' : 'text-slate-200'}`}>Tutti gli argomenti</span>
          </button>
          {DAX_TOPICS.map((t) => {
            const active = topic === t.id;
            const done = doneByTopic[t.id] || 0;
            const total = DAX_TOPIC_TOTALS[t.id] || 0;
            return (
              <button
                key={t.id}
                onClick={() => { setTopic(t.id); setIndex(0); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${active ? 'bg-yellow-500/10 ring-1 ring-yellow-500/30' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-bold ${active ? 'text-yellow-300' : 'text-slate-200'}`}>{t.label}</span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{done}/{total}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 tracking-wide">{t.subtitle}</div>
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-3 border-t border-white/5 text-[10px] text-slate-500 leading-relaxed">
          {totalDone}/{totalAll} completati
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 px-3 md:px-6 h-full relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-2 mt-2 md:mt-4 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="h-10 w-10 shrink-0 grid place-items-center text-slate-300 hover:text-white bg-white/[0.04] ring-1 ring-white/10 rounded-xl hover:bg-white/[0.08] transition-all active:scale-95"
              aria-label="Torna alla home"
            >
              <HomeIcon size={18} />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden h-10 w-10 shrink-0 grid place-items-center text-slate-300 hover:text-white bg-white/[0.04] ring-1 ring-white/10 rounded-xl hover:bg-white/[0.08] transition-all active:scale-95"
              aria-label="Argomenti"
            >
              <Menu size={18} />
            </button>

            {/* Difficulty selector */}
            <div className="flex bg-[#121212]/70 backdrop-blur-xl rounded-xl p-1.5 shadow-lg shadow-black/20">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); setIndex(0); }}
                  className={`px-3 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-colors min-w-[64px] ${difficulty === d ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShuffleNonce((n) => n + 1); setIndex(0); }}
              title="Mescola esercizi"
              className="h-10 flex items-center gap-2 py-2 px-3 text-slate-300 hover:text-white rounded-xl bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.08] transition-all group"
            >
              <Shuffle size={16} className="group-active:rotate-180 transition-transform duration-500" />
              <span className="text-xs font-bold hidden sm:inline">Mescola</span>
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate(Page.Analytics)}
                className="h-10 hidden sm:flex items-center gap-2 py-2 px-3 text-purple-300 hover:text-white rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <TrendingUp size={16} />
                <span className="text-xs font-bold">Analytics</span>
              </button>
            )}
            <UserBadge onNavigate={onNavigate} />
          </div>
        </header>

        {/* Model note */}
        <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-[#121212]/50 backdrop-blur-xl rounded-xl px-4 py-2.5 mb-3 shrink-0">
          <Database size={14} className="text-yellow-400/70 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{DAX_MODEL_NOTE}</span>
        </div>

        {!exercise ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Nessun esercizio per questa combinazione. Cambia argomento o difficoltà.
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto pb-6 gap-3">
            {/* Counter row */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-[#121212]/70 backdrop-blur-xl rounded-xl p-1.5 shadow-lg shadow-black/20">
                <button
                  onClick={() => go(-1)}
                  disabled={index === 0}
                  className="flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Precedente"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="px-3 min-w-[4rem] text-center font-mono text-xs font-bold text-slate-300">
                  <span className="text-yellow-300">{index + 1}</span> <span className="text-slate-500">/</span> {exercises.length}
                </div>
                <button
                  onClick={() => go(1)}
                  disabled={index === exercises.length - 1}
                  className="flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Successivo"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              {completed.has(exercise.id) && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-lg px-2.5 py-1.5 ring-1 ring-emerald-500/20">
                  <Check size={14} /> Fatto
                </span>
              )}
              <span className="ml-auto text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-white/5 rounded-lg px-2.5 py-1.5">
                {exercise.kind === 'mcq' ? 'Quiz' : 'Scrivi la misura'}
              </span>
            </div>

            {/* Exercise card */}
            <div className="bg-[#121212]/70 backdrop-blur-xl rounded-2xl px-6 py-5 shrink-0">
              <h2 className="text-xl text-white font-bold mb-2 leading-tight">{exercise.title}</h2>
              <p className="text-slate-200 text-sm leading-relaxed">{exercise.scenario}</p>
            </div>

            {/* MCQ options or formula input */}
            {exercise.kind === 'mcq' ? (
              <div className="space-y-2">
                {exercise.options.map((opt, i) => {
                  const isChosen = choice === i;
                  const isRight = i === exercise.correctIndex;
                  const showState = result !== 'idle';
                  let cls = 'bg-[#121212]/70 hover:bg-white/5 ring-1 ring-white/5 text-slate-200';
                  if (showState && isRight) cls = 'bg-emerald-500/15 ring-1 ring-emerald-500/40 text-emerald-200';
                  else if (showState && isChosen && !isRight) cls = 'bg-red-500/15 ring-1 ring-red-500/40 text-red-200';
                  else if (isChosen) cls = 'bg-yellow-500/15 ring-1 ring-yellow-500/40 text-yellow-100';
                  return (
                    <button
                      key={i}
                      onClick={() => { if (result === 'idle') setChoice(i); }}
                      disabled={result !== 'idle'}
                      className={`w-full text-left px-4 py-3 rounded-xl font-mono text-[13px] leading-relaxed transition-all flex items-start gap-3 ${cls}`}
                    >
                      <span className="shrink-0 mt-0.5">
                        {showState && isRight ? <Check size={16} className="text-emerald-400" />
                          : showState && isChosen && !isRight ? <X size={16} className="text-red-400" />
                          : <span className="inline-block w-4 text-center text-slate-500">{String.fromCharCode(65 + i)}</span>}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder={exercise.starter || 'Scrivi qui la misura DAX...'}
                  spellCheck={false}
                  className="w-full h-28 bg-[#0a0a0a] rounded-xl p-4 font-mono text-sm text-yellow-100 ring-1 ring-white/10 focus:ring-yellow-500/40 focus:outline-none resize-none"
                />
              </div>
            )}

            {/* Action row: one primary (Verifica) + neutral utilities */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={check}
                className="h-10 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg bg-yellow-500 text-black hover:bg-yellow-400 shadow-yellow-500/20"
              >
                <Play size={14} fill="currentColor" /> Verifica
              </button>
              <button
                onClick={() => setShowHint((v) => !v)}
                className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${showHint ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/20' : 'bg-[#121212]/70 text-slate-300 hover:bg-white/5'}`}
              >
                <Lightbulb size={14} className={showHint ? 'fill-amber-300' : ''} /> Suggerimento
              </button>
              <button
                onClick={() => setShowSolution((v) => !v)}
                className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${showSolution ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/20' : 'bg-[#121212]/70 text-slate-300 hover:bg-white/5'}`}
              >
                {showSolution ? <Unlock size={14} /> : <Lock size={14} />} Soluzione
              </button>

              {result === 'correct' && (
                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 ml-1">
                  <Check size={16} /> Corretto
                </span>
              )}
              {result === 'wrong' && (
                <span className="flex items-center gap-1.5 text-sm font-bold text-red-400 ml-1">
                  <X size={16} /> Riprova
                </span>
              )}
            </div>

            {/* AI error explainer (shown after a wrong answer) */}
            {result === 'wrong' && (
              <AiExplainButton
                accent="from-yellow-500/25 to-yellow-600/5 text-yellow-100 border-yellow-400/30"
                getInput={() => ({
                  lab: 'DAX (Power BI)',
                  title: exercise.title,
                  description: exercise.scenario,
                  expected: exercise.reference,
                  userAnswer: exercise.kind === 'mcq'
                    ? (choice !== null ? exercise.options[choice] : '(nessuna opzione)')
                    : formula,
                })}
              />
            )}

            {/* Hint */}
            {showHint && (
              <div className="bg-amber-950/30 ring-1 ring-amber-500/20 p-4 rounded-xl text-sm text-amber-200 animate-in fade-in slide-in-from-top-2">
                <strong className="text-amber-400 block text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Lightbulb size={14} /> Suggerimento
                </strong>
                <ul className="list-disc list-inside space-y-1 marker:text-amber-500/50">
                  {exercise.hints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}

            {/* Solution */}
            {showSolution && (
              <div className="bg-purple-950/30 ring-1 ring-purple-500/20 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                <strong className="text-purple-400 block text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Unlock size={14} /> Soluzione
                </strong>
                <code className="font-mono text-purple-200 block bg-black/40 p-3 rounded-lg ring-1 ring-purple-500/20 select-all whitespace-pre-wrap">
                  {exercise.reference}
                </code>
                <p className="text-slate-300 mt-3 leading-relaxed">{exercise.explanation}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DaxGym;

import React, { useState, useMemo, useEffect } from 'react';
import { Page, Difficulty } from '../types';
import {
  Menu, Lightbulb, Unlock, Lock, Check, X, BarChart3, Play, Database, Shuffle,
} from 'lucide-react';
import UserBadge from './UserBadge';
import { ExerciseNav, HomeButton, IconButton, AnalyticsButton } from './GymControls';
import {
  DAX_TOPICS, DAX_EXERCISES, DAX_SCHEMA, DAX_TOPIC_TOTALS, getDaxExercises, tablesForExercise,
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
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-yellow-500/[0.045] rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-72' : 'hidden'} md:relative md:flex md:w-[270px] flex-col shrink-0 bg-[#0c0c0c] md:bg-transparent border-r border-white/5 h-full md:pt-7`}
      >
        {/* h-16 title row, same as the SQL/Python sidebars, so it lines up with
            the toolbar's first row across all three labs. */}
        <div className="h-16 flex items-center px-5 gap-2 shrink-0">
          <BarChart3 size={22} className="text-yellow-400" />
          <span className="font-bold tracking-[-0.03em] text-lg text-white">DAX <span className="text-yellow-400">LAB</span></span>
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
        <header className="flex flex-col gap-2 mt-2 md:mt-7 mb-3 shrink-0">
          {/* ROW 1: Home + difficulty, h-16 to line up with "DAX LAB" */}
          <div className="flex items-center gap-2 md:h-16">
          <div className="flex items-center gap-2">
            <HomeButton onClick={onBack} />
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              title="Argomenti"
              className="md:hidden h-10 w-10 shrink-0 grid place-items-center text-slate-300 hover:text-white bg-white/[0.04] ring-1 ring-white/10 rounded-xl hover:bg-white/[0.08] transition-all active:scale-95"
              aria-label="Argomenti"
            >
              <Menu size={18} />
            </button>

            {/* Difficulty selector */}
            <div className="flex h-10 bg-[#101219]/85 backdrop-blur-xl rounded-xl p-1 shadow-lg shadow-black/20">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); setIndex(0); }}
                  title={`Difficoltà ${d}`}
                  className={`h-8 px-3 md:px-4 text-xs font-bold rounded-lg transition-colors min-w-[64px] ${difficulty === d ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          </div>

          {/* ROW 2: contatore + azioni sull'esercizio a sinistra, strumenti a destra.
              Verifica/Suggerimento/Soluzione stanno qui, sotto il numero di
              esercizio, come in SQL Lab: prima erano in fondo alla pagina e su
              un esercizio lungo finivano sotto la piega. */}
          <div className="flex items-center gap-2">
            <ExerciseNav
              index={index}
              total={exercises.length}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
              accentText="text-yellow-300"
            />

            {exercise && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={check}
                  title="Verifica: controlla la tua risposta"
                  aria-label="Verifica la risposta"
                  className="h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
                >
                  <Play size={14} fill="currentColor" /> Verifica
                </button>
                {/* Solo icona: sono comandi secondari, l'etichetta vive nel tooltip. */}
                <button
                  onClick={() => setShowHint((v) => !v)}
                  title="Suggerimento: un indizio per volta, senza svelare la soluzione"
                  aria-label="Mostra un suggerimento"
                  aria-pressed={showHint}
                  className={`h-10 w-10 grid place-items-center rounded-xl ring-1 transition-all active:scale-95 ${
                    showHint
                      ? 'bg-amber-500/20 text-amber-300 ring-amber-500/30'
                      : 'bg-white/[0.04] text-slate-300 ring-white/10 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <Lightbulb size={16} className={showHint ? 'fill-amber-300' : ''} />
                </button>
                <button
                  onClick={() => setShowSolution((v) => !v)}
                  title="Soluzione: mostra la misura corretta e la spiegazione"
                  aria-label="Mostra la soluzione"
                  aria-pressed={showSolution}
                  className={`h-10 w-10 grid place-items-center rounded-xl ring-1 transition-all active:scale-95 ${
                    showSolution
                      ? 'bg-purple-500/20 text-purple-300 ring-purple-500/30'
                      : 'bg-white/[0.04] text-slate-300 ring-white/10 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {showSolution ? <Unlock size={16} /> : <Lock size={16} />}
                </button>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              {/* Mescola solo icona, come suggerimento e soluzione. Non riuso
                  ShuffleButton perche' e' condiviso con SQL e Python, che
                  tengono l'etichetta. */}
              <IconButton
                onClick={() => { setShuffleNonce((n) => n + 1); setIndex(0); }}
                label="Mescola: pesca altri esercizi dal pool e cambia l'ordine"
              >
                <Shuffle size={16} />
              </IconButton>
              {onNavigate && <AnalyticsButton onClick={() => onNavigate(Page.Analytics)} />}
              <UserBadge onNavigate={onNavigate} />
            </div>
          </div>
        </header>

        {!exercise ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Nessun esercizio per questa combinazione. Cambia argomento o difficoltà.
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto pb-6 gap-3">
            {/* Status chips (navigation lives in the header toolbar) */}
            <div className="flex items-center gap-2 shrink-0">
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
            <div className="bg-[#101219]/85 backdrop-blur-xl rounded-2xl px-6 py-5 shrink-0">
              <h2 className="font-outfit text-xl md:text-2xl text-white font-bold tracking-tight mb-2 leading-tight">{exercise.title}</h2>
              <p className="text-slate-200 text-sm leading-relaxed">{exercise.scenario}</p>

              {/* Solo le tabelle che questo esercizio usa, con tutte le loro
                  colonne. Sostituisce la vecchia nota di modello sempre a
                  schermo: era lunga, identica per ogni esercizio e per giunta
                  incompleta, quindi chi doveva scrivere una misura non poteva
                  sapere come si chiamavano le colonne. Mostrare l'intera
                  tabella, e non solo la colonna giusta, non svela la risposta.
                  E' anche lo stile delle domande PL-300, che dichiarano il
                  modello dentro allo scenario. */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  <Database size={12} className="text-yellow-400/70" /> Modello
                </span>
                {tablesForExercise(exercise).map((t) => (
                  <span key={t} className="font-mono text-[11px] text-slate-400">
                    <span className="text-yellow-300/90">{t}</span>
                    ({DAX_SCHEMA[t].join(', ')})
                  </span>
                ))}
              </div>
            </div>

            {/* MCQ options or formula input */}
            {exercise.kind === 'mcq' ? (
              <div className="space-y-2">
                {exercise.options.map((opt, i) => {
                  const isChosen = choice === i;
                  const isRight = i === exercise.correctIndex;
                  const showState = result !== 'idle';
                  let cls = 'bg-[#101219]/85 hover:bg-white/5 ring-1 ring-white/5 text-slate-200';
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

            {/* Esito della verifica. I comandi (Verifica/Suggerimento/Soluzione)
                sono nella toolbar in alto, sotto il contatore. */}
            {/* `result` vale 'idle' | 'correct' | 'wrong': confrontare esplicitamente,
                perche' 'idle' e' una stringa truthy e un semplice `result &&`
                mostrava "Riprova" da subito, prima di premere Verifica. */}
            {result !== 'idle' && (
              <div className="flex items-center gap-2 shrink-0">
                {result === 'correct' ? (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                    <Check size={16} /> Corretto
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-red-400">
                    <X size={16} /> Riprova
                  </span>
                )}
              </div>
            )}

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

import React from 'react';
import { ChevronLeft, ChevronRight, Home as HomeIcon, Shuffle, TrendingUp } from 'lucide-react';

// Shared toolbar controls for the three gyms (SQL / Python / DAX).
//
// These existed as copy-pasted JSX in each gym and had drifted apart: the SQL
// exercise counter was 52px tall while every other control was 40px, which made
// the whole header taller and pushed row 1 out of line with the sidebar title.
// One component per control means the geometry can only be fixed (or broken)
// once. Every control here is exactly h-10 (40px) — same as the design system.
//
// Tooltips: native `title`. No JS, no portal, works on every platform, and
// screen readers already get the label. ponytail: swap for a styled tooltip
// only if the native delay actually bothers someone.

/** Height every toolbar control must be. Do not override per call site. */
export const CTRL = 'h-10';

interface IconButtonProps {
  onClick: () => void;
  label: string;             // used for BOTH tooltip and aria-label
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/** Square 40x40 icon button — the app's default chrome control. */
export const IconButton: React.FC<IconButtonProps> = ({ onClick, label, children, className = '', disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className={`h-10 w-10 shrink-0 grid place-items-center text-slate-300 hover:text-white bg-white/[0.04] ring-1 ring-white/10 rounded-xl hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 ${className}`}
  >
    {children}
  </button>
);

interface ToolButtonProps {
  onClick: () => void;
  label: string;             // tooltip + aria-label
  text: string;              // visible label, hidden below sm
  icon: React.ReactNode;
  accent?: 'neutral' | 'purple';
}

/** 40px pill with icon + label, e.g. Shuffle / Analytics. */
export const ToolButton: React.FC<ToolButtonProps> = ({ onClick, label, text, icon, accent = 'neutral' }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`h-10 shrink-0 flex items-center gap-2 px-3 rounded-xl transition-all active:scale-95 group ${
      accent === 'purple'
        ? 'text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 ring-1 ring-purple-500/25 hover:ring-purple-500/40'
        : 'text-slate-300 hover:text-white bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.08]'
    }`}
  >
    {icon}
    <span className="text-xs font-bold hidden sm:inline">{text}</span>
  </button>
);

interface ExerciseNavProps {
  index: number;             // 0-based
  total: number;
  onPrev: () => void;
  onNext: () => void;
  accentText?: string;       // per-lab accent for the current number
}

/**
 * Prev / counter / next. Exactly 40px tall: p-1 shell + h-8 buttons.
 * The old SQL version used p-1.5 + min-h-[40px] buttons = 52px, which is what
 * threw the header out of alignment with the sidebar.
 */
export const ExerciseNav: React.FC<ExerciseNavProps> = ({ index, total, onPrev, onNext, accentText = 'text-blue-400' }) => (
  <div className="h-10 shrink-0 flex items-center bg-white/[0.04] ring-1 ring-white/10 rounded-xl p-1">
    <button
      onClick={onPrev}
      disabled={index === 0}
      title="Esercizio precedente"
      aria-label="Esercizio precedente"
      className="h-8 w-8 grid place-items-center text-slate-300 hover:text-white disabled:opacity-25 disabled:pointer-events-none rounded-lg hover:bg-white/10 transition-colors"
    >
      <ChevronLeft size={16} />
    </button>
    <div className="px-2 min-w-[3.5rem] text-center font-mono text-xs font-bold text-slate-300 tabular-nums select-none">
      <span className={accentText}>{total === 0 ? 0 : index + 1}</span>
      <span className="text-slate-600 mx-0.5">/</span>
      {total}
    </div>
    <button
      onClick={onNext}
      disabled={index >= total - 1}
      title="Esercizio successivo"
      aria-label="Esercizio successivo"
      className="h-8 w-8 grid place-items-center text-slate-300 hover:text-white disabled:opacity-25 disabled:pointer-events-none rounded-lg hover:bg-white/10 transition-colors"
    >
      <ChevronRight size={16} />
    </button>
  </div>
);

/** Home button — same control in all three gyms. */
export const HomeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <IconButton onClick={onClick} label="Torna alla home">
    <HomeIcon size={18} />
  </IconButton>
);

/** Shuffle — draws a fresh subset from the pool and reshuffles the order. */
export const ShuffleButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <ToolButton
    onClick={onClick}
    label="Mescola: pesca altri esercizi dal pool e cambia l'ordine"
    text="Mescola"
    icon={<Shuffle size={16} className="group-active:rotate-180 transition-transform duration-500" />}
  />
);

/** Analytics — jumps to the progress dashboard. */
export const AnalyticsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <ToolButton
    onClick={onClick}
    label="Analytics: i tuoi progressi"
    text="Analytics"
    icon={<TrendingUp size={16} />}
    accent="purple"
  />
);

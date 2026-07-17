import React, { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { explainMistake, ExplainInput } from '../services/aiExplain';

interface AiExplainButtonProps {
  // Called lazily on click, so the latest answer/error is captured.
  getInput: () => ExplainInput;
  // Tailwind accent classes per lab (blue / amber / yellow), so the button
  // matches each gym's identity.
  accent?: string;
}

// "Spiega errore": on a wrong answer, asks a free AI where/why the mistake is
// and how to fix it, briefly. Degrades gracefully when the key isn't set or the
// endpoint is unavailable (e.g. local `vite` dev).
const AiExplainButton: React.FC<AiExplainButtonProps> = ({
  getInput,
  accent = 'from-violet-500/30 to-violet-600/5 text-violet-200 border-violet-400/30',
}) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const run = async () => {
    setLoading(true);
    setText(null);
    setNote(null);
    setOpen(true);
    const res = await explainMistake(getInput());
    setLoading(false);
    if (res.explanation) {
      setText(res.explanation);
    } else if (res.notConfigured) {
      setNote('Aiuto AI non ancora attivo: aggiungi la variabile OPENROUTER_API_KEY nelle impostazioni Vercel del progetto per abilitarlo.');
    } else {
      setNote('Aiuto AI non disponibile ora' + (res.error ? ` (${res.error})` : '') + '. Riprova tra poco o controlla la connessione.');
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={run}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md bg-gradient-to-b border backdrop-blur-xl disabled:opacity-60 ${accent}`}
        title="Fatti spiegare l'errore da un'AI"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        Spiega errore
      </button>

      {open && (loading || text || note) && (
        <div className="mt-3 bg-violet-950/30 ring-1 ring-violet-500/20 rounded-xl p-4 text-sm animate-in fade-in slide-in-from-top-2 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 p-1 text-violet-300/70 hover:text-white rounded"
            aria-label="Chiudi"
          >
            <X size={14} />
          </button>
          <strong className="text-violet-300 block text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sparkles size={14} /> Tutor AI
          </strong>
          {loading && (
            <p className="text-violet-200/80 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Sto analizzando la tua risposta...
            </p>
          )}
          {text && <p className="text-slate-200 leading-relaxed whitespace-pre-wrap pr-4">{text}</p>}
          {note && <p className="text-amber-200/90 leading-relaxed pr-4">{note}</p>}
        </div>
      )}
    </div>
  );
};

export default AiExplainButton;

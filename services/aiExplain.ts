// Client helper for the "Spiega errore" AI feature. POSTs the exercise context
// and the student's wrong answer to the /api/explain serverless function, which
// holds the OpenRouter key server-side. Locally (plain `vite`) the /api route
// does not exist, so this returns { error } and the UI degrades gracefully; it
// works on the Vercel deployment once OPENROUTER_API_KEY is set.

export interface ExplainInput {
  lab: string;          // 'SQL' | 'Python' | 'DAX'
  title: string;
  description: string;
  expected: string;     // reference solution
  userAnswer: string;   // what the student wrote / chose
  error?: string;       // engine error message, if any
}

export interface ExplainResult {
  explanation: string | null;
  notConfigured?: boolean;
  error?: string;
}

export async function explainMistake(input: ExplainInput): Promise<ExplainResult> {
  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lab: input.lab,
        title: (input.title || '').slice(0, 200),
        description: (input.description || '').slice(0, 800),
        expected: (input.expected || '').slice(0, 800),
        userAnswer: (input.userAnswer || '').slice(0, 1200),
        error: (input.error || '').slice(0, 600),
      }),
    });
    if (!res.ok) return { explanation: null, error: `HTTP ${res.status}` };
    return (await res.json()) as ExplainResult;
  } catch (e: any) {
    return { explanation: null, error: e?.message || 'network' };
  }
}

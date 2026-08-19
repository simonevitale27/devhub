// Vercel serverless function: explains an exercise mistake using a free LLM.
//
// Requires the env var OPENROUTER_API_KEY (set it in the Vercel project settings;
// it stays SERVER-SIDE and is never shipped to the browser). Optionally set
// OPENROUTER_MODEL to override the default free model.
//
// The client (services/aiExplain.ts) POSTs the exercise context + the student's
// wrong answer; this proxy adds the secret key and returns a short explanation.
//
// ponytail: no auth on the endpoint and a hard max_tokens cap keep it simple.
// The cap bounds cost if the URL is hit directly; add a shared check later if
// abuse ever shows up.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ explanation: null, error: 'Method not allowed' });
    return;
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    // Not an error: the app shows a friendly "configure the key" hint.
    res.status(200).json({ explanation: null, notConfigured: true });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { lab, title, description, expected, userAnswer, error } = body;
    // Gli id dei modelli :free su OpenRouter ruotano: quello impostato qui prima
    // (llama-3.3-70b) e' stato ritirato e l'endpoint rispondeva 404. Per vedere
    // quali esistono ORA senza bisogno di chiave:
    //   curl -s https://openrouter.ai/api/v1/models | grep -o '"[^"]*:free"'
    // Se un giorno sparisce anche questo, la variabile OPENROUTER_MODEL lo
    // sostituisce senza toccare il codice.
    const model = process.env.OPENROUTER_MODEL || 'z-ai/glm-5.2:free';

    const prompt =
      `Sei un tutor paziente di ${lab || 'programmazione'}. Uno studente ha sbagliato un esercizio.\n\n` +
      `Titolo: ${title || ''}\n` +
      `Consegna: ${description || ''}\n` +
      `Soluzione corretta di riferimento:\n${expected || ''}\n\n` +
      `Risposta dello studente (SBAGLIATA):\n${userAnswer || '(vuota)'}\n` +
      (error ? `Messaggio di errore ottenuto:\n${error}\n` : '') +
      `\nSpiega in ITALIANO, in massimo 4 frasi brevi e concrete: (1) dove ha sbagliato, ` +
      `(2) perché, (3) come correggere. Niente em dash. Non riscrivere l'intera soluzione se non è indispensabile.`;

    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 320,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      res.status(200).json({ explanation: null, error: `AI ${r.status}: ${t.slice(0, 140)}` });
      return;
    }

    const data = await r.json();
    const explanation = data?.choices?.[0]?.message?.content?.trim() || null;
    res.status(200).json({ explanation });
  } catch (e: any) {
    res.status(200).json({ explanation: null, error: e?.message || 'errore interno' });
  }
}

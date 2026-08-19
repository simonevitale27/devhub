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
    // I modelli :free hanno capacita' condivisa e rispondono 429 quando sono
    // saturi: con un solo modello la spiegazione fallisce a caso. OpenRouter
    // accetta una lista di ripiego e passa al primo che risponde.
    // Massimo 3: oltre, OpenRouter rifiuta la richiesta con 400.
    const ripieghi = [model, 'google/gemma-4-31b-it:free', 'openai/gpt-oss-20b:free']
      .filter((m, i, a) => a.indexOf(m) === i)
      .slice(0, 3);

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
        models: ripieghi,
        max_tokens: 320,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      // 429 dopo aver provato tutta la catena vuol dire che i modelli gratuiti
      // sono saturi adesso, non che qualcosa e' configurato male: dirlo cosi'.
      const messaggio =
        r.status === 429
          ? 'I modelli gratuiti sono momentaneamente saturi. Riprova fra qualche minuto.'
          : `AI ${r.status}: ${t.slice(0, 140)}`;
      res.status(200).json({ explanation: null, error: messaggio });
      return;
    }

    const data = await r.json();
    const explanation = data?.choices?.[0]?.message?.content?.trim() || null;
    res.status(200).json({ explanation });
  } catch (e: any) {
    res.status(200).json({ explanation: null, error: e?.message || 'errore interno' });
  }
}

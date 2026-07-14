# HANDOFF — DevHub

> Aggiornato: 2026-07-14 · Sessione: audit + Fase 0 stabilizzazione (deployata) + Fase 1 G001 Tailwind/G002 code-split/G003 a11y+palette (tutte deployate) + G004 redesign avviato (pass 1 SQL Lab, deployato). Prossimo: continuare G004 redesign SQL Lab in sessione focalizzata.
> Regola: leggere questo file PRIMA di toccare codice. A fine sessione, aggiornarlo con la skill `handoff`.

## Cos'è

Piattaforma di apprendimento SQL/Python/Data Analysis, tutta client-side (React 19 + Vite 6 + TypeScript, AlaSQL in-browser, Pyodide WASM in Web Worker). Backend PocketBase self-hosted su Coolify (solo auth + sync progressi; guest mode completo senza backend). Deploy Vercel (devhub-gray.vercel.app). Docs interne: `ARCHITECTURE.md`, `DB_SCHEMA.md`, `DESIGN_SYSTEM.md`.

## Backend PocketBase (attivo)

- URL API: `https://pocketbase-j6784mksa2l2i5a6eg5oolgd.49.12.96.95.sslip.io` (env `VITE_POCKETBASE_URL`, già su Vercel prod/preview/dev + `.env.local`).
- Admin panel: `<URL>/_/` — credenziali in `~/.config/pocketbase/devhub.env` (chmod 600).
- Collections: `users` (auth, regole default sicure `id = @request.auth.id`, campi extra `avatar_url`/`provider`), `user_progress` (regole `user = @request.auth.id`, indice UNIQUE su user+lab+topic_id+difficulty+exercise_index).
- **Da fare a mano dall'utente** (non inseribili da Claude): Google OAuth (client id/secret in admin → users → OAuth2) e SMTP (già configurato dall'utente in questa sessione, verificare che il reset password arrivi end-to-end).

## Stato lavori (roadmap epic in 6 workstream, deciso ordine dipendenze)

### ✅ FATTO e DEPLOYATO in produzione

**Fase 0 — Stabilizzazione critica** (commit `cd4caff`, live). Ogni fix verificato nel renderer reale:
1. Freeze Python risolto → Pyodide in Web Worker terminabile (`public/pyodide.worker.js` + `services/pythonService.ts` riscritto come proxy). `while True: pass` → timeout + worker ucciso/ricreato, no freeze. Verificato anche in prod.
2. Sync progressi → `saveProgressPocketBase` idempotente (400 unique = successo, non trippa il circuit breaker) + guard single-flight in `syncLocalToBackend`; streak backend allineato al locale. `services/progressService.ts`.
3. Validazione SQL → `utils/sqlHelpers.ts::compareResults` ora multiset (cardinalità: DISTINCT) + order-sensitive quando la soluzione ha ORDER BY (param `orderMatters`, passato da SqlGym); precisione numerica a 4 decimali.
4. Esercizi SQL impossibili → riscritti gli unici 3 blueprint non eseguibili su AlaSQL (RANK/DENSE_RANK via subquery correlata, CTE "Sopra la Media" in forma JOIN) in `services/exerciseGenerator.ts`. **Gate QA: 775/775 soluzioni eseguibili** (verificato in browser eseguendo ogni queryTemplate). NB: l'audit sovrastimava — molte funzioni date "rotte" erano già registrate come `alasql.fn` in `services/sqlService.ts`.
5. Seaborn → caricato via micropip nel worker (non è in Pyodide 0.24.1). `PythonGym` LIBRARY_PACKAGES + worker `loadPackages` PIP_ONLY.
6. Percentuali progressi → totali reali per topic (`SQL_TOPIC_TOTALS`/`PYTHON_TOPIC_TOTALS` esportati dai generatori, passati a `getTopicProgress`) invece del 60 fisso. Clamp a 100%.
7. Service worker (`public/sw.js`) → non cache più le richieste cross-origin (API PocketBase, CDN).

**Fase 1 G001 — Tailwind build-time** (commit `f176b5a`, live): rimosso `cdn.tailwindcss.com`; `tailwind.config.js` + `postcss.config.js` + `index.css` (importato in `index.tsx`); config e `<style>` migrati da `index.html`. CSS compilato/purgato ~81KB. Verificato: 4 pagine identiche.

**Fase 1 G002 — Code-splitting gym SQL** (commit `8d7e386`, live): in `SqlGym.tsx` xlsx e pdfExport ora dynamic import negli handler; QuickChart e SchemaERDiagram ora `React.lazy`+Suspense; rimossi import morti jsPDF/autoTable. **Chunk SqlGym 232KB → 59KB (-75%)**; vendor-charts (1.27MB) ora on-demand. Verificato: QuickChart lazy renderizza.

**Fase 1 G003 — a11y baseline + palette** (commit `cb2b5ee`, live): focus-visible ring globale in `index.css`; `@media prefers-reduced-motion`; **palette unificata a `slate`** (deciso con l'utente; `zinc-*`→`slate-*` in 7 file); Escape chiude il modale QuickChart. Verificato. RIMANDATO a G004: estrazione token condivisi in `tailwind.config`, touch-target 44px sui bottoni icona, focus-trap su tutti i modali.

### ⏭️ IN CORSO — Fase 1 G004 redesign (direzione decisa: RAFFINARE l'identità attuale — dark+glass+accento blu; NON rivoluzionare. Sezione di partenza: SQL Lab)

**Pass 1 fatto** (commit `32d33ec`, live): SqlGym stato di caricamento con spinner coerente; stato vuoto risultati reso leggibile + hint. **Da continuare** (sessione focalizzata, iterare con l'utente che rivede): raffinare gerarchia/spaziature/stati/micro-interazioni di SqlGym (badge micro a basso contrasto, card Home con top assoluti hardcoded, touch-target frecce esercizio ~30px→44px), poi propagare a PythonGym/Home/Landing/Analytics. La skill `ui-ux-pro-max` è orientata React-Native ma i principi (a11y, spacing 4/8, gerarchia, stati, motion 150-300ms) valgono. Regola: NIENTE full-rewrite dei componenti da 1500+ righe; interventi mirati e verificati a vista.

### ⏭️ Fasi successive (non ancora pianificate in dettaglio)

- **Riscrittura contenuti esercizi SQL** (`/humanizer`): ~42% delle `explanation` sono boilerplate riciclato e spesso incollato sull'esercizio sbagliato; mismatch descrizione↔soluzione in vari Hard; hint non graduati; Case Easy/Medium hanno solo 10 blueprint (vs 30). Strategia consigliata: spacchettare il monolite `exerciseGenerator.ts` (7975 righe) in `services/exercises/sql/<topic>.ts` + barrel, poi riscrivere topic-per-topic con gate QA di eseguibilità già rodato in questa sessione.
- **Sezione Python data-analysis** (pandas/matplotlib/seaborn): il topic Seaborn ora carica ma NON esistono esercizi che producono un grafico; il runner del Gym cattura solo stdout. Costruire sopra l'infra DataLab (runPythonForDataLab cattura già DataFrame JSON + PNG matplotlib). Vedi featureNotes dell'audit (dimensione python-section).
- **Sezione DAX** (cert Power BI PL-300): nessun engine DAX in browser → validazione a quiz (MCQ) + confronto formula normalizzata. Prerequisiti abilitanti: `LabId` centrale (`'sql'|'python'|'dax'`, oggi hardcoded in ~7 punti), route-registry (App.tsx è uno switch manuale; enum `Page.AngularGym` morto da rimuovere), campo select `lab` su user_progress esteso a 'dax'.
- **Sezione Admin**: nessun modello ruoli oggi. Servono su PocketBase users i campi `role` (select user/admin) e `blocked` (bool); authRule users `blocked = false` per il ban; collection `audit_log`; pagina `Page.Admin` con guard di ruolo. Ogni check lato client DEVE avere il gemello nelle API rules PocketBase.

## Debiti tecnici / note

- `vendor-charts` 1.27MB resta grosso ma ora è lazy; DataLab importa ancora xlsx/QuickChart staticamente (chunk lazy separato).
- Pyodide 0.24.1 pinnato; al timeout-kill del worker lo stato VFS/DataFrame di DataLab si perde (accettabile dopo runaway).
- Audit completo di questa sessione: report multi-agente con scoring (Stabilità ~55 pre-fix, Perf 48, UX/UI 62, Manutenibilità 45). Molti finding erano sovrastimati (testati in isolamento); i confermati sono stati fixati in Fase 0.

## Come avviare

```bash
cd /Volumes/SSD/APPS/devhub
npm install
npm run dev   # launch config globale "devhub-dev" su porta 3100
```

Guest mode: nessuna env. Login: `VITE_POCKETBASE_URL` (già in `.env.local`).

## Stato pianificazione fablize

`.fablize/` contiene il piano Fase 1 (G001✅ G002✅ G003⏭️ G004⏭️). Per riprendere: `goals.py status` dalla root.

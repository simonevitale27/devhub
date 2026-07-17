# HANDOFF — DevHub

> Aggiornato: 2026-07-16 · Sessione: Fase 0 + Fase 1 G001/G002/G003 (deployate) + G004 redesign + **nuova sezione DAX Lab**. Aggiunto **badge versione app** (v1.x, single source in `version.ts`, stamp fisso in alto a dx su OGNI schermata) — "old vs new build" tracker: **bumpare `APP_VERSION` a ogni passata visibile**. Build corrente: **v1.9**. Passate: v1.6 SQL toolbar (Formatta→neutro), v1.7 Python toolbar (Esegui→primario amber), v1.8 propagazione (Analytics back button glass; Home/DataLab/AccountPage erano già coerenti), **v1.9 DAX Lab** (nuovo lab PL-300). Prossimo: (1) humanizer sugli esercizi Python (474 blueprint già esistenti, testi spesso templatici) + riempire topic sottili; (2) più esercizi DAX (ora 23 starter); (3) pass /impeccable geometrie SQL/Python/DAX.
> Regola: leggere questo file PRIMA di toccare codice. A fine sessione, aggiornarlo con la skill `handoff`.
>
> **v2.0 — QA gate + bug reali (fatto)**. Due gate riproducibili, entrambi verdi: Python 527 soluzioni eseguite con `python3` (519 ok / 0 mismatch / 0 error / 8 expectedOutput vuoto by design) e SQL 775 soluzioni eseguite su AlaSQL vero (0 failure / 0 debug-finti / 0 soluzioni a 0 righe). Bug trovati **eseguendo**, non leggendo:
> - `explanation` era scritta per TUTTI (527 Python + 775 SQL) ma **non renderizzata in nessuno dei due lab**: contenuto morto. Ora mostrata con la soluzione. PythonGym mostrava solo `hints[0]` → ora tutti.
> - Python: `Len stringa` aveva expectedOutput 34 ma `len()` = 33 (la risposta GIUSTA era bocciata). 8 hint che rivelavano la soluzione letterale. 2 `brokenCode` con placeholder `'...'`.
> - SQL: `manager_id INT` faceva coercizione NULL→NaN → **ogni `WHERE manager_id IS NULL` era rotta**. Colonna ora untyped.
> - SQL, limiti motore AlaSQL scoperti: `MIN(hire_date)` restituisce undefined (riscritto con SUM condizionale); `IN(subquery) AND NOT IN(subquery)` restituisce [] (riscritto con `NOT EXISTS`). **Tenerne conto scrivendo nuovi esercizi.**
> - SQL: Orders/OrderItems sono generati **a random** → vari esercizi Hard non avevano risposta e, con result set vuoto, QUALSIASI query sbagliata veniva promossa. Ora ci sono righe-risposta deterministiche seedate in `sqlService.ts` (ordine full-house, dipendente isolato, reparto post-2021, compratore Laptop, Monitor-4K-senza-Keyboard, all-Accessories).
>
> **NON fatto (bloccato)**: `/humanizer`. Il workflow multi-agente è fallito per **limite token di sessione** (12/17 agent falliti, output persi con la wipe della scratchpad). Da riprendere a limiti resettati.
>
> **PRIORITÀ humanizer = SQL, non Python** (misurato in v2.1, ora che le explanation si VEDONO):
> - **SQL (775)**: **543 esercizi (70%) riciclano solo 52 testi** di explanation (una spiegazione di WHERE ripetuta 46 volte); **91 explanation citano una keyword che la loro query non usa** (es. "Filtro Combinato 1" spiega LIKE ma la query non ha LIKE) → sono proprio SBAGLIATE; **343 esercizi hanno <2 hint**; 123 explanation <60 char. Corretto solo `Nomi Utenti` (spiegava SELECT * su una query a colonna singola).
> - **Python (527)**: 0 duplicati, 0 esercizi con <2 hint. Le explanation sono uniche, solo **corte** (444 sotto i 60 char). Qualità molto migliore del SQL.
> Quindi: prima passata humanizer su SQL (dedup + mismatch keyword + hint mancanti), poi Python (espandere le corte). Coverage sottile da riempire: `conditions/Medium`=7, `collections`=3/3/3, seaborn/libraries.
> **Versioning UI**: la versione mostrata è in `version.ts` (`APP_VERSION`). Incrementarla ad ogni cambiamento visibile così l'utente distingue la build vecchia da quella nuova sul live (devhub-gray.vercel.app).

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

**Pass 1 fatto** (commit `32d33ec`, live): SqlGym spinner + stato vuoto leggibile. **Pass 2 (v1.6)**: SqlGym toolbar — `Formatta` era un secondo "primario" blu in conflitto con `Esegui`; ora è utility neutra, il blu marca UN solo primario. **Pass 3 (v1.7)**: PythonGym toolbar allineata a SqlGym — `Esegui` era icona-fantasma identica alle utility; ora è primario amber etichettato (identità Python = amber, SQL = blu; stessa *gerarchia*, colore diverso). Verificato: il codice gira e valida ("Corretto! 🎉"). **Da continuare** (iterare con l'utente che rivede): propagare gerarchia/glass/spacing a Home + Analytics (+ DataLab) per coerenza; poi rifinire densità/contrasto sidebar SQL Lab (chip keyword minuscole) e touch-target residui. La skill `ui-ux-pro-max` è orientata React-Native ma i principi (a11y, spacing 4/8, gerarchia, stati, motion 150-300ms) valgono. Regola: NIENTE full-rewrite dei componenti da 1500+ righe; interventi mirati e verificati a vista.

### ⏭️ Fasi successive (non ancora pianificate in dettaglio)

- **Riscrittura contenuti esercizi SQL** (`/humanizer`): ~42% delle `explanation` sono boilerplate riciclato e spesso incollato sull'esercizio sbagliato; mismatch descrizione↔soluzione in vari Hard; hint non graduati; Case Easy/Medium hanno solo 10 blueprint (vs 30). Strategia consigliata: spacchettare il monolite `exerciseGenerator.ts` (7975 righe) in `services/exercises/sql/<topic>.ts` + barrel, poi riscrivere topic-per-topic con gate QA di eseguibilità già rodato in questa sessione.
- **Sezione Python data-analysis** (pandas/matplotlib/seaborn): il topic Seaborn ora carica ma NON esistono esercizi che producono un grafico; il runner del Gym cattura solo stdout. Costruire sopra l'infra DataLab (runPythonForDataLab cattura già DataFrame JSON + PNG matplotlib). Vedi featureNotes dell'audit (dimensione python-section).
- **Sezione DAX** (cert Power BI PL-300): ✅ **CREATA e DEPLOYATA (v1.9)**. `daxTypes.ts` (tipi + `normalizeDax`/`checkDaxFormula`), `services/daxExercises.ts` (23 esercizi humanizzati su 7 topic, un unico schema a stella condiviso Vendite/Prodotti/Clienti/Calendario, `DAX_TOPIC_TOTALS` calcolati dai dati), `components/DaxGym.tsx` (lab: sidebar topic+chip, Easy/Medium/Hard, MCQ + textarea formula, 1 primario giallo "Verifica" + utility neutre, identità Power BI gialla). Validazione **ibrida** (scelta utente): MCQ maggioritari + alcuni "scrivi la misura" con `normalizeDax` tollerante (case/spazi/`[]`/apici/`;`). Routing: `Page.AngularGym`→`Page.DaxGym`, lazy in App.tsx, card Home (griglia ora 2×2). **Progressi solo in localStorage** (`dax_completed_v1`); NON ancora integrati con `progressService`/Analytics/PocketBase (l'union `lab` resta `'sql'|'python'`). **Da fare**: più esercizi (coverage PL-300), integrazione progressi cross-lab (estendere union a `'dax'` in ~6 punti progressService + campo select `lab` PocketBase, poi Analytics).
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

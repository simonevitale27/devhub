# HANDOFF — DevHub Web

> Documento di passaggio. Leggilo **prima** di toccare codice.
> Scritto per essere autosufficiente: una chat nuova non ha bisogno di altro.
> A fine sessione aggiornalo (skill `handoff`).

**Build corrente: v3.8** — live su https://devhub-gray.vercel.app
`main` → push = deploy automatico Vercel.

**Regola di versioning**: `version.ts` è l'unica fonte (`APP_VERSION`, stampata
in alto a destra su ogni schermata). **Bumpala a ogni cambiamento visibile**,
così si distingue una build vecchia da una nuova sul live.

---

## 0. Divisione del lavoro con DevHub Desktop

Esistono **due repo separate e indipendenti**:

| | dove | di cosa si occupa |
| --- | --- | --- |
| **DevHub Web** (questa) | `/Volumes/SSD/APPS/devhub` | i tre lab, i contenuti, la UI |
| **DevHub Desktop** | `/Volumes/SSD/APPS/devhub-desktop` | app Tauri con Python locale reale; ospiterà il **Coding Lab** (problem solving, progetti 500–5.000 righe) |

**Non condividono file**: una modifica qui non arriva là e viceversa, va copiata
a mano. **Unica eccezione assoluta**: `services/pythonService.ts` è il file che
distingue le due build (Pyodide qui, `python3` di sistema là) — **non copiarlo
mai fra i due**.

---

## 1. Cos'è

Piattaforma di studio SQL / Python / DAX, interamente client-side.
React 19 + Vite 6 + TypeScript · AlaSQL in-browser · Pyodide (WASM) in Web Worker.
Backend PocketBase self-hosted su Coolify, solo per auth e sync progressi: la
**guest mode funziona senza backend**. Deploy Vercel.

Docs interne: `ARCHITECTURE.md`, `DB_SCHEMA.md`, `DESIGN_SYSTEM.md`.

### Contenuti attuali

| Lab | Esercizi | Note |
| --- | --- | --- |
| SQL | 775 | eseguiti contro AlaSQL vero dal gate |
| Python | 660 su 15 argomenti | eseguiti con `python3` vero dal gate |
| DAX | 110 su 14 argomenti | allineati alle skill PL-300, gate strutturale |

Argomenti Python: Operatori, Input/Output, Condizioni, Cicli, Collezioni, Liste,
Tuple, Set, Dizionari, Pandas, Seaborn, Librerie, **Giochi**, **Forecasting**,
**Deep Learning**.

---

## 2. Come si avvia

```bash
cd /Volumes/SSD/APPS/devhub
npm install
npm run dev      # launch config "devhub-dev", porta 3100
```

`npm run dev` e `npm run build` **scaricano Pyodide** in `public/pyodide/` prima
di partire (vedi 4.1). La prima volta ci mette un paio di minuti; poi è istantaneo.

Guest mode: nessuna env necessaria. Login: `VITE_POCKETBASE_URL` (già in `.env.local`).

### I gate di qualità — usarli, non fidarsi della lettura

```bash
TSX=/Users/simonevitale/.npm/_npx/69f9afb961c37556/node_modules/.bin/tsx
$TSX scripts/validate_python.ts   # esegue TUTTE le 660 soluzioni con python3
$TSX scripts/validate_dax.ts      # coerenza strutturale dei 110 esercizi DAX
node scripts/validate_all_exercises.cjs   # 775 query SQL su AlaSQL vero
npx tsc --noEmit
```

**Questi gate hanno trovato bug che l'ispezione non avrebbe visto** (output attesi
sbagliati, esercizi insolubili, id duplicati). Eseguirli dopo ogni modifica ai
contenuti.

---

## 3. Stato: cosa è stato fatto di recente

- **v3.8** — i 110 scenari DAX riscritti in stile PL-300 (contesto del modello →
  esigenza di business → domanda esplicita).
- **v3.7** — DAX: validazione resa utilizzabile (vedi 4.2), modello per esercizio,
  toolbar in alto, Suggerimento/Soluzione/Mescola a sola icona.
- **v3.6** — elisione Python Lab (−32 righe) + bug di valutazione corretto.
- **v3.5** — Python Lab: `Esegui` non rispondeva più dopo un timeout (vedi 4.3).
  Aggiunta la scorciatoia ⌘/Ctrl+Enter, resa visibile sul pulsante.
- **Pyodide self-hosted** (vedi 4.1): non dipende più da CDN esterni.
- **v3.4** — tre argomenti Python nuovi: Giochi, Forecasting, Deep Learning.

---

## 4. Le decisioni che è importante conoscere

### 4.1 Pyodide è self-hosted, non più da CDN
**Perché**: dal PC dell'ufficio l'ambiente Python non partiva, da casa sì. Pyodide
veniva scaricato da `cdn.jsdelivr.net` (~10 MB, nessun fallback) e le reti
aziendali filtrano comunemente i CDN pubblici. Il service worker non poteva
rimediare perché **ignora esplicitamente il cross-origin**, quindi non ne aveva
mai messo in cache un byte.

Ora tutto è servito dal dominio dell'app: core, 14 wheel (numpy/pandas/matplotlib/
micropip + dipendenze) e **seaborn**, che prima veniva da PyPI — l'ultimo host
esterno rimasto.

- I ~78 MB **non sono nel repo**: `public/pyodide/` è gitignorato e
  `scripts/fetch-pyodide.mjs` lo ricrea prima di ogni build. Idempotente.
- Il download è **esplicito dentro i comandi `dev`/`build`**, non un hook
  `prebuild`: su questa macchina `npm config get ignore-scripts` è `true`, quindi
  gli hook non partirebbero mai qui mentre su Vercel sì → divergenza silenziosa
  fra locale e produzione. **Non riconvertirlo in hook.**

**⚠️ NON ANCORA VERIFICATO**: dopo il self-hosting, dal PC dell'ufficio l'errore
è cambiato in `Python non disponibile: Program terminated with exit(1)`. È un
errore del runtime Emscripten, non di rete: i file arrivano ma Python aborta
all'avvio. Ipotesi principale: **il proxy aziendale blocca i `.zip`** (vettore
malware tipico) e senza `python_stdlib.zip` Python non parte. Diagnostica da
eseguire in ufficio: confrontare i byte scaricati con
`python_stdlib.zip` = 8.882.369 byte, magic `50 4b 03 04`, e
`pyodide.asm.wasm` = 8.995.509 byte, magic `00 61 73 6d`.
Se confermato, la soluzione è intercettare la richiesta con il service worker e
servirla da un URL con estensione innocua.

### 4.2 La validazione DAX ignora il nome della misura
In DAX il nome è una scelta libera: `Massimo = MAX(...)` e `Vendita alta = MAX(...)`
sono la stessa misura. Confrontare la stringa intera bocciava risposte giuste —
**9 casi su 15 fallivano**. `normalizeDax` in `daxTypes.ts` ora toglie il nome
(solo se ciò che precede `=` è un identificatore semplice, per non rovinare
`CALCULATE(..., Col = "x")` dove `=` è un operatore), normalizza gli spazi attorno
a tutti gli operatori e dentro le quadre, e il punto e virgola finale.

Le risposte accettate includono equivalenti veri (`SUM`↔`SUMX`, `ALL`↔`REMOVEFILTERS`,
`[Fatturato]`↔`SUM(Vendite[Importo])`…), **con una guardia**: se la funzione
alternativa è citata nel testo dell'esercizio, quella distinzione è il punto
didattico e non viene allargata.

### 4.3 Mai uscire in silenzio da un handler
`handleRunCode` iniziava con `if (!isPyodideReady()) return`. Il worker viene
distrutto al timeout, quindi **un solo ciclo infinito rendeva `Esegui` morto per
sempre**: nessun output, nessun errore, niente in console, fino al reload.
`runPython` chiama già `initPyodide()` da sé: il guard bloccava prima di arrivarci.

### 4.4 Geometrie UI fisse (restauro v3.0)
Riusare questi valori invece di inventarne di nuovi:
- controlli `h-10` + `rounded-xl`
- pannelli `rounded-2xl` + `ring-1 ring-white/[0.07]` + `elev-1`
- gruppi di dati: griglia hairline (`gap-px`) invece di card annidate
- input `h-12`
- tipografia: Inter tight per il display (`.text-display`), Outfit per i titoli,
  JetBrains mono per il codice

I controlli condivisi dai tre lab stanno in `components/GymControls.tsx`
(`ExerciseNav`, `HomeButton`, `IconButton`, `ShuffleButton`, `AnalyticsButton`):
la geometria si corregge lì una volta sola.

### 4.5 Pool più grande di quanto mostrato
Ogni lab pesca un sottoinsieme casuale da un pool più ampio; Mescola / riapertura
ridisegna il set. La completion è indicizzata su `poolIndex` **stabile**
(posizione pre-shuffle), non sulla posizione mostrata: era un bug portante dei
progressi. Python mostra 12, DAX 8.

### 4.6 Limiti noti di AlaSQL (scrivendo esercizi SQL)
- `manager_id` è volutamente **senza tipo**: come `INT`, AlaSQL trasforma NULL in
  NaN e ogni `WHERE ... IS NULL` si rompe.
- `MIN(hire_date)` restituisce undefined → riscritto con SUM condizionale.
- `IN(subquery) AND NOT IN(subquery)` restituisce `[]` → usare `NOT EXISTS`.
- Orders/OrderItems sono generati a random: alcune righe-risposta sono **seedate
  deterministicamente** in `sqlService.ts`, altrimenti gli esercizi Hard non hanno
  risposta e — con result set vuoto — qualunque query sbagliata viene promossa.

---

## 5. Prossimi passi

### 5.1 Aperti e concreti
- **Verificare Pyodide dal PC dell'ufficio** (vedi 4.1). È l'unico problema
  funzionale noto che tocca un utente reale.
- **Attivare l'AI "Spiega errore"**: serve `OPENROUTER_API_KEY` su Vercel
  (Production + Preview) da openrouter.ai, poi redeploy. Opzionale
  `OPENROUTER_MODEL` (default `meta-llama/llama-3.3-70b-instruct:free`). Finché
  manca, il bottone mostra l'hint senza rompere nulla.
  **Passo manuale dell'utente: Claude non inserisce chiavi.**
- **Progressi DAX**: oggi solo `localStorage` (`dax_completed_v1`). Per portarli
  in Analytics/PocketBase va estesa l'union `lab` da `'sql'|'python'` a `'dax'`
  in ~6 punti di `progressService` + campo select su PocketBase.

### 5.2 Contenuti, se si vuole alzare l'asticella
- **SQL**: ~454 explanation sono corrette ma condivise fra molti esercizi
  (stilisticamente ripetitive). I casi *sbagliati* sono già stati corretti.
- Topic sottili: SQL `case` Easy/Medium.
- Python: nessun pool sottile rimasto (verificato dal gate).

### 5.3 Dubbio segnalato, mai risolto
`validateOutput` con `strictMode: false` (il default) collassa gli spazi
(`\s+` → `' '`), quindi un esercizio che attende `"1\n2\n3"` accetta anche
`"1 2 3"`. Non è chiaro se la tolleranza sui newline sia voluta. Se le righe
devono contare, è una modifica di due caratteri.

---

## 6. Backend PocketBase

- API: `https://pocketbase-j6784mksa2l2i5a6eg5oolgd.49.12.96.95.sslip.io`
  (env `VITE_POCKETBASE_URL`, già su Vercel prod/preview/dev e in `.env.local`).
- Admin: `<URL>/_/` — credenziali in `~/.config/pocketbase/devhub.env` (chmod 600).
  **Mai in chiaro nel repo.**
- Collections: `users` (auth, regole `id = @request.auth.id`, campi extra
  `avatar_url`/`provider`), `user_progress` (regole `user = @request.auth.id`,
  indice UNIQUE su user+lab+topic_id+difficulty+exercise_index).
- Google OAuth e SMTP: configurati dall'utente lato admin panel.

---

## 7. Dove sta cosa

```
components/GymControls.tsx        controlli condivisi dei tre lab
components/PythonGym.tsx          Python Lab
components/SqlGym.tsx             SQL Lab
components/DaxGym.tsx             DAX Lab
services/pythonService.ts         Pyodide via Web Worker  <- NON copiare nel desktop
public/pyodide.worker.js          worker: punta a /pyodide/ (same-origin)
scripts/fetch-pyodide.mjs         scarica Pyodide prima del build
services/exerciseGenerator.ts     775 esercizi SQL (monolite, rigenerato da JSON)
services/pythonExerciseGenerator.ts + pythonLibraryExercises.ts + pythonPlaygroundExercises.ts
services/daxExercises.ts          110 esercizi DAX + DAX_SCHEMA + tablesForExercise
daxTypes.ts                       normalizeDax / checkDaxFormula
version.ts                        APP_VERSION
```

---

## 8. Note di metodo che hanno pagato

- **Riprodurre prima di correggere.** Ogni bug serio di questa sessione (Esegui
  morto, validazione DAX, navigazione fuori range) è stato prima riprodotto, e in
  due casi la causa non era quella che sembrava.
- **Guardare lo schermo.** Due bug erano invisibili ai gate: numpy non caricato
  per i nuovi argomenti, e `{result && ...}` che mostrava "Riprova" da subito
  perché `'idle'` è una stringa truthy.
- **Niente full-rewrite** dei componenti da 1500+ righe: interventi mirati,
  verificati a vista.

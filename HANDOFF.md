# HANDOFF — DevHub Web

> Documento di passaggio. Leggilo **prima** di toccare codice.
> Scritto per essere autosufficiente: una chat nuova non ha bisogno di altro.
> A fine sessione aggiornalo (skill `handoff`).

**Build corrente: v3.12** — live su https://devhub-gray.vercel.app
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

- **v3.12** — la libreria standard di Python e' servita come `.bin`: il proxy
  dell'ufficio bloccava il `.zip` (vedi 4.1). **Da confermare sul posto.**
- **v3.11** — la spiegazione AI degli errori funziona davvero: chiave configurata
  su Vercel e catena di ripiego fra modelli (vedi 4.7).
- **v3.10** — bottone "Perché?" che diagnostica l'ambiente Python che non parte
  (vedi 4.1). Nuovo logo su favicon e icone PWA.
- **v3.9** — stesso logo dell'app desktop su tutta la parte web.
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

**Il problema dell'ufficio: diagnosticato il 20/08/2026.**

Storia in tre atti, perche' ogni atto ha smentito l'ipotesi del precedente:

1. L'ambiente non partiva perche' Pyodide veniva da `cdn.jsdelivr.net`, filtrato
   in azienda. Risolto con il self-hosting (sopra).
2. L'errore e' diventato `Program terminated with exit(1)`: l'unica cosa che
   Emscripten sa dire, e non distingue una rete che filtra da un browser senza
   WebAssembly. Da qui la diagnostica in-app della v3.10 (`services/pythonDiagnostics.ts`,
   bottone **"Perche'?"** accanto all'errore).
3. Verdetto letto dal PC dell'ufficio:

```
WebAssembly: compila correttamente
pyodide.js:       HTTP 206 ... ok
pyodide.asm.js:   HTTP 206 ... ok
pyodide.asm.wasm: HTTP 206, type=application/wasm, 8.995.509 byte ... ok
python_stdlib.zip: HTTP 403
```

**Il proxy blocca quel file e soltanto quello.** Il dettaglio che chiude la
diagnosi e' il `.wasm`: 8,9 MB di binario passano indisturbati, quindi non e' ne'
la dimensione ne' il contenuto binario. E' il **tipo archivio** — Vercel serviva
lo stdlib come `application/zip`.

**La correzione (v3.12).** Pyodide accetta l'opzione `stdLibURL`, quindi non
serve nessun trucco: `scripts/fetch-pyodide.mjs` copia gli stessi identici byte
come `python_stdlib.bin`, che Vercel serve come `application/octet-stream` — lo
stesso tipo con cui gia' serve i wheel. Il `.zip` non viene piu' pubblicato
affatto (404 in produzione), quindi non c'e' piu' niente da bloccare.

Verificato: in locale cancellando il `.zip` l'ambiente parte lo stesso ed esegue
il codice; in produzione `/pyodide/python_stdlib.bin` risponde 200
`application/octet-stream`, 8.882.369 byte.

⚠️ **Cosa resta da confermare sul posto.** Se il proxy filtra per estensione o
per content-type, il problema e' chiuso. Se invece **ispeziona il contenuto** e
riconosce l'header ZIP (`50 4b 03 04`), rinominare non basta: in quel caso
saltera' fuori sui **wheel**, che sono anch'essi archivi ZIP (`.whl`) e servono
per gli esercizi con numpy/pandas. Gli esercizi base partirebbero comunque.
Il bottone "Perche'?" resta li' apposta per dirlo.

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

### 4.7 La spiegazione AI degli errori (v3.11)

`api/explain.ts` è una function Vercel che riceve esercizio + risposta sbagliata
e restituisce una spiegazione in italiano. La chiave sta **solo** nelle
Environment Variables di Vercel (Production e Preview), mai nel repo e mai nel
bundle: il browser parla con la nostra function, non con OpenRouter.

Tre cose imparate mettendola in funzione, tutte e tre costate un tentativo:

1. **Gli id dei modelli `:free` ruotano.** Quello scritto nel codice
   (`meta-llama/llama-3.3-70b-instruct:free`) era stato **ritirato**: con una
   chiave valida rispondeva `404`, e sembrava un problema di chiave. Per
   rileggere l'elenco aggiornato non serve autenticazione:
   `curl -s https://openrouter.ai/api/v1/models | grep -o '"[^"]*:free"'`
2. **La lista di ripiego accetta al massimo 3 modelli**, oltre risponde `400`.
3. **I modelli `:free` hanno capacità condivisa** e restituiscono `429`/`502` a
   caso quando sono saturi. Non è un guasto e **i crediti sul conto non lo
   risolvono**: alzano il tetto giornaliero, non la capacità upstream.

Per questo la richiesta porta una catena di 3 modelli e OpenRouter passa al
primo disponibile; se sono giù tutti, l'utente legge "modelli momentaneamente
saturi, riprova" invece del JSON grezzo.

**Se la flakiness dà fastidio**: `OPENROUTER_MODEL` su Vercel sostituisce il
primario senza toccare il codice. Puntandolo a un modello **a pagamento**
(quindi senza `:free`) la capacità è dedicata e sparisce il 429; per richieste
da ~320 token di output il costo è di frazioni di centesimo l'una.

Verificato in produzione il 19/08/2026: risposta corretta e in italiano su un
esercizio sbagliato di proposito.

---

## 5. Prossimi passi

### 5.1 Aperti e concreti
- **← IL PROSSIMO PASSO. Riprovare Python Lab dal PC dell'ufficio** dopo la
  v3.12 (vedi 4.1). La diagnosi è chiusa e la correzione è online; manca solo la
  conferma sul posto, perché è l'unica rete in cui il problema si manifesta.
  Se ricompare l'errore, il bottone **"Perché?"** dirà se è ancora un file
  filtrato — nel qual caso il proxy ispeziona il contenuto e non l'estensione, e
  il prossimo bersaglio sono i wheel `.whl`.
- ~~Attivare l'AI "Spiega errore"~~ **FATTO in v3.11** (vedi 4.7). Chiave su
  Vercel Production + Preview, verificata in produzione. Resta valida la regola:
  **Claude non inserisce chiavi**, nemmeno se gli vengono passate in chat — in
  quel caso vanno considerate compromesse e rigenerate.
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
services/pythonDiagnostics.ts     perche' l'ambiente Python non parte (bottone "Perche'?")
scripts/fetch-pyodide.mjs         scarica Pyodide prima del build
scripts/make-icon.py              rigenera favicon e icone PWA (2 varianti, vedi commenti)
api/explain.ts                    spiegazione AI degli errori (chiave solo su Vercel)
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

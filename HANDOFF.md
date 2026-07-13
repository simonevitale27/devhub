# HANDOFF — DevHub

> Aggiornato: 2026-07-12 · Sessione: migrazione backend Supabase Cloud → PocketBase self-hosted su Coolify (completata)
> Regola: leggere questo file PRIMA di toccare codice. A fine sessione, aggiornarlo con la skill `handoff`.

## Cos'è

Piattaforma di apprendimento SQL/Python/Data Analysis, tutta client-side (React 19 + Vite 6 + TypeScript, AlaSQL in-browser, Pyodide WASM). Il backend serve SOLO per auth e sync progressi; l'app funziona al 100% in guest mode senza backend. Deploy attuale: Vercel (devhub-gray.vercel.app). Docs interne: `ARCHITECTURE.md`, `DB_SCHEMA.md`, `DESIGN_SYSTEM.md`.

## Stato attuale (questa sessione: migrazione backend completata)

Il progetto Supabase Cloud (`egbcmvknkehyoztmocbt`) era in pausa: il piano free permette solo 2 progetti attivi per org, già occupati da `ev-charge-garage` e `flo`. Deciso di migrare devhub a **PocketBase self-hosted su Coolify** (non Supabase self-hosted: lo stack completo — 10+ container, Kong/GoTrue/Realtime/Storage — era sovradimensionato per il bisogno reale, auth + una tabella, e il VPS ha poca RAM libera; PocketBase è già in uso su altre app dello stesso VPS).

**Nuovo backend**: `https://pocketbase-j6784mksa2l2i5a6eg5oolgd.49.12.96.95.sslip.io` (servizio Coolify `devhub-pocketbase`, uuid `j6784mksa2l2i5a6eg5oolgd`), HTTPS con Let's Encrypt via Traefik. Superuser admin: credenziali in `~/.config/pocketbase/devhub.env` (chmod 600).

- `npx tsc --noEmit` ✅ pulito · `npm run build` ✅ ~4s
- Test end-to-end reali nel browser (dev server porta 3100): signup, login, completamento esercizio SQL → salvataggio cloud verificato via API, logout, re-login con sync progressi (Analytics Dashboard), **logout con backend down** (container fermato via SSH durante sessione attiva → logout istantaneo, nessun blocco).
- **NON testato**: login Google OAuth (nessuna credenziale configurata) e invio email reset-password (nessun SMTP configurato su PocketBase) — vedi "Passi manuali residui" sotto.

### Cosa è cambiato nel codice

| File | Cambio |
|---|---|
| `services/pocketbaseClient.ts` | **Nuovo**, sostituisce `services/supabaseClient.ts` (rimosso). Client PocketBase env-first (`VITE_POCKETBASE_URL`), circuit breaker `isPocketBaseAvailable`/`markPocketBaseUnavailable`, tipo `AuthUser` che disaccoppia il resto dell'app da PocketBase. |
| `services/authService.ts` | Riscritto su PocketBase SDK (`authWithPassword`, `authWithOAuth2`, `requestPasswordReset`). Stesse signature esportate di prima — nessun cambio nei call site in `LandingPage.tsx`. |
| `contexts/AuthContext.tsx` | Sessione ripristinata **sincrona** da `pb.authStore` (localStorage) invece del vecchio race-vs-timeout-3s di Supabase — più semplice e più veloce. |
| `services/progressService.ts` | `loadProgressSupabase`/`saveProgressSupabase` → `loadProgressPocketBase`/`saveProgressPocketBase` (query+create/update, PocketBase non ha upsert nativo). Funzioni esportate rinominate: `syncLocalToSupabase`→`syncLocalToBackend`, `syncSupabaseToLocal`→`syncBackendToLocal` (aggiornati tutti i call site). |
| `components/AccountPage.tsx` | Cambio password ora richiede **password attuale** (PocketBase lo impone per il self-update, campo nuovo nel form). Eliminazione account: `pb.collection('users').delete()` invece della RPC Supabase `delete_user` (cascade delete su `user_progress` gestito dallo schema). |
| `components/ResetPasswordPage.tsx` | Flusso a **token in query string** (`/reset-password?token=...`) invece di sessione da magic-link Supabase — vedi nota SMTP sotto. |
| `package.json` | `@supabase/supabase-js` rimosso, `pocketbase` aggiunto. |
| `vite.config.ts` | Chunk manuale `vendor-supabase` → `vendor-pocketbase`. |
| Vercel (progetto `devhub`) | `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` rimosse, `VITE_POCKETBASE_URL` aggiunta (prod+preview+dev). |
| `.env.local` | `VITE_POCKETBASE_URL` aggiunta per lo sviluppo locale. |

### Schema PocketBase (collection `user_progress`)

Equivalente a `supabase_setup.sql`: `user` (relation→users, cascadeDelete), `lab` (select sql/python), `topic_id` (text), `difficulty` (select easy/medium/hard), `exercise_index` (number), `attempts` (number), `completed_at` (date). API rules `user = @request.auth.id` su list/view/create/update/delete (equivalente RLS). Indice unique su `(user,lab,topic_id,difficulty,exercise_index)`.

Collection `users` (built-in) estesa con 2 campi custom: `avatar_url` (url, per l'avatar Google) e `provider` (text, per distinguere account email vs google in `AccountPage`).

**⚠️ Bug trovato e fixato durante il testing**: PocketBase tratta i campi number con `required: true` e valore `0` come "vuoti" (validation error), quindi `exercise_index: 0` (il primo esercizio di ogni topic) falliva silenziosamente il salvataggio — il circuit breaker si disattivava e nessun progresso veniva più salvato per il resto della sessione. Fix: `required: false` su `exercise_index`. Se in futuro si aggiungono altri campi numerici che possono valere 0, stesso problema.

### Dati storici

Il dump Supabase (`db_cluster-28-01-2026@03-39-55.backup.gz`) e lo storage export sono stati controllati: **entrambi vuoti** (nessun utente si era mai registrato/aveva sincronizzato progressi in cloud). Nessuna migrazione dati necessaria. I file dump/SQL Supabase in root sono ormai storici, si possono archiviare o eliminare quando si fa pulizia.

## Passi manuali residui (richiedono credenziali — non delegabili)

1. **Google OAuth**: creare credenziali su Google Cloud Console, redirect URI da aggiungere: `https://pocketbase-j6784mksa2l2i5a6eg5oolgd.49.12.96.95.sslip.io/api/oauth2-redirect`. Poi in PocketBase Admin UI (`<url>/_/`) → Collections → users → Options → OAuth2 → abilitare Google e incollare client id/secret. Il codice frontend (`signInWithGoogle` in `authService.ts`) è già pronto, non serve altro.
2. **SMTP per email transazionali** (reset password, verifica email): PocketBase Admin UI → Settings → Mail. Senza questo, `resetPassword()` non invia nulla (la UI mostra comunque il messaggio di conferma, ma l'utente non riceve email). Il template email è già configurato per puntare a `https://devhub-gray.vercel.app/reset-password?token=...`.
3. **Decommissioning Supabase Cloud**: il progetto `egbcmvknkehyoztmocbt` è in pausa, non serve più nulla — valutare se eliminarlo dalla dashboard Supabase per liberare eventualmente lo slot, oppure lasciarlo pausato.
4. **Dominio custom per PocketBase** (opzionale): oggi gira su un dominio sslip.io generato automaticamente. Se si vuole un dominio proprio (es. `db-devhub.simo-lab.xyz`, wildcard DNS già attivo su Porkbun → 49.12.96.95), va editato a mano `docker-compose.yml` su `/data/coolify/services/j6784mksa2l2i5a6eg5oolgd/` sul VPS (l'API Coolify non espone un modo per cambiare l'FQDN dei one-click service — limite noto di Coolify v4) e poi `docker compose up -d`. Ricordarsi che un redeploy da UI Coolify potrebbe rigenerare il file e perdere l'edit manuale.

## PROSSIMO STEP — Riscrittura esercizi + nuova sezione DAX (cert Power BI)

Non ancora iniziato. L'utente vuole:
1. **Riscrivere/potenziare gli esercizi esistenti.** Attenzione: `services/exerciseGenerator.ts` è 506KB/8k righe e `pythonExerciseGenerator.ts` 250KB/5.4k righe — mostri monolitici generati/patchati da script (i vari `scripts/fix_*.cjs` erano per questo). Per la riscrittura conviene ripensare il formato (es. esercizi come dati JSON/TS modulari per topic, non un file gigante) invece di patchare ancora.
2. **Nuova sezione DAX** per studiare per la certificazione Power BI (presumibilmente PL-300). Non esiste ancora nulla: né tipi, né topic, né engine. Punti di aggancio:
   - `types.ts`: enum `Page` e `TopicId`, tipo `Exercise`
   - `App.tsx`: routing lazy per pagina
   - `services/progressService.ts`: il campo `lab` è tipizzato `'sql' | 'python'` — va esteso (`'dax'`) sia nel TS sia nel campo select `lab` della collection `user_progress` su PocketBase (Admin UI o API, aggiungere il valore all'enum `values`)
   - Non esiste un motore DAX in browser: le opzioni realistiche sono validazione su output atteso (esercizi a risposta chiusa/quiz + confronto testo formula normalizzato), non esecuzione reale.

## Debiti tecnici noti (non bloccanti, in ordine di priorità)

1. **Tailwind via CDN** (`cdn.tailwindcss.com` in `index.html`): non production-grade, dipendenza esterna, config inline. Migrare a Tailwind build-time — MA occhio alle classi dinamiche generate a runtime: farlo con calma durante la riscrittura esercizi, verificando visivamente ogni pagina.
2. **Pyodide + Google Fonts da CDN**: la claim "tutto offline/nessun server" del README è parziale.
3. **Chunk `vendor-charts` 1.27MB**: recharts+xlsx+jspdf insieme; splittare se pesa sul mobile.
4. **`EXERCISES_PER_TOPIC = 60` hardcoded** in `progressService.ts`: se la riscrittura cambia i conteggi, i totali/percentuali di Analytics sbagliano.
5. Risultati numerici mostrati con coda floating-point (es. `2221.6077999999998`) nella tabella risultati SQL: arrotondare in display.
6. Commit history tutta "fix": da ora messaggi veri.
7. Working tree non committato da sessioni precedenti (vedi `git status`) — include ora anche tutte le modifiche di questa migrazione, mai committate.

## Suggested skills

- `handoff` — rigenerare questo file a fine sessione
- `verify` — dopo aver configurato Google OAuth/SMTP, per il giro end-to-end completo (incluso login Google e reset password reale)
- `tdd` — per il nuovo modulo DAX (validatore esercizi è logica pura, perfetta da testare)

## Come avviare

```bash
cd /Volumes/SSD/APPS/devhub
npm install
npm run dev   # porta 3000 (o launch config globale "devhub-dev" su 3100)
```

Guest mode: nessuna env necessaria. Login: serve `VITE_POCKETBASE_URL` (già in `.env.local` e su Vercel; il client ha comunque un fallback hardcoded sullo stesso URL prod).

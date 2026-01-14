# DevHub - Piattaforma di Training SQL Serverless

<img width="1916" height="925" alt="Screenshot 2026-01-14 alle 16 17 20" src="https://github.com/user-attachments/assets/43247c98-4a08-430d-bef7-9735ee426069" />

**Una piattaforma professionale per praticare SQL e analisi dati, interamente client-side. Nessun backend richiesto, esecuzione query istantanea, 800+ esercizi pratici.**

[Demo Live](https://devhub-gray.vercel.app) | [Documentazione Tecnica](#architettura-del-progetto)

---

## Panoramica

DevHub è una Progressive Web App (PWA) progettata per Data Analyst e sviluppatori che vogliono perfezionare le proprie competenze SQL attraverso esercizi pratici e scenari realistici. L'intera applicazione gira nel browser, utilizzando AlaSQL come database in-memory, eliminando completamente la latenza di rete.

Con la versione **2.0**, abbiamo introdotto il **Cloud Sync**: registrati gratuitamente per salvare i tuoi progressi su qualsiasi dispositivo!

### Caratteristiche Principali

- **SQL Lab**: oltre 800 esercizi suddivisi per argomento e difficoltà
- **DataLab**: ambiente sandbox per caricare e interrogare i propri file CSV
- **Cloud Profiles**: Salva i tuoi progressi nel cloud (Supabase) con login Google o Email
- **Account System**: Dashboard personale con statistiche e gestione profilo
- **Debug Mode**: esercizi con query volutamente errate da correggere
- **Zero Latency**: tutte le query vengono eseguite istantaneamente nel browser
- **PWA Installabile**: utilizzabile come applicazione standalone su desktop e mobile

---

## Moduli dell'Applicazione

### SQL Lab

Il modulo principale per l'allenamento SQL, strutturato per un apprendimento progressivo.

#### Argomenti Coperti

| Argomento | Descrizione | Keyword SQL |
| --------- | ----------- | ----------- |
| Select Base | Fondamenti delle query | SELECT, FROM, DISTINCT, ALIAS |
| Filtri | Operatori logici e condizionali | WHERE, AND/OR, IN, LIKE, NULL |
| Ordinamento | Controllo dell'ordine dei risultati | ORDER BY, ASC, DESC, LIMIT |
| Funzioni Scalari | Manipolazione stringhe e numeri | UPPER, ROUND, LEN, CONCAT |
| Date e Time | Gestione dati temporali | YEAR, MONTH, DATEDIFF |
| Join Tabelle | Unione di più tabelle | INNER, LEFT, RIGHT JOIN |
| Aggregazione | Raggruppamento e calcoli | GROUP BY, HAVING, SUM, AVG, COUNT |
| Logica Condizionale | Espressioni condizionali | CASE WHEN... THEN... END |
| Avanzate | Tecniche complesse | SUBQUERIES, WINDOW FUNCTIONS, CTE |

#### Livelli di Difficoltà

Ogni argomento include esercizi su tre livelli:

- **Easy**: hint espliciti con keyword dirette
- **Medium**: hint meno diretti, richiedono maggiore ragionamento
- **Hard**: hint concettuali, nessuna keyword suggerita

#### Funzionalità dell'Editor

- Syntax highlighting in tempo reale
- Auto-formatting delle query
- Inserimento smart delle colonne dal pannello schema
- Ghost text suggestions durante la digitazione
- Validazione istantanea con confronto risultati

#### Debug Mode

Modalità speciale dove le query contengono errori intenzionali. L'utente deve identificare e correggere:

- Errori di sintassi (virgole mancanti, typo nelle keyword)
- Errori logici (WHERE vs HAVING, operatori sbagliati)
- Errori avanzati (OVER mancante, parentesi delle subquery)

Tre livelli di difficoltà negli errori, con hint calibrati per ogni livello.

---

### DataLab

Ambiente sandbox per analisi dati su file propri.

#### Funzionalità

- **Import CSV**: drag-and-drop o selezione multipla di file
- **Query SQL**: interroga i dati caricati con sintassi SQL standard
- **Editor Ridimensionabile**: split-pane regolabile tra editor e risultati per massimizzare lo spazio di lavoro
- **Gestione Tabelle**:
  - Rinomina tabelle e colonne
  - Elimina tabelle o colonne
  - Salva risultati delle query come nuove tabelle
- **Table Inspector**: esplorazione interattiva con filtri per colonna
- **Data Quality Dashboard**:
  - Pulsante dedicato per l'analisi immediata della salute dei dati
  - Conteggio valori nulli, tipi di dato, unicità
  - Rilevamento valori anomali e statistiche descriptive
- **Data Profiling Avanzato**:
  - Tabella di profilazione integrata sopra i risultati
  - Mostra distribuzione, min/max, media e un campione scrollabile dei dati per ogni colonna

#### QuickChart & Visualizzazione

Strumento potente per la visualizzazione immediata dei dati:

- **Multi-Chart Support**:
  - **Bar Chart**: ideale per confronti categoriali
  - **Line Chart**: perfetto per analizzare trend temporali
  - **Area Chart**: per visualizzare volumi cumulativi
  - **Pie Chart**: per mostrare le proporzioni (es. market share)
- **Analytics Avanzati**:
  - **Trendlines**: aggiungi con un click linee di tendenza (regressione lineare)
  - **Mean Line**: visualizza istantaneamente la media dei valori
- **Interattività & Annotazioni**:
  - **Click-to-Annotate**: clicca su qualsiasi punto del grafico per aggiungere note testuali personalizzate
  - **Tooltip Intelligenti**: ispezione valori al passaggio del mouse
- **Export Suite Completa**:
  - **Formati Immagine**: Scarica in PNG o SVG (vettoriale) ad alta risoluzione
  - **Formati Dati**: Esporta i dati del grafico in CSV o JSON
  - **Copia negli Appunti**: Copia al volo l'immagine per incollarla in presentazioni o chat
- **Controlli Dati**:
  - **Filtri Top N**: Isola rapidamente i primi 5/10/20 risultati
  - **Ordinamento Automatico**: Ordina i dati per valore o etichetta

#### Esportazione & Integrazione

- **PDF Report**: documento professionale con grafici e kpi
- **Conversione SQL to Python**: Generazione automatica codice Pandas

---

## Python Lab

Un ambiente di coding completo per imparare Python, con focus sulla logica di programmazione e manipolazione dati.

### Tecnologie

- **Pyodide**: Motore Python completo in WebAssembly che gira interamente nel browser.
- **Sandboxed**: Esecuzione sicura e isolata, zero rischi per il sistema host.

### Caratteristiche

- **Curriculum Strutturato**:
  - **Fondamenti**: Variabili, Operatori, Input/Output
  - **Control Flow**: If/Else, Loop For/While
  - **Data Structures**: Liste, Tuple, Set, Dizionari
- **Editor Intelligente**:
  - **Autocomplete**: Suggerimenti in tempo reale per keyword e funzioni built-in
  - **Syntax Highlighting**: Colorazione del codice stile IDE
  - **Auto-indent**: Formattazione automatica intelligente
- **Modalità di Esercizio**:
  - **Solve Mode**: Scrivi la soluzione da zero partendo dalle specifiche
  - **Debug Mode**: Trova e correggi i bug in codice Python volutamente errato

---

## Database Schema

L'applicazione utilizza uno schema e-commerce realistico per gli esercizi:

```text
Users (id, name, email, country, is_premium, created_at)
   |
   +--< Orders (id, user_id, order_date, status, order_total)
          |
          +--< OrderItems (id, order_id, product_id, quantity, unit_price)
                    |
Products (id, name, category, price, stock) >--+

Employees (id, name, department, hire_date, manager_id)
```

Lo schema include chiavi primarie, chiavi esterne e relazioni one-to-many per esercitarsi con JOIN complesse.

---

## Stack Tecnologico

| Categoria   | Tecnologia    | Versione        |
| ----------- | ------------- | --------------- |
| Frontend    | React         | 19.2            |
| Linguaggio  | TypeScript    | 5.8             |
| Database    | AlaSQL        | 4.9 (in-memory) |
| Auth & DB   | **Supabase**  | **Client JS**   |
| Styling     | Tailwind CSS  | via CDN         |
| Build Tool  | Vite          | 6.2             |
| Grafici     | Recharts      | 3.5             |
| PDF         | jsPDF         | 3.0             |
| CSV Parser  | PapaParse     | 5.5             |
| Icons       | Lucide React  | 0.554           |

---

## Architettura del Progetto

### Filosofia Serverless & Cloud Hybrid

L'applicazione segue un approccio ibrido innovativo:

- **Core Logic**: Il database SQL di esercizio vive in memoria nel browser (AlaSQL) per garantire 0 latenza.
- **Cloud Layer**: I progressi utente e l'autenticazione sono gestiti da Supabase, permettendo la sincronizzazione tra dispositivi senza rallentare l'esperienza di coding.
- **Privacy**: I dati dell'utente (file importati in DataLab) rimangono rigorosamente locali. Solo i metadati dei progressi (esercizi completati) vengono sincronizzati.

### Struttura Directory

```text
devhub/
├── components/           # Componenti React UI
│   ├── SqlGym.tsx        # Modulo esercizi SQL
│   ├── DataLab.tsx       # Sandbox CSV/SQL
│   ├── AccountPage.tsx   # [NEW] Gestione Profilo Utente
│   └── ...
├── services/
│   ├── authService.ts    # [NEW] Integrazione Supabase Auth
│   ├── supabaseClient.ts # [NEW] Client Supabase Config
│   ├── sqlService.ts     # Wrapper AlaSQL
│   └── ...
├── utils/
│   └── ...
├── types.ts              # Definizioni TypeScript
├── constants.ts          # Schema DB, Topic, Snippets
└── ...
```

---

## Installazione

### Prerequisiti

- Node.js v18 o superiore
- npm o yarn

### Setup Locale

1. **Clone del repository e installazione**

    ```bash
    git clone https://github.com/username/devhub.git
    cd devhub
    npm install
    ```

2. **Configurazione Ambassador (Opzionale)**
    Crea un file `.env.local` per la configurazione del backend Supabase (opzionale per sviluppo offline, richiesto per auth):

    ```env
    VITE_SUPABASE_URL=tua_url
    VITE_SUPABASE_ANON_KEY=tua_key
    ```

3. **Avvio sviluppo**

    ```bash
    npm run dev
    # http://localhost:3000
    ```

### Build di Produzione

```bash
npm run build
npm run preview
```

---

## Licenza

MIT

---

**Sviluppato da un Data Analyst appassionato di clean code e workflow efficienti.**

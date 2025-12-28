# DevHub - Piattaforma di Training SQL Serverless

![DevHub Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

**Una piattaforma professionale per praticare SQL e analisi dati, interamente client-side. Nessun backend richiesto, esecuzione query istantanea, 800+ esercizi pratici.**

[Demo Live](https://devhub.vercel.app) | [Documentazione Tecnica](#architettura-del-progetto)

---

## Panoramica

DevHub e una Progressive Web App (PWA) progettata per Data Analyst e sviluppatori che vogliono perfezionare le proprie competenze SQL attraverso esercizi pratici e scenari realistici. L'intera applicazione gira nel browser, utilizzando AlaSQL come database in-memory, eliminando completamente la latenza di rete e la necessita di configurare un backend.

### Caratteristiche Principali

- **SQL Lab**: oltre 800 esercizi suddivisi per argomento e difficolta
- **DataLab**: ambiente sandbox per caricare e interrogare i propri file CSV
- **Debug Mode**: esercizi con query volutamente errate da correggere
- **Zero Latency**: tutte le query vengono eseguite istantaneamente nel browser
- **PWA Installabile**: utilizzabile come applicazione standalone su desktop e mobile

---

## Moduli dell'Applicazione

### SQL Lab

Il modulo principale per l'allenamento SQL, strutturato per un apprendimento progressivo.

**Argomenti Coperti**

| Argomento | Descrizione | Keyword SQL |
|-----------|-------------|-------------|
| Select Base | Fondamenti delle query | SELECT, FROM, DISTINCT, ALIAS |
| Filtri | Operatori logici e condizionali | WHERE, AND/OR, IN, LIKE, NULL |
| Ordinamento | Controllo dell'ordine dei risultati | ORDER BY, ASC, DESC, LIMIT |
| Funzioni Scalari | Manipolazione stringhe e numeri | UPPER, ROUND, LEN, CONCAT |
| Date e Time | Gestione dati temporali | YEAR, MONTH, DATEDIFF |
| Join Tabelle | Unione di piu tabelle | INNER, LEFT, RIGHT JOIN |
| Aggregazione | Raggruppamento e calcoli | GROUP BY, HAVING, SUM, AVG, COUNT |
| Logica Condizionale | Espressioni condizionali | CASE WHEN... THEN... END |
| Avanzate | Tecniche complesse | SUBQUERIES, WINDOW FUNCTIONS, CTE |

**Livelli di Difficolta**

Ogni argomento include esercizi su tre livelli:
- **Easy**: hint espliciti con keyword dirette
- **Medium**: hint meno diretti, richiedono maggiore ragionamento
- **Hard**: hint concettuali, nessuna keyword suggerita

**Funzionalita dell'Editor**

- Syntax highlighting in tempo reale
- Auto-formatting delle query
- Inserimento smart delle colonne dal pannello schema
- Ghost text suggestions durante la digitazione
- Validazione istantanea con confronto risultati

**Debug Mode**

Modalita speciale dove le query contengono errori intenzionali. L'utente deve identificare e correggere:
- Errori di sintassi (virgole mancanti, typo nelle keyword)
- Errori logici (WHERE vs HAVING, operatori sbagliati)
- Errori avanzati (OVER mancante, parentesi delle subquery)

Tre livelli di difficolta negli errori, con hint calibrati per ogni livello.

---

### DataLab

Ambiente sandbox per analisi dati su file propri.

**Funzionalita**

- **Import CSV**: drag-and-drop o selezione multipla di file
- **Query SQL**: interroga i dati caricati con sintassi SQL standard
- **Gestione Tabelle**:
  - Rinomina tabelle e colonne
  - Elimina tabelle o colonne
  - Salva risultati delle query come nuove tabelle
- **Table Inspector**: esplorazione interattiva con filtri per colonna
- **Data Health Check**: analisi automatica della qualita dei dati
  - Conteggio valori nulli
  - Statistiche per colonna (min, max, media, deviazione standard)
  - Rilevamento valori anomali

**Esportazione**

- **PDF Report**: documento professionale con:
  - Header con logo e metadati
  - Tabella dati formattata
  - Grafici automatici (Bar Chart, Pie Chart, KPI)
  - Statistiche calcolate
- **CSV**: esportazione raw dei risultati

**Conversione SQL to Python**

Generazione automatica di codice Pandas equivalente alle query SQL, utile per chi sta imparando Python per Data Analysis.

---

## Database Schema

L'applicazione utilizza uno schema e-commerce realistico per gli esercizi:

```
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

| Categoria | Tecnologia | Versione |
|-----------|-----------|----------|
| Frontend | React | 19.2 |
| Linguaggio | TypeScript | 5.8 |
| Database | AlaSQL | 4.9 (in-memory) |
| Styling | Tailwind CSS | via CDN |
| Build Tool | Vite | 6.2 |
| Grafici | Recharts | 3.5 |
| PDF | jsPDF + AutoTable | 3.0 |
| CSV Parsing | PapaParse | 5.5 |
| Icone | Lucide React | 0.554 |
| Formatting | sql-formatter | 15.6 |

---

## Architettura del Progetto

### Filosofia Serverless

L'intera applicazione e progettata per funzionare senza backend:
- Il database vive in memoria nel browser (AlaSQL)
- I dati vengono pre-caricati all'avvio
- Le query vengono eseguite localmente con latenza zero
- I file CSV vengono parsati client-side

Questo approccio garantisce:
- Instant feedback durante l'apprendimento
- Privacy totale (i dati non lasciano mai il browser)
- Funzionamento offline dopo il primo caricamento

### Struttura Directory

```
devhub/
├── components/           # Componenti React UI
│   ├── SqlGym.tsx       # Modulo esercizi SQL (1300+ righe)
│   ├── DataLab.tsx      # Sandbox CSV/SQL (1600+ righe)
│   ├── Home.tsx         # Homepage con navigazione
│   ├── SyntaxHighlightedEditor.tsx  # Editor con highlighting
│   ├── ResultsTable.tsx # Visualizzazione risultati
│   ├── ResultStats.tsx  # Calcolo statistiche
│   ├── ResultDiff.tsx   # Confronto query
│   ├── SchemaViewer.tsx # Pannello schema DB
│   ├── TableInspectorModal.tsx  # Esplorazione dati
│   ├── HealthReportModal.tsx    # Report qualita dati
│   └── ...
├── services/
│   ├── exerciseGenerator.ts  # Database 800+ esercizi
│   ├── sqlService.ts         # Wrapper AlaSQL
│   └── mockAiService.ts      # Coach AI simulato
├── utils/
│   ├── csvParser.ts          # Parsing robusto CSV
│   ├── formatSQL.ts          # SQL beautifier
│   ├── sqlToPandas.ts        # Conversione SQL->Python
│   ├── dataHealthCheck.ts    # Analisi qualita dati
│   └── ...
├── types.ts              # Definizioni TypeScript
├── constants.ts          # Schema DB, Topic, Snippets
├── ARCHITECTURE.md       # Documentazione architettura
├── DB_SCHEMA.md         # Schema database dettagliato
└── DESIGN_SYSTEM.md     # Linee guida UI/UX
```

---

## Installazione

### Prerequisiti

- Node.js v18 o superiore
- npm o yarn

### Setup Locale

```bash
# Clone del repository
git clone https://github.com/username/devhub.git
cd devhub

# Installazione dipendenze
npm install

# Avvio server di sviluppo
npm run dev

# Apertura nel browser
# http://localhost:3000
```

### Build di Produzione

```bash
npm run build
npm run preview
```

L'applicazione non richiede variabili d'ambiente o API key. Tutto funziona out-of-the-box.

---

## Casi d'Uso

### Per Data Analyst

- Praticare query SQL su dataset e-commerce realistici
- Testare scenari JOIN complessi senza setup database
- Validare query con feedback istantaneo
- Importare export CSV e analizzarli localmente
- Generare report PDF professionali

### Per Chi Sta Imparando SQL

- Percorso progressivo da Easy a Hard
- Hint calibrati per ogni livello di difficolta
- Visualizzazione schema interattiva con diagrammi ER
- Confronto visivo tra risultato atteso e ottenuto
- Debug Mode per imparare dagli errori comuni

### Per lo Studio Autonomo

- PWA installabile per studio offline
- Nessuna registrazione richiesta
- Dati completamente privati (tutto in locale)

---

## Highlight Tecnici

### Competenze Dimostrate

**Data Engineering**
- Progettazione schema relazionale
- Generazione procedurale di 800+ esercizi
- Parsing e validazione CSV robusto
- Analisi qualita dati automatizzata

**Frontend Development**
- Gestione stato complesso con React hooks
- Type safety rigorosa con TypeScript
- UI responsive con Tailwind CSS
- Editor custom con syntax highlighting

**Architettura Software**
- Approccio serverless completo
- Separazione logica componenti/servizi/utility
- PWA con Service Worker
- Zero-backend philosophy

**User Experience**
- Feedback istantaneo
- Progressive disclosure delle informazioni
- Gestione errori user-friendly
- Interfaccia dark mode ottimizzata

---

## Documentazione Aggiuntiva

- [ARCHITECTURE.md](ARCHITECTURE.md) - Architettura completa, pattern di data flow
- [DB_SCHEMA.md](DB_SCHEMA.md) - Schema database con diagrammi ER
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Sistema di design, componenti, stili

---

## Roadmap

- [ ] Python Lab: esercizi Pandas e NumPy
- [ ] Modalita competitiva con timer
- [ ] Salvataggio progressi in localStorage
- [ ] Esportazione esercizi completati

---

## Licenza

MIT

---

**Sviluppato da un Data Analyst appassionato di clean code e workflow efficienti.**

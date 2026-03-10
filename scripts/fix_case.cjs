const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../services/exerciseGenerator.ts');
const lines = fs.readFileSync(targetFile, 'utf8').split('\n');

const caseStart = lines.findIndex(l => l.includes('[TopicId.Case]: {'));
const easyStart = lines.findIndex((l, i) => i > caseStart && l.includes('[Difficulty.Easy]: ['));
const hardStart = lines.findIndex((l, i) => i > easyStart && l.includes('[Difficulty.Hard]: ['));

if (caseStart !== -1 && easyStart !== -1 && hardStart !== -1) {
  const newContent = `    [Difficulty.Easy]: [
      {
        titleTemplate: "Priorità di Rifornimento",
        descTemplate: "Assegna una priorità al rifornimento dei prodotti: se le scorte sono a 0 indica 'Critico', se sono uguali o inferiori a 10 'Riordino', altrimenti 'Ottimale'.",
        queryTemplate: "SELECT name, stock, CASE WHEN stock = 0 THEN 'Critico' WHEN stock <= 10 THEN 'Riordino' ELSE 'Ottimale' END as livello_scorte FROM Products",
        hints: ["Usa CASE WHEN con condizioni a cascata", "L'ordine delle condizioni è importante"],
        explanation: "Il costrutto CASE valuta le condizioni nell'ordine in cui sono scritte. La prima condizione vera determina il risultato.",
        replacements: {},
        brokenCode: "SELECT name, stock, CASE WHEN stock <= 10 THEN 'Riordino' WHEN stock = 0 THEN 'Critico' ELSE 'Ottimale' END as livello_scorte FROM Products",
        debugHint: "Attenzione all'ordine logico: se metti prima <= 10, la condizione = 0 non verrà mai raggiunta perché 0 è minore o uguale a 10."
      },
      {
        titleTemplate: "Classificazione Clienti",
        descTemplate: "Suddividi i clienti in due categorie: se hanno un abbonamento premium visualizza 'Cliente VIP', altrimenti 'Cliente Standard'.",
        queryTemplate: "SELECT name, CASE WHEN is_premium = true THEN 'Cliente VIP' ELSE 'Cliente Standard' END as tipo_cliente FROM Users",
        hints: ["Il campo is_premium è booleano (true/false)", "Usa THEN e ELSE"],
        explanation: "CASE permette di trasformare flag binari (boolean) in etichette testuali più esplicative per i report.",
        replacements: {},
        brokenCode: "SELECT name, CASE IF is_premium = true THEN 'Cliente VIP' ELSE 'Cliente Standard' END as tipo_cliente FROM Users",
        debugHint: "La sintassi è CASE WHEN, non CASE IF."
      },
      {
        titleTemplate: "Segmentazione Spedizioni",
        descTemplate: "Classifica le spedizioni in base al totale dell'ordine: gli ordini pari o superiori a 1000 ottengono la 'Spedizione Omaggio', gli altri la 'Spedizione Standard'.",
        queryTemplate: "SELECT id as order_id, order_total, CASE WHEN order_total >= 1000 THEN 'Spedizione Omaggio' ELSE 'Spedizione Standard' END as tipo_spedizione FROM Orders",
        hints: ["Confronta order_total con 1000 usando l'operatore di disuguaglianza adeguato"],
        explanation: "Puoi generare nuove colonne virtuali che applicano logiche di business basate su soglie numeriche.",
        replacements: {},
        brokenCode: "SELECT id as order_id, order_total, CASE order_total >= 1000 THEN 'Spedizione Omaggio' ELSE 'Spedizione Standard' FROM Orders",
        debugHint: "Manca la clausola WHEN prima della condizione logica e la parola chiave END alla chiusura."
      },
      {
        titleTemplate: "Traduzione Stati Ordine",
        descTemplate: "Italianizza gli stati degli ordini per il front-end: traduci 'Delivered' in 'Consegnato', 'Shipped' in 'Spedito' e raggruppa tutti gli altri stati in 'In Lavorazione'.",
        queryTemplate: "SELECT id, status, CASE WHEN status = 'Delivered' THEN 'Consegnato' WHEN status = 'Shipped' THEN 'Spedito' ELSE 'In Lavorazione' END as stato_it FROM Orders",
        hints: ["Usa condizioni multiple all'interno del blocco CASE"],
        explanation: "Utile per creare livelli di visualizzazione e localizzare o semplificare nomenclature applicative direttamente a livello di query.",
        replacements: {},
        brokenCode: "SELECT id, status, CASE status = 'Delivered' AND 'Consegnato' status = 'Shipped' AND 'Spedito' ELSE 'In Lavorazione' END as stato_it FROM Orders",
        debugHint: "La sintassi richiede l'uso della dicitura WHEN [condizione] THEN [risultato]."
      },
      {
        titleTemplate: "Categorizzazione Analitica",
        descTemplate: "Mappa i prodotti per le analisi contabili: se un prodotto appartiene alla categoria 'Electronics' segnalo come 'Dipartimento Tech', altrimenti raggruppalo come 'Dipartimento Generico'.",
        queryTemplate: "SELECT name, category, CASE WHEN category = 'Electronics' THEN 'Dipartimento Tech' ELSE 'Dipartimento Generico' END as dipartimento FROM Products",
        hints: ["Usa un semplice confronto testuale sulla colonna category"],
        explanation: "Il CASE permette non solo di cambiare nome a categorie esistenti, ma di aggregarle in macro-sezioni.",
        replacements: {},
        brokenCode: "SELECT name, category, CASE WHEN category IS 'Electronics' THEN 'Dipartimento Tech' ELSE 'Dipartimento Generico' END as dipartimento FROM Products",
        debugHint: "Per l'uguaglianza tra stringhe si usa l'operatore '=', l'operatore IS si utilizza tipicamente per i controlli sui valori NULL."
      },
      {
        titleTemplate: "Report Gerarchico",
        descTemplate: "Genera un semplice report risorse umane: se la matricola (id) non ha un manager associato (manager_id), identificalo come 'Dirigente', altrimenti come 'Dipendente'.",
        queryTemplate: "SELECT name, CASE WHEN manager_id IS NULL THEN 'Dirigente' ELSE 'Dipendente' END as ruolo_aziendale FROM Employees",
        hints: ["Come si verifica se un campo è vuoto in SQL?", "Usa IS NULL"],
        explanation: "I test sui valori mancanti sono importantissimi per le logiche condizionali aziendali, permettendo di identificare apicalità aziendali.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN manager_id = NULL THEN 'Dirigente' ELSE 'Dipendente' END as ruolo_aziendale FROM Employees",
        debugHint: "In SQL, l'operazione di uguaglianza standard (=) fallisce contro il valore NULL. L'unico modo corretto è usare l'operatore IS NULL."
      },
      {
        titleTemplate: "Screening Contatti",
        descTemplate: "Il marketing vuole segmentare il database: se l'email termina con '.com' considera l'origine come 'Internazionale', altrimenti 'Locale'.",
        queryTemplate: "SELECT name, email, CASE WHEN email LIKE '%.com' THEN 'Internazionale' ELSE 'Locale' END as origine_contatto FROM Users",
        hints: ["Verifica le stringhe con il Pattern Matching (LIKE)"],
        explanation: "All'interno del blocco CASE si possono inserire espressioni complesse, incluse operazioni stringa e match.",
        replacements: {},
        brokenCode: "SELECT name, email, CASE WHEN email = '%.com' THEN 'Internazionale' ELSE 'Locale' END as origine_contatto FROM Users",
        debugHint: "L'operatore = non valuta le wildcard (%). Usa l'operatore consono per effettuare le ricerche basate su pattern (text-matching)."
      },
      {
        titleTemplate: "Audit Anagrafiche",
        descTemplate: "Estrai uno stato per il Quality Assurance: se l'utente non ha impostato un'email (NULL), l'utente ha 'Dati Incompleti', altrimenti possiede un 'Profilo Valido'.",
        queryTemplate: "SELECT name, CASE WHEN email IS NULL THEN 'Dati Incompleti' ELSE 'Profilo Valido' END as stato_profilo FROM Users",
        hints: ["Individua lo stato dei valori nulli"],
        explanation: "I blocchi logici vengono ampiamente utilizzati dai reparti dati per pulire anomalie (data cleaning) o assegnare Quality scores.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN email = '' THEN 'Dati Incompleti' ELSE 'Profilo Valido' END as stato_profilo FROM Users",
        debugHint: "Essere vuoto (stringa vuota) è diverso dall'essere non inserito o inesistente (NULL)."
      },
      {
        titleTemplate: "Valutazione Asset Magazzino",
        descTemplate: "L'ufficio acquisti richiede di pesare il magazzino: calcola se il prodotto tra prezzo e giacenza sviluppa un controvalore maggiore di 5000 come 'Asset Primario', altrimenti come 'Asset Secondario'.",
        queryTemplate: "SELECT name, price, stock, CASE WHEN price * stock > 5000 THEN 'Asset Primario' ELSE 'Asset Secondario' END as importanza_asset FROM Products",
        hints: ["Puoi combinare espressioni matematiche all'interno della condizione logica"],
        explanation: "Oltre ai semplici confronti, SQL può elaborare operazioni aritmetiche interne per derivare un responso condizionale istantaneo.",
        replacements: {},
        brokenCode: "SELECT name, price, stock, CASE price * stock > 5000 THEN 'Asset Primario' ELSE 'Asset Secondario' END as importanza_asset FROM Products",
        debugHint: "Prendi nota che la forma richiede specificatamente la parola WHEN davanti alle singole condizioni che decidi di applicare."
      },
      {
        titleTemplate: "Verifica Eleggibilità Sconti",
        descTemplate: "Controlla le singole righe d'ordine: se la quantità (quantity) è uguale o superiore a 10, segnala che lo stato d'ordine è 'Sconto Quantità Applicabile', altrimenti è a 'Prezzo Pieno'.",
        queryTemplate: "SELECT order_id, product_id, CASE WHEN quantity >= 10 THEN 'Sconto Quantità Applicabile' ELSE 'Prezzo Pieno' END as promo_status FROM OrderItems",
        hints: ["Controlla contemporaneamente due opzioni in un unico operatore di disuguaglianza maggiore o uguale"],
        explanation: "Le flag sui raggruppamenti d'acquisto delineano trigger fondamentali per applicativi E-commerce.",
        replacements: {},
        brokenCode: "SELECT order_id, product_id, CASE WHEN quantity > 10 THEN 'Sconto Quantità Applicabile' ELSE 'Prezzo Pieno' END as promo_status FROM OrderItems",
        debugHint: "La richiesta parlava in modo esplicito di uguale o superiore a 10, quindi l'operatore utilizzato non copre il caso dell'uguaglianza."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Analisi Redditività Portafoglio",
        descTemplate: "Per supportare le riunioni trimestrali, crea tre segmenti di prezzo per i prodotti: meno di 50 come 'High Volume', tra 50 e 500 inclusi come 'Core Business', e sopra i 500 come 'Premium'.",
        queryTemplate: "SELECT name, price, CASE WHEN price < 50 THEN 'High Volume' WHEN price <= 500 THEN 'Core Business' ELSE 'Premium' END as segmento_vendita FROM Products",
        hints: ["L'ordine in cui si pongono le condizioni in SQL determina il loro flusso d'esecuzione."],
        explanation: "È possibile usare blocchi WHEN in cascata per simulare range multipli, senza ripetere gli step coperti dalle dichiarazioni temporali vicine.",
        replacements: {},
        brokenCode: "SELECT name, price, CASE WHEN price <= 500 THEN 'Core Business' WHEN price < 50 THEN 'High Volume' ELSE 'Premium' END as segmento_vendita FROM Products",
        debugHint: "Un prodotto a prezzo 20 rientra in 'Core Business' se poniamo prima la condizione <=500 chiudendo il blocco logico prima di arrivare alla soglia del suo segmento."
      },
      {
        titleTemplate: "Priorità Logistica Personalizzata",
        descTemplate: "Ordina gli ordini garantendo precedenza esecutiva per status: prima i 'Processing', poi gli 'Shipped', e infine tutti gli altri in fondo. (Includi l'ordinamento nativo su order_date ASC a parità di priorità).",
        queryTemplate: "SELECT id, status, order_date FROM Orders ORDER BY CASE WHEN status = 'Processing' THEN 1 WHEN status = 'Shipped' THEN 2 ELSE 3 END, order_date ASC",
        hints: ["Inserisci il CASE all'interno della clausola ORDER BY mappando gli stati testuali ordinandoli come interi o booleani"],
        explanation: "Usa il CASE WHEN senza alias se lo scopo è esclusivamente logistico ed in backend invisibile per riordinare valori categorici.",
        replacements: {},
        brokenCode: "SELECT id, status, order_date FROM Orders ORDER BY CASE WHEN status = 'Processing' THEN 1 WHEN status = 'Shipped' THEN 2 ELSE 3 END",
        debugHint: "Devi prevedere il criterio di spareggio secondario sulla data previsto."
      },
      {
        titleTemplate: "Deleghe Referenziali Operative",
        descTemplate: "Estrai il report dei referenti operativi (Coalesce): mostra il nome del dipendente e l'ID del proprio manager in una colonna logica 'referente_operativo'. Se un utente non ha un manager, estrai l'id del dipendente stesso.",
        queryTemplate: "SELECT name, COALESCE(manager_id, id) as referente_operativo FROM Employees",
        hints: ["COALESCE è una funzione di fallback essenziale nei raggruppamenti"],
        explanation: "COALESCE ritorna per natura il primo record o la prima colonna della sua firma (signature) che non sia a valore NULL (Fallback logic).",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN manager_id = NULL THEN id ELSE manager_id END as referente_operativo FROM Employees",
        debugHint: "Potresti teoricamente usare un CASE con operatore IS NULL, ma qui la best practice raccomandata e la soluzione implementativa impiega COALESCE."
      },
      {
        titleTemplate: "Difesa Frazionaria Errori",
        descTemplate: "L'ufficio auditing vuole il rendimento potenziale (price / stock). Poichè si generano errori matematici con stock a 0, rendivi a valore scalare la divisione impedendola tramite NULLIF se la metrica è 0.",
        queryTemplate: "SELECT name, price / NULLIF(stock, 0) as valore_unitario_reale FROM Products",
        hints: ["Evitare la sintesi division by zero"],
        explanation: "NULLIF in SQL agisce fornendo un NULL al denominatore quando la condizione è echeggiata (0).",
        replacements: {},
        brokenCode: "SELECT name, price / CASE WHEN stock = 0 THEN 1 ELSE stock END as valore_unitario_reale FROM Products",
        debugHint: "Dividerlo matematicamente con l'if falso mutando lo zero in 1 distorce irrimediabilmente i dati effettivi. È appropriato impiegare logiche SQL nativamente preposte alla manipolazione dello zero come denumeratore."
      },
      {
        titleTemplate: "Pipeline KPI Esecutivi",
        descTemplate: "Riassumi il tracking macro di settore: gli ordini in status 'Processing' e 'Shipped' devono concorrere congiuntamente nel subset formale 'In Corso'. Qualunque altra sigla sarà 'Completato'.",
        queryTemplate: "SELECT id, CASE WHEN status IN ('Processing', 'Shipped') THEN 'In Corso' ELSE 'Completato' END as macro_fase FROM Orders",
        hints: ["Evitare l'utilizzo sintattico ingrossato con multipli operatori logici OR se lo spread di dati ricade all'interno del proprio set operatore IN()"],
        explanation: "Le metriche macro che agglomerano svariate varibili puntiformi sono routine ordinaria in data engineering.",
        replacements: {},
        brokenCode: "SELECT id, CASE WHEN status = 'Processing' AND status = 'Shipped' THEN 'In Corso' ELSE 'Completato' END as macro_fase FROM Orders",
        debugHint: "Due stati diversi mutamente esclusivi nel corso logico della riga rendono la tua condizione AND logicamente preclusiva sempre (condizione irraggiungibile)."
      },
      {
        titleTemplate: "Calcolo Tariffario Multisoglia",
        descTemplate: "Calcola le spese di spedizione: gli ordini oltre o pari ai 1000 inclusi sono gratuiti (0), ordini sopra o pari ai 100 euro pagano 15.50, tutti gli altri pagheranno 25.00 d'assicurata.",
        queryTemplate: "SELECT id, order_total, CASE WHEN order_total >= 1000 THEN 0 WHEN order_total >= 100 THEN 15.50 ELSE 25.00 END as costo_spedizione FROM Orders",
        hints: ["Attenzione alle zone logiche per le esclusioni marginali di scalettatura."],
        explanation: "Simulazione formale di un motore contabile basico in estrazione database (pricing dinamico).",
        replacements: {},
        brokenCode: "SELECT id, order_total, CASE WHEN order_total >= 100 THEN 15.50 WHEN order_total >= 1000 THEN 0 ELSE 25.00 END as costo_spedizione FROM Orders",
        debugHint: "Invertendo l'ordine, i casi oltre i 1000 euro matureranno comunque il tariffario da 15.50 bloccando la discesa."
      },
      {
        titleTemplate: "Dashboard Cohort Seniority",
        descTemplate: "Crea bucket analitici per retention clienti: in base a created_at gli iscritti strettamente antecedenti al 2023 sono 'Legacy User', iscritti prima del 2024 'Established User', i restanti 'New User'.",
        queryTemplate: "SELECT name, CASE WHEN created_at < '2023-01-01' THEN 'Legacy User' WHEN created_at < '2024-01-01' THEN 'Established User' ELSE 'New User' END as cohort FROM Users",
        hints: ["Considera che i tag orari/data in questo formattato scenario sono processabili come string format."],
        explanation: "I cohort operazionali dipendono criticamente e massivamente dalle conversioni del timing log in string matching classici.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN created_at <= '2023-01-01' THEN 'Legacy User' WHEN created_at < '2024-01-01' THEN 'Established User' ELSE 'New User' END as cohort FROM Users",
        debugHint: "Inserendo l'uguale comprendi implicitamente il primo giorno dell'anno corrente per la fase Legacy scombinando internazionalmente le regole delle dashboard mensili comparative."
      },
      {
        titleTemplate: "Simulazione Pricing Dinamico",
        descTemplate: "Prevedi e modella estensivamente rialzi di scaglione pre-season: se il prodotto appartiene a 'Electronics' rincara del 15% (price * 1.15), in caso 'Furniture' rincara del 5% (price * 1.05), per i restanti inviati stazionari (solo price).",
        queryTemplate: "SELECT name, price as current_price, CASE WHEN category = 'Electronics' THEN price * 1.15 WHEN category = 'Furniture' THEN price * 1.05 ELSE price END as projected_price FROM Products",
        hints: ["Effettua il rate math sui ratei singolarmente."],
        explanation: "Le alterazioni algoritmiche dei prezzi di un'API sono in vari modelli demandate all'elaboratore SQL per ridurre la banda trasmissiva applicativa.",
        replacements: {},
        brokenCode: "SELECT name, price as current_price, CASE WHEN category = 'Electronics' THEN price + 15 WHEN category = 'Furniture' THEN price + 5 ELSE price END as projected_price FROM Products",
        debugHint: "Operi matematicamente aggiungendo un valore fisso (+15) anziché una rintacciatura percentuale per la moltiplicazione."
      },
      {
        titleTemplate: "Gestore Nomenclatura Anonimizzata",
        descTemplate: "Anonimizza i risultati estrattivi. Quando il nominativo dell'utente è esistente, formatta e visualizzalo come formattato testualmente in 'Utente: {nome}', nei casi mancanti/nulli apponici stringa standard costrutta per includere il codice 'Utente Anonimo ({id})'.",
        queryTemplate: "SELECT CASE WHEN name IS NOT NULL THEN 'Utente: ' || name ELSE 'Utente Anonimo (' || id || ')' END as display_name FROM Users",
        hints: ["Usa l'operatore di concatenazione testuale ||"],
        explanation: "La composizione testuale combinata a filtri garantisce astrazioni efficaci per API o esportazioni semi chiuse e blind-anonymization logica.",
        replacements: {},
        brokenCode: "SELECT CASE WHEN name IS NULL THEN 'Utente: ' || name ELSE 'Utente Anonimo (' || id || ')' END as display_name FROM Users",
        debugHint: "Le tue condizionali procedurali per l'inclusione logica IS NULL avvengono logicamente in verso invertito causando un concatenamento su una stringa nulla."
      },
      {
        titleTemplate: "Motore Premio Produzione Aggregato",
        descTemplate: "Un Modulatore valuta tutti i dipendenti aziendali: il dipendente 'Sales' assunto antecedentemente il 2022 percepisce aumento base su salary fissa +10%, membri del distretto 'IT' (indebitati alle tempistiche) un flat +5%, i restanti stabili.",
        queryTemplate: "SELECT name, salary, CASE WHEN department = 'Sales' AND hire_date < '2022-01-01' THEN salary * 1.10 WHEN department = 'IT' THEN salary * 1.05 ELSE salary END as nuovo_stipendio FROM Employees",
        hints: ["I controlli logici incrociati necessitano l'operatore AND"],
        explanation: "La clausola multifunzione WHEN gestisce l'incrocio dimensionale tra i flag dipartimanentali di competenza ed i ratei orario-temporali assuntivi logici.",
        replacements: {},
        brokenCode: "SELECT name, salary, CASE WHEN (department = 'Sales' OR hire_date < '2022-01-01') THEN salary * 1.10 WHEN department = 'IT' THEN salary * 1.05 ELSE salary END as nuovo_stipendio FROM Employees",
        debugHint: "Usi l'operatore matematicamente sbagliato (OR) ed in questo modo assegnerai fondi a casaccio."
      }
    ],`;
  
  const finalLines = [...lines.slice(0, easyStart), newContent, ...lines.slice(hardStart)];
  fs.writeFileSync(targetFile, finalLines.join('\n'), 'utf8');
  console.log("Success: Replaced Content Line-by-Line.");
} else {
  console.error("Indices not found", {caseStart, easyStart, hardStart});
}

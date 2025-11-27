import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface SQLCheatsheetProps {
  onClose: () => void;
}

interface CheatsheetItem {
  command: string;
  example: string;
  description: string;
}

interface CheatsheetSection {
  title: string;
  items: CheatsheetItem[];
}

const SQLCheatsheet: React.FC<SQLCheatsheetProps> = ({ onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const sections: CheatsheetSection[] = [
    {
      title: 'Base',
      items: [
        { command: 'SELECT', example: 'SELECT * FROM utenti', description: 'Seleziona dati da una tabella' },
        { command: 'FROM', example: 'SELECT nome FROM prodotti', description: 'Specifica la tabella sorgente' },
        { command: 'WHERE', example: 'SELECT * FROM utenti WHERE paese = \'Italia\'', description: 'Filtra i risultati' },
        { command: 'ORDER BY', example: 'SELECT * FROM prodotti ORDER BY prezzo DESC', description: 'Ordina i risultati' },
        { command: 'LIMIT', example: 'SELECT * FROM ordini LIMIT 10', description: 'Limita il numero di risultati' },
        { command: 'DISTINCT', example: 'SELECT DISTINCT paese FROM utenti', description: 'Rimuove duplicati' },
      ]
    },
    {
      title: 'Aggregazione',
      items: [
        { command: 'COUNT', example: 'SELECT COUNT(*) FROM prodotti', description: 'Conta il numero di righe' },
        { command: 'SUM', example: 'SELECT SUM(prezzo) FROM prodotti', description: 'Somma valori numerici' },
        { command: 'AVG', example: 'SELECT AVG(voto) FROM recensioni', description: 'Calcola la media' },
        { command: 'MIN/MAX', example: 'SELECT MIN(prezzo), MAX(prezzo) FROM prodotti', description: 'Trova min/max' },
        { command: 'GROUP BY', example: 'SELECT paese, COUNT(*) FROM utenti GROUP BY paese', description: 'Raggruppa risultati' },
        { command: 'HAVING', example: 'SELECT paese, COUNT(*) FROM utenti GROUP BY paese HAVING COUNT(*) > 5', description: 'Filtra gruppi' },
      ]
    },
    {
      title: 'Filtri',
      items: [
        { command: 'AND/OR', example: 'SELECT * FROM prodotti WHERE prezzo > 50 AND stock < 10', description: 'Operatori logici' },
        { command: 'IN', example: 'SELECT * FROM utenti WHERE paese IN (\'Italia\', \'Francia\')', description: 'Valore in una lista' },
        { command: 'LIKE', example: 'SELECT * FROM utenti WHERE email LIKE \'%@gmail.com\'', description: 'Pattern matching' },
        { command: 'BETWEEN', example: 'SELECT * FROM ordini WHERE data_ordine BETWEEN \'2023-01-01\' AND \'2023-12-31\'', description: 'Intervallo di valori' },
        { command: 'IS NULL', example: 'SELECT * FROM prodotti WHERE prezzo IS NOT NULL', description: 'Verifica valori NULL' },
      ]
    },
    {
      title: 'Joins',
      items: [
        { command: 'INNER JOIN', example: 'SELECT u.nome, o.id FROM utenti u INNER JOIN ordini o ON u.id = o.utente_id', description: 'Righe presenti in entrambe le tabelle' },
        { command: 'LEFT JOIN', example: 'SELECT u.nome, o.id FROM utenti u LEFT JOIN ordini o ON u.id = o.utente_id', description: 'Tutte le righe dalla tabella sinistra' },
        { command: 'RIGHT JOIN', example: 'SELECT u.nome, o.id FROM utenti u RIGHT JOIN ordini o ON u.id = o.utente_id', description: 'Tutte le righe dalla tabella destra' },
      ]
    },
    {
      title: 'Funzioni',
      items: [
        { command: 'UPPER/LOWER', example: 'SELECT UPPER(nome) FROM utenti', description: 'Conversione maiuscole/minuscole' },
        { command: 'CONCAT', example: 'SELECT CONCAT(nome, \' \', cognome) FROM utenti', description: 'Concatena stringhe' },
        { command: 'ROUND', example: 'SELECT ROUND(prezzo, 2) FROM prodotti', description: 'Arrotonda numeri' },
        { command: 'YEAR/MONTH', example: 'SELECT YEAR(data_ordine) FROM ordini', description: 'Estrai parte di una data' },
      ]
    }
  ];

  const copyToClipboard = (text: string, index: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
        {/* Content */}
          <div className="space-y-6">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-500 rounded"></div>
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => {
                    const copyId = `${sectionIdx}-${itemIdx}`;
                    const isCopied = copiedIndex === copyId;
                    
                    return (
                      <div
                        key={itemIdx}
                        className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <code className="text-emerald-400 font-bold text-xs">{item.command}</code>
                              <span className="text-[10px] text-slate-500 truncate">{item.description}</span>
                            </div>
                            <code 
                                onClick={() => copyToClipboard(item.example, copyId)}
                                className="text-[11px] text-slate-300 bg-slate-950 px-2 py-1.5 rounded block font-mono cursor-pointer hover:bg-slate-900 transition-colors truncate"
                                title="Clicca per copiare"
                            >
                              {item.example}
                            </code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.example, copyId)}
                            className={`flex-shrink-0 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 ${
                              isCopied
                                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 opacity-100'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-300 hover:border-slate-600'
                            }`}
                            title="Copia esempio"
                          >
                            {isCopied ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
    </div>
  );
};

export default SQLCheatsheet;

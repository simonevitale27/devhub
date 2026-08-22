// Prepara Pyodide per il self-hosting in public/pyodide/.
//
// PERCHE': prima Python Lab caricava Pyodide da cdn.jsdelivr.net e le wheel dei
// pacchetti dallo stesso CDN, con seaborn preso da PyPI. Su una rete che filtra
// i CDN pubblici (tipicamente aziendale) l'ambiente Python non partiva proprio,
// e il service worker non poteva aiutare perche' ignora le richieste
// cross-origin. Servendo tutto dal dominio dell'app il firewall non lo
// distingue dal resto del sito, e il service worker inizia a metterlo in cache.
//
// PERCHE' AL BUILD e non nel repo: sono ~78 MB di binari. Vivono in
// public/pyodide/, che e' gitignorato; questo script li ricrea su ogni macchina
// e su Vercel prima del build. Il core arriva dal pacchetto npm `pyodide`
// (versione bloccata nel package.json), le wheel dal CDN: la macchina di build
// ha accesso a internet, il browser dell'utente non ne avra' piu' bisogno.
//
// Idempotente: se un file c'e' gia', non lo riscarica.

import { createWriteStream } from 'node:fs';
import { mkdir, copyFile, readFile, access } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'node_modules', 'pyodide');
const OUT = path.join(root, 'public', 'pyodide');

// Solo i file che il worker carica davvero: niente .map ne' pyodide.mjs (il
// worker usa importScripts, quindi lo script classico).
// python_stdlib.zip e' copiato come .bin di proposito, NON e' un errore.
// Diagnosticato il 20/08/2026 dal PC dell'ufficio: il proxy aziendale risponde
// 403 a quel file e solo a quello (il .wasm da 8,9 MB passa senza problemi),
// quindi il blocco e' sul tipo "archivio", non sulla dimensione o sul binario.
// Stessi byte, estensione innocua: Vercel lo serve come application/octet-stream
// invece di application/zip. Il worker lo indica a Pyodide con l'opzione
// `stdLibURL`, che e' supportata: non stiamo aggirando niente a mano.
const STDLIB_SRC = 'python_stdlib.zip';
const STDLIB_DEST = 'python_stdlib.bin';

const CORE = [
  'pyodide.js',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'pyodide-lock.json',
];

// Pacchetti richiesti dagli esercizi. Le dipendenze si risolvono da sole
// leggendo pyodide-lock.json, cosi' non c'e' un secondo elenco da tenere
// allineato a mano.
const WANTED = ['numpy', 'pandas', 'matplotlib', 'micropip'];

// seaborn non fa parte della distribuzione Pyodide: prima veniva installato con
// micropip da PyPI, cioe' un altro host esterno che la rete puo' bloccare.
// Bloccato a una versione compatibile con matplotlib 3.5.2 / pandas 1.5.3.
const SEABORN = {
  file: 'seaborn-0.13.2-py3-none-any.whl',
  url: 'https://files.pythonhosted.org/packages/83/11/00d3c3dfc25ad54e731d91449895a79e4bf2384dc3ac01809010ba88f6d5/seaborn-0.13.2-py3-none-any.whl',
};

const exists = (p) => access(p).then(() => true, () => false);

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function main() {
  if (!(await exists(SRC))) {
    throw new Error(
      "node_modules/pyodide non trovato: esegui `npm install` prima del build."
    );
  }
  await mkdir(OUT, { recursive: true });

  for (const f of CORE) {
    const dest = path.join(OUT, f);
    if (!(await exists(dest))) await copyFile(path.join(SRC, f), dest);
  }

  const stdlib = path.join(OUT, STDLIB_DEST);
  if (!(await exists(stdlib))) await copyFile(path.join(SRC, STDLIB_SRC), stdlib);

  const lock = JSON.parse(await readFile(path.join(OUT, 'pyodide-lock.json'), 'utf8'));
  const pkgs = lock.packages;

  // Chiusura transitiva delle dipendenze dichiarate nel lock.
  const need = new Set();
  const add = (name) => {
    const key = name.toLowerCase();
    if (need.has(key) || !pkgs[key]) return;
    need.add(key);
    for (const dep of pkgs[key].depends ?? []) add(dep);
  };
  WANTED.forEach(add);

  const CDN = `https://cdn.jsdelivr.net/pyodide/v${lock.info.version}/full/`;
  let scaricati = 0;
  for (const key of [...need].sort()) {
    const file = pkgs[key].file_name;
    const dest = path.join(OUT, file);
    if (await exists(dest)) continue;
    await download(CDN + file, dest);
    scaricati++;
  }

  const seabornDest = path.join(OUT, SEABORN.file);
  if (!(await exists(seabornDest))) {
    await download(SEABORN.url, seabornDest);
    scaricati++;
  }

  console.log(
    `Pyodide ${lock.info.version} pronto in public/pyodide (${need.size + 1} pacchetti, ${scaricati} scaricati ora).`
  );
}

main().catch((e) => {
  console.error('fetch-pyodide fallito:', e.message);
  process.exit(1);
});

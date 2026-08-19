// Perché questo file esiste.
//
// Quando Pyodide non parte, Emscripten riporta solo "Program terminated with
// exit(1)": una frase che non distingue una rete che filtra i file da un
// browser a cui è stata tolta la compilazione WebAssembly. Sono cause opposte
// (una si aggira, l'altra no) e senza distinguerle si tira a indovinare.
//
// Questa diagnostica gira nel browser che ha il problema e dà un verdetto.

export type Causa = 'wasm-bloccato' | 'file-filtrato' | 'rete' | 'sconosciuta' | 'ok';

export interface Diagnosi {
  causa: Causa;
  verdetto: string; // in italiano, per chi legge
  cosaFare: string;
  dettagli: string[]; // tecnico, da incollare
}

// I quattro file che servono per accendere l'ambiente, prima ancora di numpy:
// se init fallisce, il problema è su uno di questi.
const ASSET: { file: string; magic?: number[]; atteso: string }[] = [
  { file: 'pyodide.js', atteso: 'JavaScript' },
  { file: 'pyodide.asm.js', atteso: 'JavaScript' },
  { file: 'pyodide.asm.wasm', magic: [0x00, 0x61, 0x73, 0x6d], atteso: 'WebAssembly' },
  { file: 'python_stdlib.zip', magic: [0x50, 0x4b, 0x03, 0x04], atteso: 'archivio ZIP' },
];

const WASM_VUOTO = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]); // header, modulo valido

function esa(b: Uint8Array): string {
  return Array.from(b.slice(0, 4))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join(' ');
}

/** WebAssembly può esistere come oggetto e comunque rifiutarsi di compilare:
 *  è quello che succede quando una policy aziendale disattiva il JIT. */
function provaWasm(): { ok: boolean; dettaglio: string } {
  if (typeof WebAssembly === 'undefined') {
    return { ok: false, dettaglio: 'WebAssembly: assente da questo browser' };
  }
  try {
    new WebAssembly.Module(WASM_VUOTO);
    return { ok: true, dettaglio: 'WebAssembly: compila correttamente' };
  } catch (e: any) {
    return { ok: false, dettaglio: `WebAssembly: presente ma NON compila (${e?.message || e})` };
  }
}

async function provaAsset(a: (typeof ASSET)[number]) {
  const url = `/pyodide/${a.file}`;
  try {
    // Solo i primi KB: basta a vedere se arriva il file vero o una pagina di
    // blocco, e non scarica 8 MB per fare una diagnosi.
    const r = await fetch(url, { headers: { Range: 'bytes=0-2047' }, cache: 'no-store' });
    if (!r.ok && r.status !== 206) {
      return { riga: `${a.file}: HTTP ${r.status}`, filtrato: true, errore: false };
    }
    const buf = new Uint8Array(await r.arrayBuffer());
    const ct = r.headers.get('content-type') || '?';
    const len = r.headers.get('content-range') || r.headers.get('content-length') || '?';

    // Un proxy che blocca non chiude la connessione: risponde 200 con l'HTML
    // della sua pagina di avviso. Il primo byte '<' lo smaschera.
    const html = buf[0] === 0x3c || /text\/html/i.test(ct);
    const magicOk = !a.magic || a.magic.every((b, i) => buf[i] === b);

    return {
      riga: `${a.file}: HTTP ${r.status}, type=${ct}, len=${len}, primi byte=${esa(buf)}${
        html ? '  <-- HTML, non ' + a.atteso : magicOk ? '  ok' : '  <-- non è ' + a.atteso
      }`,
      filtrato: html || !magicOk,
      errore: false,
    };
  } catch (e: any) {
    return { riga: `${a.file}: richiesta fallita (${e?.message || e})`, filtrato: false, errore: true };
  }
}

export async function diagnosticaPython(): Promise<Diagnosi> {
  const wasm = provaWasm();
  const esiti = await Promise.all(ASSET.map(provaAsset));
  const dettagli = [wasm.dettaglio, ...esiti.map((e) => e.riga), `URL: ${location.origin}`];

  if (!wasm.ok) {
    return {
      causa: 'wasm-bloccato',
      verdetto:
        'Questo browser non compila WebAssembly. Non è un problema di rete: è una policy che disattiva il JIT di JavaScript, tipica dei PC aziendali.',
      cosaFare:
        'Nel browser non c’è modo di aggirarla, perché Python gira proprio in WebAssembly. Serve chiedere all’IT un’eccezione per questo sito (policy Chrome "JavaScript JIT"), oppure usare DevHub Desktop, che usa il python3 del computer.',
      dettagli,
    };
  }
  if (esiti.some((e) => e.filtrato)) {
    return {
      causa: 'file-filtrato',
      verdetto:
        'WebAssembly funziona, ma almeno un file dell’ambiente Python non arriva integro: la rete lo sostituisce con altro (tipicamente la pagina di blocco del proxy aziendale).',
      cosaFare:
        'Vedi sotto quale file è: se è python_stdlib.zip il proxy sta bloccando gli archivi ZIP, ed è aggirabile servendolo con un’altra estensione. Con questo dettaglio possiamo sistemarlo.',
      dettagli,
    };
  }
  if (esiti.some((e) => e.errore)) {
    return {
      causa: 'rete',
      verdetto: 'Almeno una richiesta non è partita del tutto: la rete o un’estensione la sta bloccando prima che raggiunga il sito.',
      cosaFare: 'Prova in finestra di navigazione in incognito (disattiva le estensioni). Se lì funziona, è un’estensione.',
      dettagli,
    };
  }
  return {
    causa: 'sconosciuta',
    verdetto: 'I file arrivano integri e WebAssembly compila: la causa non è nessuna delle solite.',
    cosaFare: 'Copia il dettaglio qui sotto e mandamelo: serve guardare l’errore vero della console.',
    dettagli,
  };
}

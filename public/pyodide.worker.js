// DevHub Pyodide Web Worker (classic worker).
// Runs Pyodide OFF the main thread so runaway user code (e.g. `while True: pass`)
// can be killed with worker.terminate() from the main thread — the old in-thread
// setTimeout could never fire while the synchronous runPython blocked the tab.
//
// Protocol: main posts { id, type, payload }; worker replies
// { id, ok, result } or { id, ok:false, error }.

// Pyodide e' servito dal dominio dell'app (public/pyodide, popolato da
// scripts/fetch-pyodide.mjs), non piu' da cdn.jsdelivr.net: una rete che filtra
// i CDN pubblici impediva del tutto l'avvio dell'ambiente Python, e il service
// worker non poteva rimediare perche' ignora le richieste cross-origin.
// URL assoluto sulla radice del sito: il worker vive in /pyodide.worker.js, ma
// l'app puo' essere aperta da una sottopagina.
const PYODIDE_BASE = new URL('/pyodide/', self.location.origin).href;
importScripts(PYODIDE_BASE + 'pyodide.js');

let pyodide = null;
let stdoutBuf = '';
let stderrBuf = '';

async function ensurePyodide() {
  if (pyodide) return pyodide;
  pyodide = await self.loadPyodide({ indexURL: PYODIDE_BASE });
  pyodide.setStdout({ batched: (s) => { stdoutBuf += s; } });
  pyodide.setStderr({ batched: (s) => { stderrBuf += s; } });
  return pyodide;
}

// Build the DataLab wrapper: AST-splits the last expression, renders DataFrame/Series
// as JSON, and captures the matplotlib figure as base64 PNG. Mirrors the previous
// runPythonForDataLab wrapper exactly.
function buildDataLabCode(escapedCode) {
  return `
import pandas as pd
import json as _json
import ast as _ast
import sys as _sys
import io as _io
import base64 as _base64
import matplotlib.pyplot as _plt

_plt.switch_backend('Agg')
try:
    _plt.style.use('dark_background')
except:
    pass
_plt.rcParams.update({
    'figure.figsize': [10, 5],
    'figure.dpi': 200,
    'savefig.dpi': 200,
    'savefig.facecolor': '#0f0f1a',
    'figure.facecolor': '#0f0f1a',
    'axes.facecolor': '#141425',
    'axes.edgecolor': '#2a2a4a',
    'axes.linewidth': 0.8,
    'axes.labelcolor': '#c8c8e0',
    'axes.grid': True,
    'axes.prop_cycle': _plt.cycler('color', ['#00d2ff', '#7b68ee', '#ff6b9d', '#00e676', '#ffd54f', '#ff7043', '#b388ff', '#18ffff']),
    'grid.color': '#ffffff',
    'grid.alpha': 0.06,
    'grid.linestyle': '--',
    'grid.linewidth': 0.5,
    'xtick.color': '#9898b0',
    'ytick.color': '#9898b0',
    'xtick.labelsize': 9,
    'ytick.labelsize': 9,
    'xtick.major.pad': 6,
    'ytick.major.pad': 6,
    'xtick.major.size': 0,
    'ytick.major.size': 0,
    'text.color': '#e0e0f0',
    'font.size': 10,
    'font.family': 'sans-serif',
    'axes.titlesize': 13,
    'axes.titleweight': 'bold',
    'axes.titlepad': 14,
    'axes.labelsize': 10,
    'axes.labelpad': 8,
    'legend.facecolor': '#1a1a30',
    'legend.edgecolor': '#2a2a4a',
    'legend.fontsize': 9,
    'legend.framealpha': 0.9,
    'legend.fancybox': True,
    'legend.shadow': False,
    'figure.autolayout': True,
    'axes.spines.top': False,
    'axes.spines.right': False,
})

_code = """${escapedCode}"""

_sys.setrecursionlimit(500)

def _execute_and_display(code):
    try:
        _tree = _ast.parse(code)
        _last_is_expr = False

        if _tree.body and isinstance(_tree.body[-1], _ast.Expr):
            _last_is_expr = True
            _last_node = _tree.body.pop()

            if _tree.body:
                _exec_code = compile(_tree, "<string>", "exec")
                exec(_exec_code, globals())

            _eval_code = compile(_ast.Expression(_last_node.value), "<string>", "eval")
            _result = eval(_eval_code, globals())

            if _result is not None:
                try:
                    if isinstance(_result, pd.DataFrame):
                        _json_str = _result.to_json(orient='split', date_format='iso')
                        _data = _json.loads(_json_str)
                        print("__DATAFRAME_JSON__" + _json.dumps({"headers": _data['columns'], "rows": _data['data']}, default=str))
                    elif isinstance(_result, pd.Series):
                        _df = _result.to_frame()
                        _json_str = _df.to_json(orient='split', date_format='iso')
                        _data = _json.loads(_json_str)
                        print("__DATAFRAME_JSON__" + _json.dumps({"headers": _data['columns'], "rows": _data['data']}, default=str))
                    else:
                        _type_str = str(type(_result))
                        if 'matplotlib' in _type_str:
                            pass
                        else:
                            try:
                                _str_res = str(_result)
                                if 'AxesSubplot' not in _str_res and 'Axes(' not in _str_res and '<Figure' not in _str_res:
                                    print(_str_res)
                            except (RecursionError, OverflowError):
                                pass
                except (RecursionError, OverflowError):
                    pass
        else:
            exec(code, globals())

    except Exception as e:
        print(f"{type(e).__name__}: {e}", file=_sys.stderr)

    if _plt.get_fignums():
        _buf = _io.BytesIO()
        try:
            _plt.tight_layout()
        except:
            pass
        _plt.savefig(_buf, format='png', bbox_inches='tight', facecolor='#0f0f1a', edgecolor='none', pad_inches=0.3)
        _buf.seek(0)
        _img_str = _base64.b64encode(_buf.read()).decode('utf-8')
        print("__MATPLOTLIB_IMAGE__" + _img_str)
        _plt.close('all')

_execute_and_display(_code)
`;
}

function reply(id, result, error) {
  self.postMessage({ id, ok: !error, result: result ?? null, error: error || null });
}

self.onmessage = async (e) => {
  const { id, type, payload } = e.data || {};
  try {
    if (type === 'init') {
      await ensurePyodide();
      reply(id, {});
      return;
    }

    const py = await ensurePyodide();

    switch (type) {
      case 'loadPackages': {
        // seaborn non e' nella distribuzione Pyodide e va installato con micropip.
        // La wheel e' servita da noi invece che da PyPI: era l'ultimo host esterno
        // rimasto, quindi l'ultimo punto in cui una rete filtrante poteva rompere
        // gli esercizi Seaborn.
        const PIP_ONLY = ['seaborn'];
        const PIP_WHEELS = { seaborn: PYODIDE_BASE + 'seaborn-0.13.2-py3-none-any.whl' };
        const pkgs = payload.packages || [];
        const native = pkgs.filter((p) => !PIP_ONLY.includes(p));
        const pip = pkgs.filter((p) => PIP_ONLY.includes(p));
        if (native.length) await py.loadPackage(native);
        if (pip.length) {
          await py.loadPackage('micropip');
          const urls = pip.map((n) => PIP_WHEELS[n] ?? n);
          await py.runPythonAsync(`import micropip\nawait micropip.install(${JSON.stringify(urls)})`);
        }
        reply(id, {});
        break;
      }
      case 'writeFile': {
        try { py.FS.mkdir('/data'); } catch (_) { /* EEXIST ok */ }
        py.FS.writeFile('/data/' + payload.fileName, new Uint8Array(payload.bytes));
        reply(id, { path: '/data/' + payload.fileName });
        break;
      }
      case 'injectDataFrame': {
        await py.loadPackage(['pandas']);
        const json = JSON.stringify(payload.records).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        py.runPython(`import pandas as pd\nimport json as _json\n_data = _json.loads('${json}')\ndf_${payload.name} = pd.DataFrame(_data)\ndel _data`);
        reply(id, {});
        break;
      }
      case 'injectCSV': {
        await py.loadPackage(['pandas']);
        py.runPython(`import pandas as pd\ndf_${payload.tableName} = pd.read_csv('/data/${payload.fileName}', low_memory=False)`);
        reply(id, {});
        break;
      }
      case 'availableDataFrames': {
        const r = py.runPython(`import pandas as pd\n[name for name in dir() if name.startswith('df_') and isinstance(eval(name), pd.DataFrame)]`);
        reply(id, { frames: (r && r.toJs) ? r.toJs() : (r || []) });
        break;
      }
      case 'run': {
        stdoutBuf = '';
        stderrBuf = '';
        if (payload.mode === 'datalab') {
          await py.loadPackage(['pandas', 'matplotlib']);
          const escaped = payload.code.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
          py.runPython(buildDataLabCode(escaped));
        } else {
          py.runPython(payload.code);
        }
        reply(id, { stdout: stdoutBuf, stderr: stderrBuf });
        break;
      }
      default:
        reply(id, null, 'Unknown message type: ' + type);
    }
  } catch (err) {
    reply(id, null, (err && err.message) ? err.message : String(err));
  }
};

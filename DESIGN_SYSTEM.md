# 🎨 DevHub Design System

## La Bibbia del Design per Future Implementazioni

---

## 📋 Indice

1. [Color Palette](#-color-palette)
2. [Typography](#-typography)
3. [Componenti Base](#-componenti-base)
4. [Layout & Spacing](#-layout--spacing)
5. [Animazioni & Transizioni](#-animazioni--transizioni)
6. [Tone of Voice](#-tone-of-voice)

---

## 🎨 Color Palette

### Colori Primari

| Colore | HEX / Tailwind | Utilizzo |
|--------|----------------|----------|
| **Primario (Blue)** | `#3b82f6` / `blue-500` | Bottoni primari, accenti SQL Gym, link, highlights |
| **Primario Dark** | `#2563eb` / `blue-600` | Background bottoni primari, hover states |
| **Primario Light** | `#60a5fa` / `blue-400` | Testi accento, icone attive |

### Colori Secondari

| Colore | HEX / Tailwind | Utilizzo |
|--------|----------------|----------|
| **Secondario (Emerald)** | `#10b981` / `emerald-500` | DataLab accents, successi, validazioni positive |
| **Purple** | `#a855f7` / `purple-500` | Debug mode, AI Coach, soluzioni |
| **Orange** | `#f97316` / `orange-500` | Difficoltà Media |
| **Red** | `#ef4444` / `red-500` | Difficoltà Hard, Angular Lab (placeholder) |

### Colori di Background (Deep Black / High Contrast)

| Colore | HEX / Tailwind | Utilizzo |
|--------|----------------|----------|
| **Pure Black** | `#000000` / `bg-black` | Background principale (Assoluto) |
| **Stealth Glass** | `bg-[#121212]/60 backdrop-blur-xl` | Sidebar, Pannelli, Modal |
| **Transparent Glass** | `bg-[#121212]/40 backdrop-blur-xl` | Homepage Cards (High Transparency) |
| **Liquid Glass** | `bg-gradient-to-b ... shadow-inset` | Bottoni Attivi (Gym, Debug, Difficulty) |
| **Liquid Glass 3D** | `bg-gradient-to-b ... shadow-lg` | Bottoni Esplora Tabella, Sidebar Active Topic |
| **Recessed Glass** | `bg-black/20 ring-1 ring-black/20 inset` | Editor, Input (Incassati) |
| **No Border** | `border-none` | **NESSUN BORDO VISIBILE** |
| **Separation** | Solo sfondo leggermente più chiaro + blur | Nessuna ombra/ring visibile |
| **Primary Text** | `#ffffff` / `white` | Headings, Titoli |
| **Body Text** | `#94a3b8` / `slate-400` | Testo secondario |
| **Accent** | `#3b82f6` / `blue-500` | Pulsanti primari, Link |

### Colori di Stato

| Colore | HEX / Tailwind | Utilizzo |
|--------|----------------|----------|
| **Successo** | `#10b981` / `green-500` | Risultati corretti, validazioni positive |
| **Errore** | `#ef4444` / `red-500` | Errori, validazioni negative |
| **Warning** | `#f59e0b` / `amber-500` | Avvisi, hints, suggerimenti |
| **Info** | `#3b82f6` / `blue-500` | Informazioni neutre, note |

### Colori di Difficoltà

| Difficoltà | Background | Text | Border | Shadow |
|-----------|------------|------|--------|--------|
| **Easy** | `bg-green-600` | `text-green-400` | `border-green-500` | `shadow-green-600/20` |
| **Medium** | `bg-orange-600` | `text-orange-400` | `border-orange-500` | `shadow-orange-600/20` |
| **Hard** | `bg-red-600` | `text-red-400` | `border-red-500` | `shadow-red-600/20` |

### Colori di Testo

| Colore | HEX / Tailwind | Utilizzo |
|--------|----------------|----------|
| **Text Primary** | `#f8fafc` / `slate-50` | Testo principale, titoli |
| **Text Secondary** | `#cbd5e1` / `slate-300` | Testo secondario, descrizioni |
| **Text Tertiary** | `#94a3b8` / `slate-400` | Testo sfumato, labels |
| **Text Muted** | `#64748b` / `slate-500` | Placeholder, testo disabilitato |

### Syntax Highlighting (SQL)

| Elemento | Colore | HEX / Tailwind |
|----------|--------|----------------|
| **Keywords** | Green | `#4ade80` / `green-400` |
| **Functions** | Yellow | `#fbbf24` / `amber-400` |
| **Standard Text** | White | `#f8fafc` / `slate-50` |
| **Ghost Text** | Muted | `#475569` / `slate-600` |

---

## 📝 Typography

### Font Families

```css
font-sans: 'Inter', sans-serif;        /* Testo generale, UI */
font-mono: 'JetBrains Mono', monospace; /* Codice, tabelle dati */
font-outfit: 'Outfit', sans-serif;      /* Titoli speciali, headings */
```

### Gerarchia Tipografica

| Livello | Tailwind Classes | Utilizzo | Esempio |
|---------|------------------|----------|---------|
| **H1 Hero** | `text-7xl md:text-8xl font-black tracking-tighter` | Homepage hero | "MASTER YOUR STACK" |
| **H1** | `text-4xl font-bold text-white` | Titoli pagina principali | Titoli modali |
| **H2** | `text-2xl font-bold text-white tracking-tight font-outfit` | Sottotitoli, card titles | "SQL Lab", "DataLab" |
| **H3** | `text-xl font-bold text-white` | Titoli sezione | Titoli esercizi |
| **Body** | `text-sm text-slate-300 leading-relaxed` | Testo normale | Descrizioni esercizi |
| **Body Small** | `text-xs text-slate-400` | Testo secondario | Labels, metadata |
| **Code** | `font-mono text-sm text-purple-100` | Codice SQL | Editor, soluzioni |
| **Badge** | `text-xs font-bold uppercase tracking-wider` | Badge, labels | "Beta v1.0", "PK", "FK" |

### Esempi di Utilizzo

```html
<!-- Hero Title -->
<h1 class="text-7xl md:text-8xl font-black tracking-tighter text-white">
  MASTER YOUR <span class="text-blue-500">STACK</span>
</h1>

<!-- Card Title -->
<h2 class="text-2xl font-bold text-white tracking-tight font-outfit">
  SQL Lab
</h2>

<!-- Description -->
<p class="text-slate-300 text-sm leading-relaxed">
  Esercizi pratici, scenari reali e database volatili.
</p>

<!-- Code Block -->
<code class="font-mono text-sm text-purple-200">
  SELECT * FROM users WHERE active = 1
</code>
```

---

## 🧩 Componenti Base

### Bottoni

#### Bottone Primario

```html
<button class="
  px-4 py-2 
  bg-blue-600 hover:bg-blue-500 
  text-white font-bold 
  rounded-lg 
  transition-all duration-300 
  shadow-lg shadow-blue-900/20
  active:scale-95
">
  Esegui Query
</button>
```

**Caratteristiche:**

- **Background**: `bg-[radial-gradient...]`
- **Surface**: `bg-white/5 backdrop-blur-2xl`
- **Separation**: `shadow-2xl ring-1 ring-white/10 inset`
- **Radius**: `rounded-3xl`
- Hover: `hover:bg-blue-500`
- Padding: `px-4 py-2`
- Border radius: `rounded-lg` (8px)
- Shadow: `shadow-lg shadow-blue-900/20`
- Transizione: `transition-all duration-300`
- Click effect: `active:scale-95`

#### Bottone Secondario

```html
<button class="
  px-4 py-2 
  bg-slate-800/50 hover:bg-slate-800 
  text-slate-400 hover:text-white 
  border border-slate-700 hover:border-slate-500 
  rounded-lg 
  transition-all duration-300
">
  Mostra Schema
</button>
```

**Caratteristiche:**

- Background: `bg-slate-800/50`
- Hover: `hover:bg-slate-800`
- Border: `border border-slate-700`
- Transizione colore testo: `text-slate-400 hover:text-white`

#### Bottone Icon

```html
<button class="
  p-2 
  text-slate-400 hover:text-white 
  hover:bg-slate-800 
  rounded 
  transition-colors
">
  <HomeIcon size={18} />
</button>
```

#### Bottone Disabilitato

```html
<button 
  disabled 
  class="
    px-4 py-2 
    bg-slate-900/20 
    text-slate-600 
    opacity-70 
    cursor-not-allowed 
    rounded-lg
  "
>
  Coming Soon
</button>
#### Bottone Liquid Glass (Gym/Debug/Difficulty)

```html
<button class="
  relative z-10 
  px-4 py-2 
  bg-gradient-to-b from-blue-500/30 to-blue-600/5 
  backdrop-blur-xl 
  border border-white/5 
  shadow-[0_0_15px_rgba(59,130,246,0.2)_inset] shadow-blue-500/10
  rounded-lg 
  transition-all duration-300
">
  GYM MODE
</button>
```

#### Bottone Liquid Glass 3D (Esplora Tabella)

```html
<button class="
  w-full flex items-center justify-center gap-2 
  px-4 py-3 
  bg-gradient-to-b from-blue-500/30 to-blue-600/5 
  backdrop-blur-xl 
  border border-white/10 
  shadow-[0_0_15px_rgba(59,130,246,0.4)_inset] shadow-lg shadow-blue-500/20 
  rounded-lg 
  text-blue-300 hover:text-blue-200 
  text-sm font-semibold 
  transition-all duration-300 
  hover:from-blue-500/40 hover:to-blue-600/10 
  hover:shadow-[0_0_20px_rgba(59,130,246,0.5)_inset] 
  active:scale-95
">
  <Maximize2 size={14} />
  Esplora Tabella
</button>
```

#### Bottone Accordion Tabella (Chiuso)

```html
<button class="
  w-full px-4 py-3 
  flex items-center justify-between 
  bg-[#121212]/60 backdrop-blur-xl 
  hover:bg-white/5 
  shadow-lg shadow-black/40
  rounded-lg 
  transition-all duration-300
">
  <!-- Content -->
</button>
```

#### Bottone Liquid Glass Minimal (Shuffle/History)

```html
<button class="
  py-2 px-3 
  bg-[#121212]/60 backdrop-blur-xl 
  hover:bg-white/5 
  rounded-lg 
  transition-all 
  shadow-md shadow-black/20
  group
">
  <Shuffle class="group-active:rotate-180 transition-transform duration-500" />
</button>
```

**Caratteristiche:**

- **Gradient**: `bg-gradient-to-b from-color/30 to-color/5` (Profondità verticale)
- **Inner Glow**: `shadow-[0_0_15px_rgba(color,0.2)_inset]` (Luce interna)
- **Minimal Border**: `border-white/5` (Contorno quasi invisibile)
- **Backdrop**: `backdrop-blur-xl` (Effetto vetro)
- **Shadow**: `shadow-color/10` (Ombra esterna leggerissima)

### Card

#### Card Standard (Esercizi, Moduli)

```html
<div class="
  bg-[#121212]/40 
  backdrop-blur-xl 
  ring-1 ring-inset ring-white/5 
  rounded-3xl 
  p-8 
  transition-all duration-500 
  hover:scale-105 
  hover:bg-[#121212]/50
  hover:ring-blue-500/20
">
  <!-- Contenuto card -->
</div>
```

**Caratteristiche:**

- Background sfumato: `bg-slate-900/40`
- Backdrop blur: `backdrop-blur-md`
- Border: `border border-slate-800`
- Border radius: `rounded-3xl` (24px)
- Padding: `p-8`
- Hover scale: `hover:scale-105`
- Hover shadow: `hover:shadow-2xl hover:shadow-blue-500/10`
- Hover border: `hover:border-blue-500/50`

#### Card Icon Container (all'interno delle card)

```html
<div class="
  w-16 h-16 
  bg-blue-500/10 
  rounded-2xl 
  flex items-center justify-center 
  text-blue-500 
  border border-blue-500/20 
  shadow-inner
  group-hover:scale-110 
  transition-transform duration-500
">
  <Database size={28} strokeWidth={1.5} />
</div>
```

#### Card Informativa (CSV info, stats)

```html
<div class="
  bg-slate-900/50 
  border border-slate-800 
  rounded-lg 
  p-6
">
  <!-- Contenuto -->
</div>
```

### Modali

#### Modal Container

```html
<!-- Overlay -->
<div class="
  fixed inset-0 z-50 
  bg-black/60 backdrop-blur-md 
  flex items-center justify-center 
  p-8 
  animate-in fade-in duration-200
">
  <!-- Modal Content -->
  <div class="
    relative z-50 
    bg-[#0b1120] 
    border border-slate-700 
    rounded-xl 
    shadow-2xl 
    w-full max-w-5xl max-h-[85vh] 
    overflow-hidden
    animate-in zoom-in-95 duration-300
  ">
    <!-- Header -->
    <div class="
      flex items-center justify-between 
      px-6 py-4 
      border-b border-slate-700 
      bg-gradient-to-r from-blue-900/20 to-transparent
    ">
      <h2 class="text-xl font-bold text-white">Titolo Modal</h2>
      <button class="
        p-2 
        text-slate-400 hover:text-white 
        hover:bg-slate-800 
        rounded-lg 
        transition-colors
      ">
        <X size={20} />
      </button>
    </div>
    
    <!-- Body -->
    <div class="flex-1 overflow-auto p-4 bg-[#0f172a]">
      <!-- Contenuto -->
    </div>
  </div>
</div>
```

**Caratteristiche:**

- Overlay scuro: `bg-black/60 backdrop-blur-md`
- Background modal: `bg-[#0b1120]`
- Border radius: `rounded-xl`
- Header gradient: `bg-gradient-to-r from-blue-900/20 to-transparent`
- Animazioni: `animate-in fade-in` per overlay, `zoom-in-95` per content

### Input & Form

#### Text Input

```html
<input 
  type="text"
  placeholder="Cerca argomento..."
  class="
    w-full 
    bg-slate-900/50 
    border border-slate-800 
    focus:border-blue-500/50 
    focus:bg-slate-900 
    rounded 
    text-sm py-2 px-3 
    text-slate-200 
    placeholder-slate-600
    focus:outline-none 
    transition-all
  "
/>
```

#### Syntax Highlighted Editor

Il nuovo editor SQL utilizza una tecnica di **Overlay** per garantire performance native e highlighting in tempo reale.

```tsx
<div className="relative h-full w-full font-mono text-[15px]">
  {/* 1. Highlight Layer (Bottom) */}
  <div className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-transparent">
    {/* HTML colorato generato via Regex */}
  </div>

  {/* 2. Input Layer (Top) */}
  <textarea
    className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white resize-none outline-none"
    spellCheck={false}
  />
</div>
```

**Caratteristiche:**

- **Font**: `font-mono` (JetBrains Mono)
- **Size**: `text-[15px]`
- **Caret**: `caret-white` (cursore personalizzato)
- **Scrollbar**: Nascosta (`scrollbar-hide`) per pulizia visiva
- **Interaction**: Supporto nativo per selezione, copia/incolla e shortcut

### Badge & Pills

#### Badge Info

```html
<span class="
  px-3 py-1 
  bg-blue-600 
  text-white 
  text-xs font-bold 
  rounded-full
">
  Beta v1.0
</span>
```

#### Badge Success

```html
<span class="
  px-2 py-0.5 
  bg-emerald-900/30 
  text-emerald-400 
  text-xs 
  rounded 
  border border-emerald-900/50
">
  CSV Sandbox
</span>
```

#### Primary/Foreign Key Badge

```html
<!-- Primary Key -->
<span class="
  inline-flex items-center gap-1 
  px-1.5 py-0.5 
  bg-amber-500/20 
  border border-amber-500/50 
  rounded 
  text-[10px] font-bold text-amber-300
">
  <Key size={10} /> PK
</span>

<!-- Foreign Key -->
<span class="
  inline-flex items-center gap-1 
  px-1.5 py-0.5 
  bg-blue-500/20 
  border border-blue-500/50 
  rounded 
  text-[10px] font-bold text-blue-300
">
  <Link size={10} /> FK
</span>
```

### Tabelle

#### Table Container

```html
<div class="bg-[#0b1120] rounded-lg border border-slate-800 overflow-x-auto">
  <table class="w-full text-sm">
    <thead class="bg-slate-900 text-slate-200 sticky top-0 z-10">
      <tr>
        <th class="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
          Colonna
        </th>
      </tr>
    </thead>
    <tbody class="bg-slate-900 divide-y divide-slate-800 font-mono text-xs">
      <tr class="hover:bg-slate-800/50 transition-colors">
        <td class="px-4 py-2 text-slate-300">Dato</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Caratteristiche:**

- Background tabella: `bg-[#0b1120]`
- Border: `border border-slate-800`
- Border radius: `rounded-lg`
- Thead sticky: `sticky top-0 z-10`
- Row hover: `hover:bg-slate-800/50`
- Font mono per dati: `font-mono text-xs`

### Alert & Notification

#### Success Alert

```html
<div class="
  bg-green-900/20 
  border-l-2 border-green-500/50 
  p-4 
  rounded-r-lg 
  text-sm text-green-200 
  shadow-lg
">
  <strong class="text-green-400 block text-xs uppercase tracking-wider mb-2">
    Successo
  </strong>
  Risultato perfetto!
</div>
```

#### Error Alert

```html
<div class="
  bg-red-900/20 
  border border-red-900/50 
  rounded-lg 
  p-4 
  flex items-start gap-3
">
  <AlertCircle class="text-red-400 flex-shrink-0" size={20} />
  <div>
    <div class="text-sm font-bold text-red-400 mb-1">Errore</div>
    <div class="text-sm text-slate-300">Messaggio di errore</div>
  </div>
</div>
```

#### Warning Alert (Hint)

```html
<div class="
  bg-amber-950/30 
  border-l-2 border-amber-500/50 
  p-4 
  rounded-r-lg 
  text-sm text-amber-200 
  shadow-lg
">
  <strong class="text-amber-400 block text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
    <Lightbulb size={14} /> Suggerimento
  </strong>
  Contenuto suggerimento
</div>
```

#### Info Alert (Solution)

```html
<div class="
  bg-purple-950/30 
  border-l-2 border-purple-500/50 
  p-4 
  rounded-r-lg 
  text-sm 
  shadow-lg
">
  <strong class="text-purple-400 block text-xs uppercase tracking-wider mb-2">
    Soluzione
  </strong>
  <code class="font-mono text-purple-200 block bg-black/30 p-3 rounded border border-purple-500/20">
    SELECT * FROM users
  </code>
</div>
```

### Sidebar

#### Sidebar Container

```html
<aside class="
  w-64 
  bg-[#0b1120] 
  border-r border-slate-800 
  flex flex-col 
  shrink-0 
  z-20 
  shadow-2xl
">
  <!-- Header -->
  <div class="
    h-16 
    flex items-center px-4 
    border-b border-slate-800 
    gap-2
  ">
    <!-- Logo/Title -->
  </div>
  
  <!-- Scrollable Content -->
  <div class="
    flex-1 overflow-y-auto 
    py-3 px-2 
    space-y-1.5 
    custom-scrollbar
  ">
    <!-- Items -->
  </div>
  
  <!-- Footer -->
  <div class="
    p-4 
    border-t border-slate-800 
    space-y-2
  ">
    <!-- Actions -->
  </div>
</aside>
```

---

## 📐 Layout & Spacing

### Container Spacing

- **Padding esterno pagine**: `p-6` (24px)
- **Padding cards**: `p-8` (32px) per card grandi, `p-4` (16px) per card piccole
- **Padding modali**: `px-6 py-4` (header), `p-4` (body)
- **Padding bottoni**: `px-4 py-2` (standard), `p-2` (icon button)

### Gap & Spacing tra Elementi

- **Gap piccolo**: `gap-2` (8px) - icone e testo
- **Gap medio**: `gap-4` (16px) - elementi correlati
- **Gap grande**: `gap-6` (24px) - sezioni diverse

### Margin

- **Margin bottom titoli**: `mb-2` (8px) per H2, `mb-4` (16px) per H1
- **Margin tra sezioni**: `space-y-4` o `space-y-6`

### Border Radius

- **Piccolo**: `rounded` (4px) - input, small buttons
- **Medio**: `rounded-lg` (8px) - cards standard, modal
- **Grande**: `rounded-xl` (12px) - modali
- **Extra Large**: `rounded-3xl` (24px) - feature cards (homepage)
- **Pillola**: `rounded-full` - badges

### Height & Width Standards

- **Header height**: `h-16` (64px)
- **Icon button size**: `p-2` con iconSize={18}
- **Icon in cards**: Size 24-28
- **Sidebar width**: `w-64` (256px)
- **Sidebar Top Margin**: `mt-7` (Allineamento perfetto con header buttons)
- **Sidebar Height**: `h-[calc(100vh-2.5rem)]` (Allineamento bottom con content)
- **AI Coach sidebar**: `w-96` (384px)

---

## ✨ Animazioni & Transizioni

### Transizioni Standard

```css
transition-all duration-300     /* Default per la maggior parte degli elementi */
transition-colors               /* Solo per cambiamenti di colore */
transition-transform duration-500  /* Per scale/rotate effects */
```

### Hover Effects

#### Card Hover

```html
<div class="
  hover:scale-105 
  hover:shadow-2xl hover:shadow-blue-500/10 
  transition-all duration-500
">
```

#### Button Active

```html
<button class="active:scale-95 transition-all">
```

#### Icon Rotation

```html
```html
<ChevronRight class="
  transition-transform duration-300 
  group-hover:rotate-90
" />
```

#### 3D Active Shadow (Topic List & Accordion)

```html
<div class="shadow-lg shadow-black/40">
```

#### Liquid Glass 3D Effect (Selected Topic)

```html
<div class="
  bg-gradient-to-b from-blue-500/30 to-blue-600/5 
  border border-white/5 
  shadow-[0_0_15px_rgba(59,130,246,0.3)_inset] shadow-blue-500/20
">
```

#### Click Rotation (Shuffle)

```html
<Shuffle class="group-active:rotate-180 transition-transform duration-500" />
```

### Animazioni Custom

#### Float Animation (Hero)

```html
<h1 class="animate-float">MASTER YOUR STACK</h1>
```

```css
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
```

#### Spin Slow (Background watermark)

```html
<Hexagon class="animate-spin-slow" />
```

```css
animation: spin 60s linear infinite
```

### Slide In / Fade In

- **Modal entrance**: `animate-in fade-in duration-200` (overlay), `zoom-in-95 duration-300` (content)
- **Panel slide**: `animate-in slide-in-from-left duration-200`
- **Content fade**: `animate-in fade-in slide-in-from-top-2`

---

## 🎭 Tone of Voice

### Personalità dell'UI

DevHub comunica con uno stile **professionale ma incoraggiante**:

- **Tecnico ma Accessibile**: Usa termini tecnici quando necessario, ma con chiarezza
- **Motivante**: Feedback positivi e costruttivi ("Risultato perfetto!", "Ottimo tentativo!")
- **Chiaro e Diretto**: Istruzioni precise senza ambiguità
- **Friendly**: Emoji utilizzate con parsimonia (💡, ✅, ⚠️) solo in contesti appropriati

### Messaggi di Feedback

#### ✅ Successo

- "Risultato perfetto!"
- "Query eseguita con successo"
- "Ottimo lavoro!"

#### ⚠️ Warning

- "Attenzione: risultato parzialmente corretto"
- "Hai selezionato più colonne del necessario"

#### ❌ Errore

- "Il risultato non coincide"
- "Query vuota. Scrivi una query SQL prima di eseguire"
- "Errore: [descrizione tecnica chiara]"

#### 💡 Suggerimenti

- "Prova a utilizzare..."
- "Ricorda che..."
- "Suggerimento: [hint specifico]"

### Placeholder Text

- Input: "Cerca argomento...", "Scrivi la tua query SQL qui..."
- Empty states: "Nessun dato disponibile", "Esegui una query per ricevere feedback AI"

### Labels & Headers

- Usa **UPPERCASE** per labels piccoli: `SUGGERIMENTO`, `SOLUZIONE`, `AI COACH`
- **Title Case** per titoli: "SQL Lab", "DataLab", "Mostra Schema DB"

---

## 📌 Note Implementative

### Scrollbar Custom

Usa sempre la classe `custom-scrollbar` per aree scrollabili:

```css
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #0b1120; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
```

### Dark Mode

L'app è **SEMPRE in dark mode**. Non prevedere varianti light.

### Icons

- Usa **lucide-react** per tutte le icone
- Dimensioni standard: 14px (small), 16-18px (medium), 24-28px (large)
- StrokeWidth: 1.5 (default), 2.5 (bold per highlights)

### Backdrop Blur

Per dare profondità agli elementi:

```html
<div class="backdrop-blur-md">
```

### Stealth Glass (Pure Black Minimal Style)

Il design si basa su **nero assoluto** e vetro scurissimo quasi invisibile. **NESSUN BORDO, NESSUNA OMBRA.**

Combina:

- `bg-[#121212]/60` (vetro molto scuro, semitrasparente)
- `backdrop-blur-xl` (blur per separazione)
- `border-none` (zero bordi visibili)
- Nessuna ombra, nessun ring

**Pattern:**

- Sfondo App: `bg-black` (Nero Puro, nessun gradiente)
- Card/Pannelli: `bg-[#121212]/60 backdrop-blur-xl rounded-3xl`
- Editor: `bg-black/20 ring-1 ring-black/20 inset rounded-xl` (Incassato)
- Modali: `bg-[#121212]/60 backdrop-blur-xl max-w-5xl my-8`
- Spacing: `gap-4` o `gap-5` (ridotto)

### Responsive

- Usa `md:` breakpoint per layout desktop (es: `text-7xl md:text-8xl`)

- Grid responsive: `grid-cols-1 md:grid-cols-2`

---

## 🚀 Quick Reference

### Colori Veloci

```text
Primary Blue:   bg-blue-600 / text-blue-400
Emerald:        bg-emerald-600 / text-emerald-400
Purple:         bg-purple-600 / text-purple-400
Main BG:        bg-slate-950 (#020617)
Glass Surface:  bg-slate-900/70 backdrop-blur-md
Glass Border:   border-white/10
```

### Spacing Veloce

```text
Padding:  p-4 (card) | p-6 (section) | p-8 (feature card)
Gap:      gap-2 (tight) | gap-4 (standard) | gap-6 (loose)
Margin:   mb-2 (title) | mb-4 (section) | space-y-4 (stack)
```

### Border Radius Veloce

```text
rounded     = 4px   (input, small)
rounded-lg  = 8px   (card, button)
rounded-xl  = 12px  (modal)
rounded-3xl = 24px  (feature card)
```

---

**Ultima Revisione**: Novembre 2024  
**Versione**: 1.0  
**Autore**: AI Assistant @ DevHub Team

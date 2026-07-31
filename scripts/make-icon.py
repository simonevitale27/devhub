#!/usr/bin/env python3
"""Genera le icone di DevHub Web (favicon, PWA, apple-touch).

Stesso logo dell'app desktop: il prompt di un terminale `>` seguito da una
barra di avanzamento a tre segmenti, di cui l'ultimo spento. Scrivi codice, e
gli esercizi si completano.

Due varianti, perche' il manifest dichiara le icone `maskable`:

- squircle: la forma completa, per la favicon e il logo dentro l'app;
- square:   stesso disegno su fondo quadrato pieno. Android e iOS ritagliano
            l'icona con la loro maschera, quindi il fondo deve arrivare fino
            al bordo e il glyph stare al centro (qui occupa il 60%, dentro la
            safe zone dell'80% richiesta da `maskable`).

Uso:  python3 scripts/make-icon.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

SIZE = 1024
SS = 4  # supersampling: disegno a 4096 e riduco, cosi' i bordi sono puliti
S = SIZE * SS

BODY_HALF = 412  # 824x824 dentro 1024: la griglia delle icone macOS
SQUIRCLE_N = 5.0  # esponente della superellisse (l'angolo "continuo" di Apple)

GRAD_TOP = (30, 47, 99)  # blu notte, angolo alto-sinistra
GRAD_BOTTOM = (7, 11, 24)  # quasi nero, angolo basso-destra
GLOW_BLUE = ((360, 330), 300, 0.46, (59, 130, 246))  # centro, sigma, peso, colore
GLOW_VIOLET = ((770, 790), 330, 0.36, (124, 58, 237))

CHEVRON = (255, 255, 255)
SEG_LEFT = (56, 189, 248)  # sky-400
SEG_RIGHT = (129, 140, 248)  # indigo-400

STROKE = 56
CHEVRON_PATH = ((340, 404), (452, 512), (340, 620))
SEG_Y, SEG_H = 620, 44
SEGMENTS = ((512, 620), (640, 748), (768, 876))
GLYPH_SCALE = 1.08

ROOT = Path(__file__).resolve().parent.parent
ASSETS = {
    "public/favicon.png": (32, "squircle"),
    "public/devhub-logo.png": (192, "squircle"),
    "public/logo192.png": (192, "square"),  # apple-touch-icon + manifest maskable
    "public/logo512.png": (512, "square"),  # manifest maskable
}


def superellipse(half: float) -> np.ndarray:
    """Maschera booleana della superellisse centrata, in coordinate 1024."""
    axis = (np.arange(S) + 0.5) / SS - 512.0
    x = axis[None, :]
    y = axis[:, None]
    d = np.abs(x / half) ** SQUIRCLE_N + np.abs(y / half) ** SQUIRCLE_N
    return d <= 1.0


def background(squircle: bool) -> Image.Image:
    axis = (np.arange(S) + 0.5) / SS
    x = axis[None, :]
    y = axis[:, None]

    t = np.clip((x + y - 200.0) / (BODY_HALF * 4.0), 0.0, 1.0)[..., None]
    rgb = np.array(GRAD_TOP, float) * (1 - t) + np.array(GRAD_BOTTOM, float) * t

    for (cx, cy), sigma, weight, color in (GLOW_BLUE, GLOW_VIOLET):
        g = np.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * sigma**2)) * weight
        rgb += (np.array(color, float) - rgb) * g[..., None]

    out = np.zeros((S, S, 4), np.uint8)
    if squircle:
        body = superellipse(BODY_HALF)
        # Bordo interno chiaro sul lato alto: il riflesso che da' spessore al vetro.
        edge = body & ~superellipse(BODY_HALF - 3.5)
        falloff = np.clip((512.0 - y) / 420.0, 0.0, 1.0)
        rgb += (255.0 - rgb) * np.where(edge, falloff * 0.30, 0.0)[..., None]
        out[..., 3] = np.where(body, 255, 0)
    else:
        out[..., 3] = 255

    out[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def glyph() -> Image.Image:
    """`>` piu' barra di avanzamento, ricentrata nel canvas."""
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    def px(v: float) -> float:
        return (512.0 + (v - 512.0) * GLYPH_SCALE) * SS

    w = STROKE * GLYPH_SCALE * SS
    chevron = [(px(x), px(y)) for x, y in CHEVRON_PATH]
    d.line(chevron, fill=CHEVRON, width=int(round(w)), joint="curve")
    for cx, cy in chevron:  # PIL non fa i cap tondi: li aggiungo a mano
        d.ellipse([cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2], fill=CHEVRON)

    # I segmenti vanno su una maschera a parte per poterli sfumare in orizzontale.
    mask = Image.new("L", (S, S), 0)
    md = ImageDraw.Draw(mask)
    for i, (x0, x1) in enumerate(SEGMENTS):
        md.rounded_rectangle(
            [px(x0), px(SEG_Y - SEG_H / 2), px(x1), px(SEG_Y + SEG_H / 2)],
            radius=SEG_H * GLYPH_SCALE * SS / 2,
            fill=255 if i < 2 else 70,  # il terzo e' spento: gli esercizi che restano
        )

    axis = (np.arange(S) + 0.5) / S
    ramp = np.clip((axis - 0.50) / 0.34, 0.0, 1.0)[None, :, None]
    rgb = np.array(SEG_LEFT, float) * (1 - ramp) + np.array(SEG_RIGHT, float) * ramp
    bar = np.zeros((S, S, 4), np.uint8)
    bar[..., :3] = np.clip(np.broadcast_to(rgb, (S, S, 3)), 0, 255).astype(np.uint8)
    bar[..., 3] = np.asarray(mask)
    layer.alpha_composite(Image.fromarray(bar, "RGBA"))

    box = layer.getbbox()
    dx = round(S / 2 - (box[0] + box[2]) / 2)
    dy = round(S / 2 - (box[1] + box[3]) / 2)
    centered = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    centered.paste(layer, (dx, dy))
    return centered


def main() -> None:
    art = glyph()
    variants = {}
    for kind in ("squircle", "square"):
        canvas = background(kind == "squircle")
        canvas.alpha_composite(art)
        if kind == "squircle":  # ritaglio il margine: la favicon usa tutti i pixel
            edge = (512 - BODY_HALF) * SS
            canvas = canvas.crop((edge, edge, S - edge, S - edge))
        variants[kind] = canvas

    for rel, (size, kind) in ASSETS.items():
        path = ROOT / rel
        variants[kind].resize((size, size), Image.LANCZOS).save(path)
        print(f"scritto {path} ({size}x{size}, {kind})")


if __name__ == "__main__":
    main()

# Gabriel Aires — Portfolio

A static rebuild (HTML + CSS, no build step) of the Framer site for Gabriel Aires.

## Run it

Just open `index.html` in a browser. Or serve it locally:

```bash
# any one of these
python3 -m http.server 8000      # then visit http://localhost:8000
npx serve .
```

## Structure

```
my-project-2/
├── index.html    # all markup (Top bar, Intro, Work, Services, About, Contact)
├── styles.css    # design tokens, type styles, layout, responsive rules
└── README.md
```

## Design system (mirrored from Framer)

**Colors**

| Token | Value |
|-------|-------|
| Background | `#0A0A0A` |
| Surface | `#141414` |
| Text | `#F2F0ED` |
| Muted | `#8A8A85` |
| Line | `rgba(255,255,255,0.1)` |
| Accent | `#FF2D16` |

**Type** — Inter (400 / 500 / 600), loaded from Google Fonts. Framer's text styles
(Display, Section Title, Eyebrow, Body, Label) are reproduced as CSS classes.

## Responsiveness

Mirrors the Framer breakpoints (Desktop / Tablet / Phone), with a few things done
*better* in code than Framer's per-breakpoint overrides allowed:

- **Fluid typography** — headings use `clamp()`, so the 76px Display and 40px Section
  Title scale smoothly down to phone sizes instead of needing fixed per-breakpoint values.
- **Work grid** — `repeat(auto-fill, minmax(360px, 1fr))` resolves to **2 columns** on
  desktop/tablet and **1 column** on phone (the same fix applied in the Framer file).
- **About & Services** — flexbox `wrap` + `min-width`, so the portrait/bio stack and the
  service descriptions drop below their labels on narrow screens.
- **Phone nav** — the center nav (Work / Services / About) is hidden under 700px, leaving
  the logo + "Get in touch" (the chosen mobile behavior).

## Notes / assumptions

- **Images** are hot-linked from Framer's CDN (`framerusercontent.com`). To make the site
  fully self-contained, download them into an `images/` folder and update the `src`s.
- **Muted text colors** — Framer's exported text styles didn't include color values, so
  eyebrows, body paragraphs, and the footer use the `Muted` token (the evident intent on a
  dark theme). Headings/labels use `Text`.
- **Service row dividers** use the `Line` token (a thin top border on each row).
- **Contact email** is still `hello@victorberriel.com` — it was left unchanged in Framer
  (the name was renamed but the email domain wasn't decided). Update it in `index.html`.

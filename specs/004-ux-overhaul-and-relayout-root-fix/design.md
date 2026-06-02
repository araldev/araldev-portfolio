# Design: 004 — UX Overhaul & Relayout Root-Fix

**Change**: `004-ux-overhaul-and-relayout-root-fix` · Strict TDD · artifact store: `both` (Engram + `specs/004-.../`) · Review budget: 800 lines

---

## §0 Pre-flight Checks

| Check | Status | Source / Note |
|---|---|---|
| Constitución leída | ✓ | `.specify/memory/constitution.md` v1.0.0 |
| Propuesta leída (Engram id 41 + filesystem) | ✓ | `specs/004-.../proposal.md` 92 líneas |
| Spec leída (sdd-spec publicado) | ✓ | `specs/004-.../spec.md` v0.1.0 (293 líneas, 4 capabilities NEW) |
| `frontend-design`, `vercel-react-best-practices`, `web-design-guidelines`, `shadcn`, `impeccable`, `emil-design-eng`, `cognitive-doc-design` | ✓ | All 7 SKILL.md files loaded per orchestrator instruction |
| 002 design (tone bar) | ✓ | `specs/002-job-card-component/design.md` 982 líneas |
| Source code inspeccionado (sin tocar) | ✓ | `ProjectsCards`, `JobCard`, `AboutMeSection`, `useFadeInJobCards`, `useFlipJobs`, `JobsCards`, `index.css` |
| **Source code NO modificado** | ✓ | Agente solo escribe markdown |
| **Sin nuevas runtime deps** | ✓ | 2 nuevas devDeps: `@playwright/test` (N4) + `@axe-core/playwright` (FR-N4-06) |
| `bundle-barrel-imports` / `bundle-analyzable-paths` respetados | ✓ | No barrel files; rutas estáticas |
| `rerender-defer-reads` aplicado a `useFadeInJobCards` | ✓ | Hook existente encapsula `prefersReducedMotion` |
| `rendering-animate-svg-wrapper` aplicado al mask N1 | ✓ | Mask en `::before` wrapper `<div>`, no en `<svg>` |

---

## §1 Concept & Vision — "Refractive Lens"

### 1.1 La metáfora visual

> *Cada ProjectCard es una **lente refractiva**: una superficie de cristal oscuro con esquinas suavemente curvadas (border-radius) que recibe la luz del título gradiente y la desvía hacia el cuerpo. Un único corte diagonal SVG `mask-image` en la esquina superior izquierda representa la luz "entrando" en el cristal: un solo punto de refracción, deliberado, no decorativo. La luz que pasa por la lente se descompone en el gradient animado `radialZoom` (cyan→deep blue→soft teal) que ocupa el cuerpo, y vuelve a salir por la base donde vive el CTA "Ver detalles".*

**Funciones que cumple**:
1. **Honra el "glass" del v2** sin replicar el "holo" del 002 (lente de refracción ≠ bitácora holográfica de carrera).
2. **Mata los `clip-path` absolutos** del 003 (`border-radius` se adapta al fluido del grid).
3. **100% responsive** — un polígono SVG con coords `M 0 40 L 20 42 ... 573 64` nunca puede serlo.
4. **Testeable visualmente** — los 3 snapshots (1440/768/375) deben coincidir píxel-perfecto.

### 1.2 Principios visuales derivados

| # | Principio | Aplicación |
|---|---|---|
| 1 | **Refracción, no decoración** | 1 corte SVG `mask-image` por card (18×18px, top-left). Cero `clip-path` absolutos. |
| 2 | **Lenguaje de esquinas** | `border-radius: var(--border-radius)` (12px), consistente con JobCard. Sin 24/32/40 (impeccable ban). |
| 3 | **Glass con respeto** | Glass SOLO donde aporta jerarquía (imagen + icon row). Cuerpo: `--color-bg-web` sólido + gradient animado. |
| 4 | **Display title 1 sola vez** | h3 `title` con `background-clip: text`; resto del texto blanco 78%. |
| 5 | **60fps o nada** | Solo `transform` + `opacity` en CSS transitions (vercel + emil). |

---

## §2 Design Language

### 2.1 Color & Type (REUSE v2 tokens, **ZERO new color tokens**)

| Token (REUSED) | Valor | Aplicación |
|---|---|---|
| `--color-bg-web` | `#111117` | Surface de las 3 cards |
| `--color-text-gradient` | `linear-gradient(90deg, #00C9FF, #92FE9D)` | Display h3 N1 + mask cut bg + JobCard h4 |
| `--color-background-gradient` | `linear-gradient(180deg, #e0f7f4, #1a2a6c, #a3e9ff)` | Cuerpo N1 (`radialZoom` 5s loop) |
| `--color-bg-button-gradient` | `linear-gradient(135deg, #004e92, #000428)` | Bento text tile (N3) |
| `--color-text-button-gradient` | `linear-gradient(90deg, #92FE9D 20%, #00C9FF 50%)` | CTA "Ver detalles" N1 |
| `--border-color` | `#7d9cb8` | Border 0.5px (N1), 3px Bento (N3) |
| `--border-radius` | `12px` | Esquina única N1+N2+N3 |
| `--font-size-title/subtitle/paragraph` | `clamp(...)` | Tipografía |
| `--paragraph-max-width` | `60ch` | Legibilidad (impeccable: 65-75ch) |
| `--shadow-bg-obj1/obj2` | cyan/blue glow | Default + hover (N1, N2) |

### 2.2 Spacing & Layout tokens (4 nuevos, todos micro-infraestructura)

| Token | Valor | Propósito | Cap |
|---|---|---|---|
| `--project-card-min-height` | `520px` | Mata relayout por imagen async (cumple FR-N1-05) | N1 |
| `--project-image-aspect` | `4/3` | `aspect-ratio` de `.project_image_container` | N1 |
| `--job-card-min-height` | `440px` (override spec FR-N2-03 `280px`; ver OQ-N2-01) | Mata relayout del primer paint | N2 |
| `--bento-row-height` | `clamp(110px, 14vh, 180px)` | Track height Bento | N3 |

### 2.3 Type, Shadow, shadcn note (compact)

- **Type**: Roboto única (sin nuevas families). Diferenciación: h3 gradient (Projects) · h3+h4 dual gradient (Jobs) · body 78% white (AboutMe). `text-wrap: balance` en h1-h3, `text-wrap: pretty` en long prose. Letter-spacing mínimo -0.005em (NO inferior a -0.04em; tell "AI cramped display").
- **Shadow**: REUSED. N1 hover intensifica `--shadow-bg-obj1`; N3 featured border usa `--shadow-bg-obj2` (mismo patrón que 002).
- **shadcn/Tailwind**: NO aplican (repo es CSS Modules + CSS vars). Se aplica solo el patrón `data-*` attributes para variantes desde CSS sin condicionales JSX.

---

## §3 Responsive Strategy

| Breakpoint | Rango | Cambios clave 004 |
|---|---|---|
| **Mobile** | 0–519px | 1 col; padding `1rem`; Bento 1 col; icons 30px |
| **Tablet** | 520–1023px | 1–2 cols (`minmax(300px, 1fr)`); Bento 2 cols / 4 rows |
| **Desktop** | 1024–1440px | 2–3 cols (`minmax(350px, 1fr)`); Bento 3 cols / 6 rows; central timeline rail ≥1200px + ≥3 cards |
| **Desktop XL** | 1440px+ | 3 cols (`minmax(360px, 1fr)`); gap 36px |

Bento (N3) usa su propio set (grid 2D, ver §N3).

---

## §4 Accessibility Strategy (WCAG 2.1 AA)

- **Semántica/ARIA**: `<article aria-labelledby="project-{id}-title">` (FR-N1-07), `aria-labelledby="job-{id}-company"` (002), `<aside aria-label="About me">` (N3). `<a target="_blank" rel="noopener noreferrer">` con `aria-label` descriptivo (NO "Click here"). Mask-image `aria-hidden="true"` por construcción.
- **Keyboard**: `Tab` ignora card root, entra a `<a>`/`<button>` internos. `:focus-visible { outline: 2px solid #92FE9D; outline-offset: 3px; }`. `Esc` colapsa JobCard expandido (existente).
- **Contraste** (sin cambios desde 002, sin nuevos pares): #fff/#111117 = 15.9:1 AAA · rgba(255,255,255,0.78)/#111117 = 12.4:1 AAA · #92FE9D focus ring = 12.6:1 AAA.
- **prefers-reduced-motion**: `radialZoom` → none · entrance → 200ms opacity only · hover scale → disabled · FLIP → no-op · mask transition → instant.

---

## §5 Motion Philosophy (emil-design-eng §3)

| Nombre | Trigger | Curve | Duración | Propósito | Reduced-motion |
|---|---|---|---|---|---|
| `card-entrance` | ScrollTrigger | `power3.out` | 0.9s | Cards emergen en orden | 200ms opacity only |
| `card-stagger` | (mismo) | — | 0.12s offset | Lectura cronológica | sin offset |
| `card-hover-glow` | `:hover` (fine) | `cubic-bezier(0.23, 1, 0.32, 1)` | 250ms | "Se enciende al tocar" | instant |
| `logo-hover-scale` | delegated | `ease-out` | 250ms | Logo se acerca | disabled |
| `radialZoom` (N1) | infinite alternate | `ease-in-out` | 5s cycle | Luz refractándose | `animation: none` |
| `bento-tile-entrance` | ScrollTrigger | `power3.out` | 0.7s | Tiles aparecen | 200ms opacity |
| `filter-reorder` (N2) | sort identity change | `power2.inOut` (FLIP) | 300ms | Repositioning | instant |
| `mask-reveal-on-load` | mount N1 | `ease-out` | 400ms | Corte de luz aparece | instant |
| `button-press-scale` | `:active` | `ease-out` | 100ms | Feedback de presión (emil §Buttons) | instant |
| `aspect-ratio-settle` (N2) | post `img.decode()` | `ease-out` | 200ms | Altura se asienta | instant |

**Easing principle**: Nunca `ease-in` para UI. Solo `transform` y `opacity` en CSS transitions.

---

## §6 Performance Budget (Const. II)

| Métrica | Objetivo | Defensa |
|---|---|---|
| FCP | < 1.5s (4G) | Preload fonts + lazy images |
| LCP | < 2.5s | `min-height` reserves → CLS = 0 |
| TTI | < 3.0s | N1-N3 son refactors, 0 bundle added |
| CLS | 0 (objetivo) | `min-height` + `aspect-ratio` en N1, N2, N3 |
| 60fps scroll | ≥50fps low-end | `transform` + `opacity` only |
| Bundle incremental | ≤2KB gz | N1-N3 CSS Modules (CSS no cuenta); JS nuevo: 0 bytes |
| N4 footprint | 0KB prod | devDep, no se bundle en `pnpm run build` |

---

## §7 Test Infrastructure (N4)

### 7.1 Why Playwright (Constitution IV + spec §N4)

jsdom **no reproduce layout real**: no `clip-path` deform, no CLS por imagen async, no `aspect-ratio`. 003 shippeó con jsdom + jest-axe pasando y UI rota. @playwright/test + @axe-core/playwright corren Chromium real → reproducen el bug que jsdom no ve.

### 7.2 Stack

```json
// package.json (N4 — additions, devDeps only)
{
  "devDependencies": {
    "@playwright/test":     "^1.50.0",
    "@axe-core/playwright": "^4.10.0"   // FR-N4-06
  },
  "scripts": {
    "test:visual":        "playwright test --config=tests/visual/playwright.config.js",
    "test:visual:update": "playwright test --config=tests/visual/playwright.config.js --update"
  }
}
```

```javascript
// vitest.config.js (FR-N4-08: exclude tests/visual/ from default run)
test: { exclude: ['**/node_modules/**', 'tests/visual/**'] }
```

### 7.3 Directory + config (N4)

```
tests/visual/
├── README.md            (run + update instructions)
├── playwright.config.js (3 viewports, webServer, axe-ready)
├── .gitignore           (test-results/, playwright-report/)
├── projects-cards.spec.js     (N1 snapshot)
├── jobs-cards.spec.js         (N2 snapshot + height-delta)
├── about-me-bento.spec.js     (N3 snapshot + boundingBox)
└── axe-fixture.js             (axe-core helper)
```

```javascript
// tests/visual/playwright.config.js
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './', testMatch: /.*\.spec\.js$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:5173/araldev-portfolio/',
    trace: 'retain-on-failure', screenshot: 'only-on-failure',
    actionTimeout: 5_000, navigationTimeout: 10_000
  },
  projects: [
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome HiDPI'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet-768',   use: { ...devices['Desktop Chrome HiDPI'], viewport: { width: 768,  height: 1024 } } },
    { name: 'mobile-375',   use: { ...devices['Desktop Chrome HiDPI'], viewport: { width: 375,  height: 812 } } }
  ],
  webServer: {
    command: 'pnpm dev', url: 'http://localhost:5173/araldev-portfolio/',
    reuseExistingServer: !process.env.CI, timeout: 60_000, stdout: 'ignore', stderr: 'pipe'
  }
})
```

### 7.4 Baseline + flake + browser (compact)

- Baselines **commited** en `tests/visual/**-snapshots/`. Update: `pnpm test:visual:update`.
- Flake: `retries: 2` en CI, `actionTimeout: 5s`, `waitForLoadState('networkidle')` antes de mediciones.
- Browser: **chromium only en 004** (1 persona, 80% market); webkit/firefox = follow-up.
- Boot: `pnpm exec playwright install chromium --with-deps` (one-time, documentado en README).
- `tests/visual/README.md` documenta: cómo correr, cómo actualizar baselines, pre-commit hook, out-of-scope.

---

## §N1 — Capability: `projects-cards-v3`

### §N1.1 Anatomy (ASCII del v3)

```
┌─────────────────────────────────────────────────────┐
│ ┌──╮ ╔══════════════════════════════════════════╗  │  ← 1 mask-image cut
│ │  │ ║  ┌────────────────────────────────────┐  ║  │     (18×18px top-left)
│ └──╯ ║  │  [project image, aspect-ratio 4/3]│  ║  │
│      ║  └────────────────────────────────────┘  ║  │  ← NO clip-path
│      ║  ╭─────────── v12-ui ───────────╮         ║  │  ← h3 gradient
│      ║  short description              ║         ║  │
│      ║  ── divider ──                  ║         ║  │
│      ║  Description 1 (line-clamp 3)   ║         ║  │  ← radialZoom
│      ║  Description 2                  ║         ║  │     (gradient animado)
│      ║  Description 3                  ║         ║  │
│      ║  [⚛️] [📘] [🟨] [🐙] [🎨]         ║         ║  │  ← stack icons 40px
│      ║  [Live Demo] [npm] [Story] [Code]║         ║  │  ← action_links_row
│      ║  [       Ver detalles        ]   ║         ║  │  ← CTA gradient
│      ╚══════════════════════════════════════════╝  │
│   border-radius: 12px · border: 0.5px · min-height: 520px
└─────────────────────────────────────────────────────┘
```

### §N1.2 File changes (compact)

| Archivo | Acción | Razón |
|---|---|---|
| `src/components/ProjectsCards/ProjectsCards.jsx` | Delete + Recreate | Typo `projec_text_container` desaparece; export preservado (FR-N1-08) |
| `src/components/ProjectsCards/ProjectsCards.module.css` | Delete + Recreate | 0 `clip-path`. 1 `mask-image`. 2 nuevos tokens. |
| `src/components/ProjectModal/ProjectModal.jsx` | UNCHANGED | Firma preservada |
| `src/Hooks/useSortProjects.js`, `useIsIconCheckFilter.js` | UNCHANGED | Consumidos, no mutados |
| `src/index.css` | Modify (2 new tokens) | `--project-card-min-height`, `--project-image-aspect` |

### §N1.3 Data contract (preserved verbatim, FR-N1-01)

```javascript
/**
 * @typedef {Object} ProjectCardProps
 * @property {Object} project
 * @property {string} project.id, title, imgSrc, shortDescription
 * @property {string[]} project.description
 * @property {Object<string, ReactNode>} project.tech          // e.g. { react, ts, tailwind, gsap }
 * @property {string} [project.demoLink, npmLink, storybookLink, codeLink]
 * @property {(project: Object) => void} onShowMore
 */
```

Firma preservada: `ProjectsCards()` + `ProjectCard({ project, onShowMore })` interno.

### §N1.4 NEW CSS (N1 — Q1 default: `border-radius` + 1 SVG `mask-image`)

```css
/* ProjectsCards.module.css — v3 (N1) */

.projects_cards_container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(425px, 575px));
  align-items: stretch;                                  /* was 'center' (N1 fix) */
  gap: 50px;
}

.project_card {
  width: 100%;
  min-height: var(--project-card-min-height);            /* 520px (FR-N1-05 defense) */
  display: flex; flex-direction: column;
  border-radius: var(--border-radius);                   /* 12px, único */
  border: 0.5px solid var(--border-color);
  background-color: var(--color-bg-web);
  box-shadow: var(--shadow-bg-obj1);
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  /* ── THE ONE MASK-IMAGE (decorative refraction, top-left) ── */
  &::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 18px; height: 18px;
    background: var(--color-text-gradient);
    -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'><path d='M0 0 L18 0 L0 18 Z'/></svg>");
            mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'><path d='M0 0 L18 0 L0 18 Z'/></svg>");
    -webkit-mask-size: contain; mask-size: contain;
    -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
    pointer-events: none; z-index: 2; opacity: 0.7;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: 0 0 0 1px rgba(0, 201, 255, 0.5), 0 0 35px -5px rgba(0, 201, 255, 0.55);
      transform: translateY(-2px);
    }
  }
}

.project_image_container {
  width: 100%;
  aspect-ratio: var(--project-image-aspect);             /* 4/3, kills async-img CLS */
  min-height: 200px;                                     /* belt + suspenders */
  overflow: hidden; border-radius: var(--border-radius);
  > img { width: 100%; height: 100%; object-fit: cover; object-position: center; }  /* was 0 -85px */
}

.project_text_container {                                /* typo FIXED */
  flex: 1; display: flex; flex-direction: column; gap: 15px;
  padding: 40px 32px;                                     /* was 50px */
  background: var(--color-background-gradient);
  background-size: 300% 300%;
  animation: radialZoom 5s ease-in-out infinite alternate;
  h3 {
    font-size: var(--font-size-subtitle);
    background: var(--color-text-gradient); background-clip: text;
    color: transparent; -webkit-text-fill-color: transparent;
    text-align: center; margin-bottom: 4px; text-wrap: balance;
  }
  .description_list p {
    font-size: var(--font-size-paragraph); line-height: 1.6;
    color: rgba(255, 255, 255, 0.78); max-width: 52ch;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    + p { margin-top: 0.75lh; }
  }
}
@keyframes radialZoom { 0% { background-size: 200% 200%; } 100% { background-size: 400% 400%; } }
@media (prefers-reduced-motion: reduce) { .project_text_container { animation: none; } }
@media (max-width: 519px) {
  .projects_cards_container { grid-template-columns: 1fr; }   /* was 350px */
  .project_text_container { padding: 28px 20px; }
}
```

### §N1.5 States

| State | Mecanismo |
|---|---|
| Default | `box-shadow: var(--shadow-bg-obj1)`, border 0.5px, gradient animado, mask cut visible |
| Pre-reveal (mount) | `opacity: 0.4` (sets pre-`useFadeInElement`); cleared on fade-in |
| Hover (fine) | `box-shadow` intensify, `transform: translateY(-2px)`, 0.25s |
| Active (coarse) | `transform: scale(0.99)` (emil §Buttons must feel responsive) |
| Focus-visible | `outline: 2px solid #92FE9D; outline-offset: 3px;` sobre `<a>`/`<button>` internos |
| Loading | N/A (data estática); defensa via `--project-card-min-height` |
| Disabled | N/A |
| prefers-reduced-motion | `animation: none`; entrance 200ms opacity only |

### §N1.6 Tests (TDD: RED → GREEN)

| Layer | Test | Approach |
|---|---|---|
| Visual N4 | snapshot full grid @ 1440/768/375 | `toHaveScreenshot('projects-{viewport}.png', { maxDiffPixelRatio: 0.01 })` |
| Visual N4 | snapshot 1 individual card @ 1440 | `page.locator('.project_card').first()` |
| Integration | mock `<img>` 404 + reload → height delta ≤ 1px | `getBoundingClientRect().height` |
| Integration | 1440 width → 3 cards en row | computed style assertion |
| Unit | NO `clip-path` absoluto | `getComputedStyle(card).clipPath === 'none'` |
| Unit | 1 `mask-image` en `::before` | `getComputedStyle(card, '::before').maskImage` ≠ 'none' |
| Unit | Typo fixed: NO `projec_` | grep en `ProjectsCards.module.css` |
| A11y | jest-axe 0 violations, `aria-labelledby` único (FR-N1-07) | existing pattern, migrate test |

---

## §N2 — Capability: `jobs-section-relayout-root-fix`

### §N2.1 Root cause

`JobCard` images (logos, tech icons) load **async AFTER first paint** → `useFadeInJobCards` mide y dispara ScrollTrigger antes de que los pixels se asienten → `Flip` captura posición incorrecta → cards se reposicionan visiblemente (CLS > 0, scroll jank).

### §N2.2 The 5 fix layers (FR-N2-01..05)

| # | Layer | Where | Purpose | Spec |
|---|---|---|---|---|
| 1 | `window.load` gate | `useFadeInJobCards.js` | Wait for ALL page images before measuring | FR-N2-01 |
| 2 | `img.decode()` per image | `useFadeInJobCards.js` | Force browser to finish decoding all `<img>` in grid | FR-N2-02 |
| 3 | 5s `withTimeout` fallback | both hooks | If image hangs (broken CDN), proceed after 5s | FR-N2-01, FR-N2-08, EC-N2-03 |
| 4 | `min-height: var(--job-card-min-height)` on `.job_card` | `JobCard.module.css` | Visual reserve prevents visible jump | FR-N2-03 |
| 5 | `aspect-ratio: 1` on logo + tech icons | `JobCard.module.css` | Square reservation, image fills predictably | FR-N2-04, FR-N2-05 |

**`useFlipJobs` también espera** (mismo patrón) — necesario porque Flip captura position pre-load y se reordena visiblemente.

### §N2.3 Hook patch (N2 — annotated diff)

```javascript
// src/Hooks/useFadeInJobCards.js — v2 (N2 output)
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

// FR-N2-08: exported constant for tests + tuning
export const WINDOW_LOAD_TIMEOUT_MS = 5_000

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise(r => setTimeout(() => r('timeout'), ms))])

export function useFadeInJobCards (gridRef) {
  const tweenRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return undefined
    const cards = grid.querySelectorAll('[data-job-card]')
    if (cards.length === 0) return undefined
    if (prefersReducedMotion) {
      gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: 'transform' })
      return undefined
    }

    const setupTrigger = () => {
      // LAYER 2: decode all in-grid images (FR-N2-02, EC-N2-01 silent on 404)
      const decodes = Array.from(grid.querySelectorAll('img'))
        .map(img => img.decode().catch(() => 'decode-failed'))

      // LAYER 3: 5s timeout fallback
      withTimeout(Promise.all(decodes), WINDOW_LOAD_TIMEOUT_MS).then(() => {
        const trigger = ScrollTrigger.create({
          trigger: grid, start: 'top bottom-=50', once: true,
          onEnter: () => {
            tweenRef.current = gsap.from(cards, {
              autoAlpha: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.12
            })
          }
        })
        grid._jobCardsTrigger = trigger   // fix v1 cleanup leak
      })
    }

    // LAYER 1: window.load gate
    if (document.readyState === 'complete') setupTrigger()
    else window.addEventListener('load', setupTrigger, { once: true })

    return () => {
      window.removeEventListener('load', setupTrigger)
      if (tweenRef.current) { tweenRef.current.kill(); tweenRef.current = null }
      if (grid._jobCardsTrigger) { grid._jobCardsTrigger.kill(); grid._jobCardsTrigger = null }
      ScrollTrigger.getAll()
        .filter(t => t.vars?.trigger && grid.contains(t.vars.trigger))
        .forEach(t => t.kill())
      gsap.set(cards, { clearProps: 'all' })
    }
  }, [gridRef, prefersReducedMotion])
}
```

`useFlipJobs` recibe el mismo patrón: `await img.decode()` + `window.load` + 5s timeout antes de `Flip.getState()`.

```css
/* src/components/JobCard/JobCard.module.css — 3 NEW rules (N2) */
.job_card                { min-height: var(--job-card-min-height); }  /* LAYER 4, FR-N2-03 */
.job_card_logo_wrapper   { aspect-ratio: 1; }                          /* LAYER 5a, FR-N2-04 */
.job_card_stack .tech_icon { aspect-ratio: 1; }                        /* LAYER 5b, FR-N2-05 */
```

### §N2.4 Tests (N2 — RED→GREEN, FR-N2-07, SC-N2-01)

**Integration** (`tests/integration/JobsCards.relayout.test.jsx`):
- `it('SC-N2-01: does not measure before window.load + img.decode()')` — mock `document.readyState='loading'`, mock `img.decode()` con 500ms delay, dispatch `load` event, assert card NO midió antes de los 500ms.
- `it('EC-N2-03: falls back after 5s timeout when window.load hangs')` — `useFakeTimers`, advance 5s, assert trigger creado.
- `it('EC-N2-01: img.decode() rejection is swallowed silently')` — `console.error` spy, assert no unhandled rejection.

**Visual N4** (`tests/visual/jobs-cards.spec.js` — key assertion):
```javascript
test('SC-N2-01: no height delta between t=0 and t=after-load @ desktop-1440', async ({ page }) => {
  await page.goto('/#experience')
  const heightsT0 = await page.$$eval('[data-job-card]', cards => cards.map(c => c.getBoundingClientRect().height))
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => Promise.all(
    Array.from(document.querySelectorAll('[data-job-card] img'))
      .map(img => img.decode().catch(() => null))
  ))
  const heightsT1 = await page.$$eval('[data-job-card]', cards => cards.map(c => c.getBoundingClientRect().height))
  heightsT0.forEach((h0, i) => expect(Math.abs(heightsT1[i] - h0)).toBeLessThanOrEqual(1))   // FR-N2-07 ±1px
})

test('snapshot full grid @ 3 viewports', async ({ page }) => {
  await page.goto('/#experience')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('#experience')).toHaveScreenshot('jobs-grid.png', { maxDiffPixelRatio: 0.01 })
})

test('SC-N2-04: axe-core 0 violations @ desktop-1440', async ({ page }) => {
  await page.goto('/#experience')
  await page.waitForLoadState('networkidle')
  const results = await new AxeBuilder({ page }).include('#experience').analyze()
  expect(results.violations).toEqual([])
})
```

### §N2.5 States / Tokens

- **States**: Unchanged from 002 §4. The 5 layers are purely additive (FR-N2-06: 003 patches preserved).
- **New token**: `--job-card-min-height: 440px` (LAYER 4).

---

## §N3 — Capability: `about-me-bento-proportions`

### §N3.1 Root cause

`grid-template-rows: repeat(auto-fit, minmax(200px, 300px))` deja filas expandirse por contenido (`auto`). Tiles carecen de `height: 100%`. Avatar no tiene `aspect-ratio` → se deforma cuando la imagen no es cuadrada.

### §N3.2 The 5 fixes (FR-N3-01..06)

| # | Fix | Spec | Result |
|---|---|---|---|
| 1 | `grid-template-rows: repeat(6, var(--bento-row-height))` (desktop) | FR-N3-01 | 6 equal tracks, no `auto` expansion |
| 2 | `align-items: stretch` + `height: 100%` on `> *` | FR-N3-02 | Tiles fill grid cell regardless of content |
| 3 | `aspect-ratio: 1; max-width/height: 360px` on `.avatar_image` | FR-N3-03 | Square hero, bounded |
| 4 | `aspect-ratio: 1; width: 100px` on `.brand_image` | FR-N3-04 | Square 100×100 brand mark |
| 5 | Tablet 4 rows + mobile 2 rows, no `auto` at any bp | FR-N3-06 | Stable proportions at 3 viewports |

### §N3.3 CSS patch (N3 — key rules)

```css
/* AboutMeSection.module.css — v2 (N3) */
.about_me_container .grid_container {
  display: grid;
  grid-template-columns: repeat(3, minmax(350px, 400px));
  grid-template-rows: repeat(6, var(--bento-row-height));     /* FIX #1, FR-N3-01 */
  align-items: stretch;                                       /* FIX #2 */
  gap: 40px;

  > * { height: 100%; ... existing border/radius/box-shadow ... }   /* FIX #2, FR-N3-02 */

  .avatar_image {
    grid-row: 1 / span 3; grid-column: 1;
    aspect-ratio: 1;                                          /* FIX #3, FR-N3-03 */
    max-width: 360px; max-height: 360px;
    object-fit: cover;
  }
  .brand_image {
    grid-column: 2 / span 2; grid-row: 1 / span 2;
    aspect-ratio: 1; width: 100px;                           /* FIX #4, FR-N3-04 */
  }
  .text_container {
    grid-column: 2 / span 2; grid-row: 3 / span 4;
    padding: 50px 100px;
    > p { max-width: 60ch; text-wrap: pretty; + p { margin-top: 1lh; } }   /* FR-N3-05 */
  }
}

@media (max-width: 1450px) { /* tablet */
  .grid_container {
    grid-template-columns: repeat(2, minmax(350px, 400px));
    grid-template-rows: repeat(4, var(--bento-row-height));   /* FIX #5 */
    .avatar_image { grid-row: 1 / span 2; } .brand_image { grid-row: 1 / span 2; }
    .text_container { grid-column: 1 / span 2; grid-row: 3 / span 2; }
  }
}
@media (max-width: 1000px) { /* mobile */
  .grid_container { grid-template-columns: 1fr; grid-template-rows: repeat(2, var(--bento-row-height)); }
  .avatar_image, .brand_image { grid-row: auto; grid-column: 1; aspect-ratio: 1; }
  .text_container { grid-column: 1; grid-row: auto; padding: 50px 50px; }
}
```

### §N3.4 Visual test (N3 — `boundingBox()` + 60ch cap + axe)

```javascript
// tests/visual/about-me-bento.spec.js — compact
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768',   width: 768,  height: 1024 },
  { name: 'mobile-375',   width: 375,  height: 812 }
]
for (const vp of VIEWPORTS) {
  test(`SC-N3-01/02/03: Bento stable @ ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/#about-me')
    await page.waitForLoadState('networkidle')

    const rowCount = await page.evaluate(() =>
      getComputedStyle(document.querySelector('#about-me aside')).gridTemplateRows.split(' ').length)
    const expectedRows = vp.width >= 1024 ? 6 : vp.width >= 520 ? 4 : 2
    expect(rowCount).toBe(expectedRows)                                          // FR-N3-06

    const avatarBox = await page.locator('img[alt*="Arturo"]').boundingBox()
    expect(avatarBox.width).toBeCloseTo(avatarBox.height, 0)                      // FR-N3-03

    const brandBox = await page.locator('img[alt*="Brand"]').boundingBox()
    expect(brandBox.width).toBeCloseTo(brandBox.height, 0)                       // FR-N3-04

    const pWidth = await page.evaluate(() => getComputedStyle(document.querySelector('section#about-me p')).maxWidth)
    expect(pWidth).toBe('60ch')                                                  // FR-N3-05

    await expect(page.locator('#about-me')).toHaveScreenshot(`about-me-${vp.name}.png`, { maxDiffPixelRatio: 0.01 })
  })
  test(`axe 0 violations @ ${vp.name} (FR-N3-08)`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/#about-me')
    await page.waitForLoadState('networkidle')
    const results = await new AxeBuilder({ page }).include('#about-me').analyze()
    expect(results.violations).toEqual([])
  })
}
```

### §N3.5 States / Tokens

- **States**: Unchanged from 001. The 5 fixes are purely structural.
- **New token**: `--bento-row-height: clamp(110px, 14vh, 180px)`.

---

## §N4 — Capability: `visual-regression-tests`

### §N4.1 Summary

3 spec files, 9 snapshots (3 viewports × 3 specs), 9 axe runs, ≤ 60s total (SC-N4-04). Installation + devDeps ya documentados en §7.2.

### §N4.2 Pre-commit hook (Q2 default: opt-in + scoped)

```bash
# .husky/pre-commit (N4 — proposed; husky NOT installed yet, opt-in)
CHANGED=$(git diff --cached --name-only)
if echo "$CHANGED" | grep -qE '^src/components/ProjectsCards/|^src/components/JobsCards/|^src/components/JobCard/|^src/components/AboutMe/'; then
  echo "🧪 Visual regression scope triggered"
  pnpm test:visual || {
    echo "❌ Visual regression failed. Update baselines with: pnpm test:visual:update"
    exit 1
  }
fi
```

### §N4.3 Husky setup (N4 — opt-in, dev-only)

```bash
pnpm add -D husky
pnpm exec husky init
# Crear .husky/pre-commit con §N4.2; añadir "prepare": "husky" a package.json
```

Si orchestrator rechaza Husky: dev corre `pnpm test:visual` manualmente (sigue siendo válido per FR-N4-08 "dev-time only").

### §N4.4 Visual surface summary

| Spec | Viewports | Assertions |
|---|---|---|
| `projects-cards.spec.js` | 1440/768/375 | snapshot + axe (FR-N1-07) |
| `jobs-cards.spec.js` | 1440/768/375 | snapshot + height-delta ≤ 1px (FR-N2-07) + axe |
| `about-me-bento.spec.js` | 1440/768/375 | snapshot + boundingBox ±2px (FR-N3-07) + 60ch cap + axe |

---

## §8 Open Questions — Proposed Defaults (orchestrator ratifies)

### OQ-N1-01 (N1 organic shape) — **Proposed default: HYBRID**

**Problema**: SVG `mask-image` (flexible, permite curvas orgánicas arbitrarias) vs `border-radius: var(--border-radius)` (más simple, matches JobCard).

**Proposed default**: **`border-radius: var(--border-radius)` (12px) para la card completa + 1 SVG `mask-image` decorativo de 18×18px en la esquina superior izquierda** (corte diagonal con `viewBox` relativo — `d='M0 0 L18 0 L0 18 Z'`, no coords absolutas).

**Rationale**:
- 12px es el corner que ya usa JobCard (002) — coherencia.
- 24/32/40 son tells "AI over-rounded" (impeccable §Absolute bans).
- El mask-image único es la única excepción justificada: una decoración deliberada (la luz "entrando" en la lente), no un shape-fitter fluido. Usa `viewBox 0 0 18 18` → es proporcional, nunca se deforma.
- Sin `clip-path` absoluto en ningún lado (cumple FR-N1-05).

**Costo si se rechaza**: se cae la metáfora "Refractive Lens" (vuelve a la card genérica 003 sin identidad visual). **Recomendación: ratificar el default.**

### OQ-N2-01 (override `--job-card-min-height` from spec default) — **Proposed default: 440px**

**Problema**: spec FR-N2-03 dice `min-height: 280px`. La card actual mide ~520px en desktop (header + meta + 3 paragraphs + 5-8 stack icons). 280px causaría un *reverse* CLS (card crece al cargar contenido).

**Proposed default**: **`--job-card-min-height: 440px`** (un poco menos que la altura real medida → contenido crítico sin stack icons; stack puede crecer después del primer paint sin CLS perceptible).

**Rationale**:
- 440px = header (~120px) + meta (~50px) + 3 description paragraphs (~240px) + dividers (~30px) = 440px, todo el contenido crítico.
- Stack icons (5-8 × 40px) y badges crecen DESPUÉS del primer paint sin causar CLS perceptible.
- 280px (spec default) obligaría a un layout "jumpy" en el primer load.

**Costo si se rechaza**: N2 fix funciona pero con un pequeño reverse CLS al cargar. Aceptable pero no ideal. **Recomendación: ratificar 440px.**

### OQ-N4-01 (N4 command split + axe-core dep) — **Proposed default: SEPARATE + axe-core + husky**

**Problema**: Playwright en cada `pnpm test:run` (lento, ~60s) vs separado `pnpm test:visual` (rápido, opt-in).

**Proposed default**: **`pnpm test:visual` separado + `tests/visual/**` excluido de vitest.config.js (FR-N4-08) + `@axe-core/playwright` segunda devDep (FR-N4-06) + Husky pre-commit hook (§N4.2) que corre visual solo cuando hay cambios en `src/components/{ProjectsCards,JobsCards,JobCard,AboutMe}/`**.

**Rationale**:
- Loop de iteración rápido (vitest sigue siendo el gate por defecto; 0 overhead en dev loop normal).
- Compromiso: visual checks enforced en commit cuando el scope toca las 3 capabilities visuales; opt-in el resto.
- `@axe-core/playwright` extiende jest-axe a browser real — necesario para FR-N4-06.
- Husky es estándar de git hooks; opt-in para no forzar al dev.

**Costo si se rechaza Husky**: dev corre `pnpm test:visual` manualmente. Sigue siendo válido (FR-N4-08 se cumple). **Costo si se rechaza `@axe-core/playwright`**: FR-N4-06 no se cumple; axe sigue siendo solo jsdom; 003 a11y gap se cierra parcialmente. **Recomendación: ratificar el default completo.**

### OQ-N4-02 (N4 chromium-only vs cross-browser) — **Proposed default: chromium only**

**Problema**: cross-browser (chromium + webkit + firefox) añade ~3× tiempo de test pero cubre 95% del mercado.

**Proposed default**: **chromium only en 004**. Razones: 1 persona, dev local, 80% market share, webkit/firefox = follow-ups sin breaking change.

**Costo si se rechaza**: 3× tiempo de visual tests, valor marginal para portfolio personal. **Recomendación: ratificar.**

---

## §9 Files Inventory

| Path | Action | Cap |
|---|---|---|
| `src/components/ProjectsCards/ProjectsCards.jsx` | Delete + Recreate | N1 |
| `src/components/ProjectsCards/ProjectsCards.module.css` | Delete + Recreate | N1 |
| `src/components/JobCard/JobCard.module.css` | Modify (3 new rules) | N2 |
| `src/Hooks/useFadeInJobCards.js` | Modify (window.load + img.decode + timeout, `WINDOW_LOAD_TIMEOUT_MS` export) | N2 |
| `src/Hooks/useFlipJobs.js` | Modify (window.load + img.decode await) | N2 |
| `src/components/AboutMe/AboutMeSection.module.css` | Modify (stable grid, height:100%, aspect-ratio) | N3 |
| `src/index.css` | Modify (4 new layout tokens) | N1, N2, N3 |
| `package.json` | Modify (2 devDeps + 2 scripts + 1 `prepare` si husky) | N4 |
| `vitest.config.js` | Modify (exclude `tests/visual/**`) | N4 |
| `tests/visual/playwright.config.js` | Create | N4 |
| `tests/visual/README.md` | Create | N4 |
| `tests/visual/jobs-cards.spec.js` | Create | N4 + N2 |
| `tests/visual/projects-cards.spec.js` | Create | N4 + N1 |
| `tests/visual/about-me-bento.spec.js` | Create | N4 + N3 |
| `tests/visual/axe-fixture.js` | Create | N4 |
| `tests/visual/.gitignore` | Create | N4 |
| `tests/integration/JobsCards.relayout.test.jsx` | Create | N2 |
| `tests/integration/ProjectsCards.filter.test.jsx` | Create | N1 |
| `tests/integration/AboutMe.bento.test.jsx` | Create | N3 |
| `tests/a11y/ProjectsCards.a11y.test.jsx` | Create | N1 |
| `tests/a11y/AboutMe.a11y.test.jsx` | Create | N3 |
| `tests/unit/AboutMeSection.module.css.test.js` | Create (NEW pattern: `getComputedStyle`) | N3 |
| `tests/unit/JobCard.module.css.test.js` | Create (NEW pattern) | N2 |
| `tests/unit/ProjectsCards.test.jsx` | Create | N1 |
| `.husky/pre-commit` | Create (OQ-N4-01 default, opt-in) | N4 |

**Totals**: 11 new tests + 6 new visual/config files + 6 modified source files + 0 new runtime deps. N1 deletes 2 files (old `ProjectsCards.{jsx,css}`) and recreates them.

---

**Version**: 0.1.0 · **Created**: 2026-06-02 · **Author**: sdd-design sub-agent · **Status**: Ready for sdd-tasks

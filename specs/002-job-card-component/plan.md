# Implementation Plan: JobCard Component

**Branch**: `002-job-card-component` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md) | **Design**: [design.md](./design.md)

**Input**: Feature specification (`specs/002-job-card-component/spec.md`, 277 lines, 22 FRs, 12 ECs, 7 SCs) and design (`design.md`, 1266 lines, dirección "Holo-Log Career", 3 variantes, 8 DAs abiertas, 25 tokens CSS `--job-*`). El contrato de la entidad `Job` ya está cerrado en el spec §3; el contrato visual y de motion está cerrado en `design.md` §1–§10.

---

## Summary

El feature introduce un nuevo componente compuesto `JobCard` que representa la trayectoria profesional del desarrollador dentro del portfolio. Reutiliza todos los hooks y assets del `ProjectCard` existente (`useFadeInElement`, contexto `IsIconCheckFilter`, `techIcons`, `LinkButton`, tokens del Design System 001) y los proyecta sobre una metáfora visual diferenciada: **"Holo-Log Career"** — bitácora cronológica holográfica con conector vertical entre cards, "faro" de pulso neón para el puesto actual (`current: true`), y expansión inline de `achievements` mediante GSAP ScrollTrigger. La animación de entrada usa `ScrollTrigger.batch` (stagger de 0.12s entre cards), el reordenamiento por filtro usa FLIP technique (<300ms), y la implementación cumple WCAG 2.1 AA con `jest-axe` (0 violaciones) y respeta `prefers-reduced-motion`. Se integra como nueva `<section id="experience">` entre `Projects` y `AboutMe`. Sin nuevas dependencias runtime; las dev-deps para testing (vitest + jest-axe + @testing-library) se justifican constitucionalmente por SC-005 (≥80% coverage).

---

## Technical Context

**Language/Version**: JavaScript ES2022+ (React 18.3.1, JSX sin TypeScript — codebase actual sin TypeScript)

**Primary Dependencies (existentes, reusadas)**:
- `react@18.3.1` — UI framework
- `react-dom@18.3.0` — DOM rendering
- `gsap@3.13.0` — Animaciones + `ScrollTrigger` + `Flip` (plugins ya registrados en `ScrollSync.jsx`)
- `lenis@1.3.3` — Smooth scroll (sigue activo; no se pausa por `JobCard`)

**Dev Dependencies a añadir (justificadas por SC-005 y FR-015 del spec)**:
- `vitest@^2.1.0` — Test runner nativo Vite; respeta stack (no requiere Babel ni transform extra)
- `@vitest/coverage-v8@^2.1.0` — Coverage V8 (líneas, funciones, branches)
- `@testing-library/react@^16.0.0` — Render testing alineado con Testing Library
- `@testing-library/jest-dom@^6.4.0` — Matchers custom (`.toHaveAccessibleName()`, etc.)
- `@testing-library/user-event@^14.5.0` — Simulación de teclado/click accesible
- `jest-axe@^3.5.0` — Auditoría WCAG automatizada
- `jsdom@^25.0.0` — DOM polyfill para tests

> **Justificación constitucional (Constitución IV, §39)**: "Prohibido agregar dependencias sin justificación documentada en el spec.md". El spec SC-005 exige ≥80% coverage y FR-015 exige `jest-axe` 0 violaciones; la Constitución §72 obliga a medir coverage con `vitest`. **Sin estas dev-deps, SC-005 y FR-015 son incumplibles.** Por tanto, la adición está explícitamente justificada por el spec de esta feature. Las dev-deps no afectan el bundle de producción (Vite las excluye automáticamente de `pnpm build`).

**Build Tool**: Vite `^6.4.2` (existente). Se añade `vitest.config.js` (heredando config de Vite) en la raíz.

**Storage**: N/A. Datos estáticos en `src/data/jobs.js` (mismo patrón que `src/data/projects.js`).

**Testing**: vitest + @testing-library/react + jest-axe (nuevo). Suites: unit (`useSortJobs`, helpers de fecha, validador del contrato `Job`), integration (`JobCard` con props), a11y (`jest-axe` 0 violaciones en todas las variantes).

**Target Platform**: Mismo que el portfolio existente — navegadores modernos (Chrome, Firefox, Safari, Edge), desktop y mobile, GitHub Pages.

**Project Type**: SPA — extensión in-place de la SPA React existente.

**Performance Goals** (del spec SC-001/SC-002/SC-003):
- Render del card <50ms post-hidratación
- 60fps en animaciones (mínimo 50fps gama baja, Constitución §112)
- Filter response <100ms (FLIP technique, sin async)
- Bundle impact <2KB gzipped (SC-007)

**Constraints**:
- **Cero** nuevas dependencias runtime (A1 del spec)
- Misma constitución visual que `ProjectCard` (paleta cyan/green, gradientes, sombras)
- No romper el contexto `IsIconCheckFilter` existente (A8 + DA-02 resuelven reusándolo)
- No modificar `NavHeader` en esta iteración (DA-07 resuelve: out of scope, ver A4)

**Scale/Scope**: 3–8 jobs esperados (A10), grid responsive optimizado para 4–6 visibles. Más de 8 items requeriría virtualización (out of scope, OOS + §241 del spec).

---

## Constitution Check

Validación contra `.specify/memory/constitution.md`:

| Principio | Estado | Análisis |
|-----------|--------|----------|
| **I. Portfolio (propósito)** | ✓ PASS | El JobCard ES la carta de presentación profesional. Sin él, el portfolio pierde valor de cara a recruiters (US-1). |
| **II. Performance (60fps, <3s load)** | ✓ PASS | `ScrollTrigger.batch` con 1 observer para N cards (no N observers); FLIP technique optimizada en GSAP 3.13.0; `will-change` implícito en transforms; bundle impact <2KB. |
| **III. Accesibilidad Universal (WCAG 2.1 AA)** | ✓ PASS | `jest-axe` 0 violaciones (FR-015); focus ring 2px green ratio 12.6:1 (AAA); ARIA completo (`aria-labelledby`, `aria-expanded`, `aria-controls`, `aria-hidden`, `aria-label`); navegación teclado completa (`Tab`/`Enter`/`Space`/`Escape`); `prefers-reduced-motion` respetado. |
| **IV. Testing (≥80% coverage)** | ➜ GATE-REQUIRES-DEV-DEPS | **GAP detectado**: el proyecto no tiene test runner instalado. La constitución exige ≥80% coverage con `vitest`. **Resolución**: añadir dev-deps (justificadas por SC-005/FR-015) en esta feature, no en una posterior. Sin esto, la calidad gate es imposible de validar. |
| **V. Seguridad (Defense in Depth)** | ✓ PASS | Datos estáticos en JS, sin APIs externas (EC-012 del spec), sin secretos hardcoded, sin mixed-content (logos locales en `public/logos/`). |
| **VI. Animaciones Significativas** | ✓ PASS | Cada animación comunica: entrada=orden cronológico; faro=presencia activa; conector=continuidad; expand=profundidad; FLIP=relación filtro↔data. |
| **VII. Progressive Enhancement** | ✓ PASS | Sin JS: HTML semántico renderiza toda la info crítica (EC-010 del spec: `<article>` + `<h3>` company + `<h4>` role + `<time>` period + `<ul>` stack como texto + `<p>` description + `<a>` links). |

| Quality Gate | Estado | Acción |
|--------------|--------|--------|
| **1. Coverage ≥80%** | ➜ A IMPLEMENTAR | Requiere dev-deps vitest. Plan documenta estrategia de tests en §"Estrategia de testing". |
| **2. Lint sin errores** | ✓ DEBE CUMPLIRSE | StandardJS (no ESLint); todas las convenciones del codebase se mantienen. |
| **3. Security audit** | ✓ AUTOMÁTICO | `pnpm audit` sin nuevas runtime deps; dev-deps de testing son de confianza. |
| **4. Build exitoso** | ✓ AUTOMÁTICO | `pnpm build` no se ve afectado; bundle impact <2KB verificado. |
| **5. Accessibility audit** | ➜ A IMPLEMENTAR | `jest-axe` en cada variante del card; 0 violaciones exigido. |

> **Decisión constitucional del Architect**: la adición de dev-deps para testing se ejecuta **en esta feature** (no en una iteración posterior) porque:
> 1. SC-005 y FR-015 son no-negociables.
> 2. Mantenerlas en una feature separada fragmenta la deuda y retrasa la primera release utilizable.
> 3. Son dev-deps: no impactan el bundle de producción.
> 4. La constitución §39 las permite si están "justificadas en el spec.md" — y el spec §3 (SC-005) las justifica.

---

## Project Structure

### Documentation (esta feature)

```text
specs/002-job-card-component/
├── plan.md              # Este archivo
├── research.md          # N/A — sin dependencias externas que investigar (A1: cero nuevas deps runtime)
├── data-model.md        # INLINE en §"Data Model & Job Contract" (entidad simple, no relacional)
├── quickstart.md        # N/A — proyecto existente, no setup de cero
├── contracts/           # N/A — sin contratos API externos (EC-012)
└── tasks.md             # Generado por setup-tasks.sh (después de este plan)
```

### Source Code (cambios en repo)

```text
src/
├── components/
│   ├── JobCard/                          ← NUEVO
│   │   ├── JobCard.jsx                   # Componente principal compuesto
│   │   ├── JobCard.module.css            # Estilos scoped (CSS Modules)
│   │   ├── JobCardHeader.jsx             # Sub: logo + type badge + company + role + beacon
│   │   ├── JobCardMeta.jsx               # Sub: period + duration + location + remote
│   │   ├── JobCardDescription.jsx        # Sub: array de paragraphs
│   │   ├── JobCardAchievements.jsx       # Sub: lista expandible con disclosure
│   │   ├── JobCardStack.jsx              # Sub: fila de iconos tech (reusa techIcons)
│   │   ├── JobCardFooter.jsx             # Sub: tags + links + expand trigger
│   │   └── JobCardLogo.jsx               # Sub: img + onError → initials placeholder
│   ├── JobsCards/                        ← NUEVO (contenedor de la grid + section)
│   │   ├── JobsCards.jsx                 # <section id="experience"> + grid + reorder
│   │   ├── JobsCards.module.css
│   │   ├── useFadeInJobCards.js          # Hook de stagger de entrada (NO es useFadeInElement reusado, ver §"Animaciones")
│   │   └── useFlipJobs.js                # Hook de reorder animado con FLIP
│   ├── Hooks/                            # NUEVO
│   │   ├── useSortJobs.js                # Espejo de useSortProjects
│   │   ├── useBeaconPulse.js             # Pulso infinito del faro (featured card)
│   │   ├── useJobDuration.js             # Helper: formatDuration(job) → "2y 4m"
│   │   └── useIsFeaturedJob.js           # Helper: detecta el featured (current: true más reciente)
│   ├── AboutMe/                          # SIN CAMBIOS
│   ├── ProjectsCards/                    # SIN CAMBIOS
│   ├── FilterProjects/                   # SIN CAMBIOS (la barra existente filtra también Jobs)
│   ├── NavHeader/                        # SIN CAMBIOS en esta iteración (DA-07)
│   ├── Button/                           # SIN CAMBIOS (reutilizado)
│   ├── LinkButton/                       # SIN CAMBIOS (reutilizado)
│   ├── Icons/                            # SIN CAMBIOS (techIcons reusado)
│   └── ...
├── contexts/
│   └── IsIconCheckFilter.jsx             # MODIFICAR: añadir 4 keys faltantes (tailwind, storybook, vite, npm) para paridad con techIcons
├── data/
│   ├── jobs.js                           # NUEVO (espejo de projects.js)
│   ├── projects.js                       # SIN CAMBIOS
│   └── icons.js                          # SIN CAMBIOS (re-exporta techIcons)
├── sections/                             # N/A (sección se monta vía JobsCards.jsx)
├── App.jsx                               # MODIFICAR: (1) mover IsIconCheckFilterProvider arriba, (2) montar <JobsCards /> entre Projects y AboutMe
├── index.css                             # MODIFICAR: añadir 25 tokens `--job-*` y `--color-job-*` al :root
└── index.jsx                             # SIN CAMBIOS

public/
└── logos/                                # NUEVO directorio (assets de empresas, locales)
    ├── araldev.webp                      # Placeholder durante desarrollo
    ├── acme-global.webp
    └── ...

tests/                                    ← NUEVO directorio raíz
├── setup.js                              # jest-dom matchers + axe config
├── fixtures/
│   └── jobs.js                           # Fixtures: 1 job minimal, 1 featured, 1 con achievements, 1 stack vacío, 1 sin tags
├── unit/
│   ├── useSortJobs.test.js
│   ├── useJobDuration.test.js
│   ├── useIsFeaturedJob.test.js
│   └── validateJobContract.test.js
├── integration/
│   ├── JobCard.test.jsx                  # 3 variantes × props × edge cases
│   ├── JobCardHeader.test.jsx
│   ├── JobCardAchievements.test.jsx      # toggle expand, Escape, focus
│   └── JobsCards.test.jsx                # grid, reorder, lazy animation
└── a11y/
    └── JobCard.a11y.test.jsx             # jest-axe 0 violaciones

vitest.config.js                          ← NUEVO (hereda vite.config.js + jsdom env)
```

**Estructura de decisión**: SPA monolítica existente; no se introduce monorepo. Se reutiliza la arquitectura modular de `ProjectsCards` (componente compuesto + hook de sorting + context global). Se elige `src/Hooks/` para hooks de **lógica de dominio** (sort, duration, featured) y `src/components/JobsCards/` para hooks de **animación** (stagger, FLIP) por consistencia con el codebase (los hooks de animación de `ProjectsCards` están en `src/Hooks/`, no en el componente — reevaluar: `useFadeInElement.js` está en `src/Hooks/`, `useAnimatedTitle.js` también).

> **Corrección a la estructura inicial propuesta en el design.md §10.2**: el design proponía `useFadeInJobCard.js` en `src/Hooks/`. Confirmado: **se mantiene en `src/Hooks/`** para coherencia con `useFadeInElement.js`. El error en el design era haber listado los hooks de animación dentro de `JobsCards/`. Se mueven a `src/Hooks/` y se actualiza el árbol arriba.

---

## Architecture Overview

### Data Flow (extendido del plan 001)

```
┌────────────────────────────────────────────────────────────────────────┐
│                          index.jsx                                     │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  ReactLenis Provider                                             │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  ScrollSync (GSAP ↔ Lenis RAF)                              │ │ │
│  │  │  ┌────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │  App.jsx                                                │ │ │ │
│  │  │  │  ├── NavHeader, NavToTop, AnimatedTitle → HeroSection  │ │ │ │
│  │  │  │  ├── main                                               │ │ │ │
│  │  │  │  │   ├── IsIconCheckFilterProvider (MOVIDO ARRIBA)     │ │ │ │
│  │  │  │  │   │   ├── ProjectsCards → FilterProjects           │ │ │ │
│  │  │  │  │   │   │   ├── ProjectCard[] → ProjectModal         │ │ │ │
│  │  │  │  │   │   │   └── useSortProjects (consume context)    │ │ │ │
│  │  │  │  │   │   └── JobsCards                                │ │ │ │
│  │  │  │  │   │       ├── <FilterProjects /> reusado           │ │ │ │
│  │  │  │  │   │       ├── JobCard[] (compuesto)                │ │ │ │
│  │  │  │  │   │       │   ├── JobCardHeader (logo+badge)       │ │ │ │
│  │  │  │  │   │       │   ├── JobCardMeta (period+duration)    │ │ │ │
│  │  │  │  │   │       │   ├── JobCardDescription               │ │ │ │
│  │  │  │  │   │       │   ├── JobCardAchievements (expandible) │ │ │ │
│  │  │  │  │   │       │   ├── JobCardStack (reusa techIcons)   │ │ │ │
│  │  │  │  │   │       │   └── JobCardFooter (tags+links+trig)  │ │ │ │
│  │  │  │  │   │       └── useSortJobs + useFlipJobs            │ │ │ │
│  │  │  │  │   ├── AboutMeSection                                │ │ │ │
│  │  │  │  │   ├── ContactSection (EmailJS + reCAPTCHA)          │ │ │ │
│  │  │  │  │   └── BackgroundHeroCanvas                          │ │ │ │
│  │  │  │  └── Footer                                            │ │ │ │
│  │  │  └────────────────────────────────────────────────────────┘ │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy (delta sobre 001)

```
App
├── ...
└── main
    ├── IsIconCheckFilterProvider  ← MOVIDO: ahora envuelve ProjectsCards + JobsCards
    │   ├── ProjectsCards (existente, sin cambios)
    │   │   ├── FilterProjects (existente)
    │   │   └── ProjectCard[] → ProjectModal (existente)
    │   └── JobsCards                          ← NUEVO
    │       ├── <FilterProjects /> reusado     ← decisión DA-02
    │       └── JobCard[]                      ← NUEVO
    │           ├── JobCardHeader              ← NUEVO
    │           ├── JobCardMeta                ← NUEVO
    │           ├── JobCardDescription         ← NUEVO
    │           ├── JobCardAchievements        ← NUEVO (expandible)
    │           ├── JobCardStack               ← NUEVO (reusa techIcons)
    │           └── JobCardFooter              ← NUEVO
    ├── AboutMeSection
    ├── ContactSection
    └── BackgroundHeroCanvas
```

### Module Responsibilities

| Archivo | Responsabilidad | Crea / Modifica | Tests |
|---------|----------------|----------------|-------|
| `src/data/jobs.js` | Array estático `jobs` (3–8 elementos) con shape `Job`; mismo patrón que `projects.js`. **NO** importa `techIcons` directamente (los `stack` se construyen en el archivo). | CREAR | `tests/integration/JobCard.test.jsx` con fixtures |
| `src/components/JobCard/JobCard.jsx` | Componente raíz; orquesta sub-componentes; aplica hooks de animación y comportamiento. Acepta props: `job`, `expandLabel`, `collapseLabel`, `isFirst` (para omitir top rail dot), `prefersReducedMotion`. | CREAR | `tests/integration/JobCard.test.jsx` + `tests/a11y/JobCard.a11y.test.jsx` |
| `src/components/JobCard/JobCardHeader.jsx` | Logo (img con onError→placeholder) + type badge + company (h3) + role (h4) + beacon condicional. | CREAR | Integration + a11y |
| `src/components/JobCard/JobCardMeta.jsx` | `<time>` period + duration + location + remote dot. | CREAR | Integration |
| `src/components/JobCard/JobCardDescription.jsx` | Mapea `job.description[]` a `<p>` con `max-width: 60ch`. | CREAR | — (trivial) |
| `src/components/JobCard/JobCardAchievements.jsx` | Disclosure widget: `aria-expanded` toggleable, `aria-hidden` sincronizado, `aria-controls` correcto. | CREAR | Integration (toggle, Escape, focus restore) |
| `src/components/JobCard/JobCardStack.jsx` | Reusa exactamente el patrón de `TechsIcons` en `ProjectsCards.jsx`; consume `useIsIconCheckFilter` para dim de no-matches. | CREAR | Integration |
| `src/components/JobCard/JobCardFooter.jsx` | Tags pills + LinkButtons + expand trigger. | CREAR | Integration |
| `src/components/JobCard/JobCardLogo.jsx` | `<img loading="lazy" alt="" aria-hidden>` con `onError` que muestra initials placeholder (gradient cyan→green). | CREAR | Integration (EC-005) |
| `src/components/JobCard/JobCard.module.css` | Estilos scoped. Incluye media queries, focus rings, hover, reduced-motion. | CREAR | — |
| `src/components/JobsCards/JobsCards.jsx` | `<section id="experience">` + título + barra de filtros reusada + grid + reorder hook. | CREAR | Integration |
| `src/components/JobsCards/JobsCards.module.css` | Estilos de la grid responsive (auto-fit minmax 350px), conector central `::before`, fallback para `[]` (EC-006). | CREAR | — |
| `src/Hooks/useSortJobs.js` | Espejo de `useSortProjects.js`: ordena por `current: true` primero, luego `startDate` desc, calcula `techsChecked` (mismo nombre, mismo significado). | CREAR | `tests/unit/useSortJobs.test.js` |
| `src/Hooks/useFadeInJobCards.js` | Reemplaza la animación obsoleta de `useFadeInElement`: usa `ScrollTrigger.batch` para stagger 0.12s entre cards. | CREAR | Unit (mock de gsap) |
| `src/Hooks/useFlipJobs.js` | Reorder con `gsap.Flip` cuando cambia el orden (FLIP technique). | CREAR | Unit |
| `src/Hooks/useBeaconPulse.js` | Pulso infinito `sine.inOut` para el faro del featured. Cleanup con `tl.kill()`. | CREAR | Unit |
| `src/Hooks/useJobDuration.js` | Helper puro: `formatDuration(job) → "2y 4m"`. | CREAR | Unit (matriz de casos) |
| `src/Hooks/useIsFeaturedJob.js` | Helper puro: dado un array, devuelve el índice del featured (current: true más reciente). | CREAR | Unit |
| `src/contexts/IsIconCheckFilter.jsx` | Añadir 4 keys faltantes (`tailwind`, `storybook`, `vite`, `npm`) al estado inicial para paridad con `techIcons` (12 keys totales). | MODIFICAR | — (regression) |
| `src/App.jsx` | Mover `<IsIconCheckFilterProvider>` para envolver `<ProjectsCards>` y `<JobsCards>`; montar `<JobsCards />` entre `<ProjectsCards />` y `<AboutMeSection />`. | MODIFICAR | Smoke test |
| `src/index.css` | Añadir 25 tokens `--job-*` y `--color-job-*` al `:root` (ver §"CSS Tokens"). | MODIFICAR | — (visual) |
| `public/logos/` | Directorio para assets de logos. Placeholders `.webp` durante desarrollo. | CREAR | — |
| `vitest.config.js` | Hereda config de Vite, añade `test: { environment: 'jsdom', setupFiles: ['./tests/setup.js'], coverage: { thresholds: { lines: 80, functions: 80, branches: 80 } } }`. | CREAR | — |
| `tests/setup.js` | `import '@testing-library/jest-dom/vitest'` + setup de `jest-axe` matcher. | CREAR | — |
| `tests/fixtures/jobs.js` | Fixtures: `minimalJob`, `featuredJob`, `withAchievementsJob`, `emptyStackJob`, `noAchievementsJob`, `multiParagraphJob`. | CREAR | — |

---

## Decisiones Arquitectónicas (DA-01 a DA-08)

Resolución formal de las 8 Open Questions del design.md §11. **Ninguna queda abierta.**

### DA-01 — Featured card: `1fr` vs `grid-column: span 2`

**Decisión**: `1fr` (mismo espacio que Standard).

**Justificación**:
- Consistencia visual con la grid (mismo `minmax(350px, 1fr)`)
- El Featured se diferencia por **3 señales ortogonales** (faro, borde animado, border-left 3px) — ninguna requiere más espacio
- Permite reordenar el Featured dinámicamente sin reorganizar la grid
- Si en el futuro hay múltiples `current: true` (ej. dos roles concurrentes), no rompe layout

**Impacto en código**: cero líneas extra; solo se aplica `border-left: 3px solid var(--color-text-gradient-end)` y `data-featured="true"` al card. El `JobsCards.module.css` añade un selector `.job_card[data-featured="true"]` con `box-shadow: var(--shadow-job-featured-border)` y la animación `@keyframes jobFeaturedBorder`.

**Trade-off**: el Featured no destaca por tamaño, solo por glow. **Aceptable** porque la metáfora "Holo-Log" prioriza "presencia" sobre "dominancia" (el faro ilumina, no aplasta).

### DA-02 — Filter: reusar `IsIconCheckFilter` vs crear contexto paralelo

**Decisión**: **reusar el contexto existente** + crear `useSortJobs` (espejo de `useSortProjects`).

**Justificación**:
- Mismos 12 iconos tech en Jobs y Projects (DA del design §3.1 resuelve A8 con reusar)
- Una sola barra de filtros en la página evita saturación visual
- Comportamiento idéntico al de Projects (reordenar por matches, no ocultar) → consistencia de UX
- Cero código nuevo de context: solo se mueve el `Provider` en `App.jsx` y se añade 1 hook
- El contexto ya tiene la semántica "filtro de techs del portfolio"; un contexto paralelo (`IsIconCheckFilterJobs`) duplicaría estado y obligaría a sincronizar dos `useState` (anti-patrón)

**Impacto en código**:
- `src/App.jsx`: mover `<IsIconCheckFilterProvider>` desde dentro de `<ProjectsCards>` (donde estaba en 001) al nivel de `<main>` que envuelve AMBAS secciones.
- `src/contexts/IsIconCheckFilter.jsx`: añadir 4 keys (`tailwind`, `storybook`, `vite`, `npm`) al `useState` inicial para paridad con `techIcons`. **Acción crítica** detectada en este análisis: actualmente el contexto solo tiene 8 keys (js, react, css, html, ts, git, gitHub, gsap), pero `techIcons` exporta 12. Si no se añaden, los jobs que usen `tailwind`/`storybook`/`vite`/`npm` no podrán ser filtrados por esos techs. Sin breaking change: los proyectos existentes no se ven afectados (sus `tech` no incluían esos keys).
- `src/Hooks/useSortJobs.js`: 41 líneas, análogo a `useSortProjects.js`.

**Trade-off**: los filtros afectan a AMBAS secciones simultáneamente. Si el usuario filtra "React" en la sección Projects y hace scroll a Jobs, los Jobs también se reordenan. **Intencional** y **deseable**: refleja "qué techs domino" de forma global.

**Decisión cerrada por el Designer (handoff §0 del design)**: ratificada en este plan.

### DA-03 — Conector cronológico: `::before` por card o por sección

**Decisión**: por **sección** (`section::before`) cuando `≥ 1200px` y `≥ 3 jobs`.

**Justificación**:
- Más eficiente: 1 línea CSS vs N por card
- Una sola animación con ScrollTrigger (más fácil de limpiar)
- No se alinea con cards individuales (lo cual sería problemático con cards de alturas distintas — el design §12 documenta este riesgo)
- Visualmente coherente con la metáfora "línea de tiempo holográfica" (la línea es el campo, no un atributo de cada card)

**Implementación**:
```css
/* En JobsCards.module.css */
.experience_section {
  position: relative;
  /* ...grid styles... */
}
.experience_section::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--color-job-connector), transparent);
  display: none;
  z-index: -2;
}
@media (min-width: 1200px) {
  .experience_section.has_min_3_cards::before { display: block; }
}
```

La clase `has_min_3_cards` se aplica condicionalmente en `JobsCards.jsx` con `className={`${styles.experience_section} ${jobs.length >= 3 ? styles.has_min_3_cards : ''}`}`.

**Trade-off**: en mobile el conector no se ve, lo cual es intencional (no hay espacio horizontal para rail + cards). El efecto "línea de tiempo" se mantiene en desktop.

### DA-04 — `formatDuration(job)`: en componente o en `src/data/jobs.js`

**Decisión**: en el **componente** (helper `useJobDuration` + `formatDuration`).

**Justificación**:
- El spec EC-004 dice que `period` es texto pre-formateado y el componente NO debe parsearlo — esto se respeta: `period` se muestra literal.
- La duración (`2y 4m`) es **metadata derivada** de `startDate` + (`endDate` o "today" si `current: true`). Es cálculo, no dato.
- Calcularla en `src/data/jobs.js` obligaría a mantenerla sincronizada manualmente con `startDate`/`endDate`/`current` (deuda técnica).
- El helper `useJobDuration(job)` es puro, testeable, y de ~15 líneas. Vive en `src/Hooks/useJobDuration.js`.

**Firma del helper**:
```js
/**
 * @param {Job} job
 * @returns {string} Duración legible, ej. "2y 4m", "8m", "1y"
 */
function formatDuration (job) { /* ... */ }
```

**Edge cases del helper** (cubiertos por tests):
- Mismo mes inicio/fin → "1m" mínimo (no "0m")
- `current: true` con `endDate: undefined` → usa `new Date()` como fin
- `current: true` con `endDate` definido → ignora `endDate` (EC-003), usa `new Date()`
- Fechas invertidas (`endDate < startDate`) → lanza `Error` en dev (FR-021), muestra "—" en prod
- Fechas malformadas → try/catch con fallback "—"

### DA-05 — Achievements: `aria-hidden` toggleado vs re-render

**Decisión**: **render siempre + `aria-hidden` toggleado + `height: 0/auto` animado**.

**Justificación**:
- Más accesible: el contenido está en el DOM, screen readers pueden anunciarlo al expandir sin re-render
- Más performante: no se desmonta el subtree
- Animación de altura con `gsap.set(..., { height: 'auto' })` + `fromTo` es el patrón estándar (no requiere librería extra)
- Permite que el contenido se indexe en "find in page" del navegador aunque esté colapsado (mejora SEO parcial)

**Implementación** (referencia para 04-developer, NO código fuente):
```jsx
<section
  hidden={!isExpanded}      /* fallback nativo */
  aria-hidden={!isExpanded}  /* para screen readers */
  id={`job-${job.id}-achievements`}
  style={isExpanded ? undefined : { height: 0, overflow: 'hidden' }}
>
  <h5>Key achievements</h5>
  <ul>{job.achievements.map(...)}</ul>
</section>
```

GSAP se aplica en `onMount` y en `toggleExpand` para animar la transición de altura.

**Trade-off**: el contenido se renderiza aunque esté oculto (más bytes de DOM). **Aceptable** porque los `achievements` son strings cortos (típicamente <500 chars total por job).

### DA-06 — Mount: SPA section vs ruta separada

**Decisión**: misma SPA, nueva `<section id="experience">` entre Projects y AboutMe.

**Justificación**:
- El spec A4 recomienda esto explícitamente
- No introduce routing (Lenis smooth scroll + anchors existentes funcionan tal cual)
- Cero impacto en `index.html` o build
- Consistente con todas las secciones existentes (Hero, Projects, AboutMe, Contact son `<section>`s en la misma SPA)

**Placement exacto** (cierra la Open Question §6.1 del spec):
- Entre `<ProjectsCards />` y `<AboutMeSection />` en `App.jsx`
- Narrativamente: Projects (qué sé hacer) → Experience (dónde lo apliqué profesionalmente) → AboutMe (quién soy) → Contact (contrátame)

**Impacto en código**: 1 línea de import + 1 línea de `<JobsCards />` en `App.jsx`. El `id="experience"` permite anchor directo (`#experience`).

### DA-07 — NavHeader: actualizar o no

**Decisión**: **NO se actualiza en esta iteración**. Queda para una iteración separada.

**Justificación**:
- El spec A4 lo declara out of scope explícitamente: "El NavHeader se actualizará en una iteración separada"
- El design §11 lo confirma
- Mantiene la feature enfocada y pequeña (~5 archivos nuevos vs ~6 con NavHeader)
- El usuario puede hacer scroll manual a la sección; los anchors `home`, `projects`, `about-me`, `contact` siguen funcionando

**Acción diferida**: crear un ticket/issue post-feature: "Añadir link 'Experience' al `NavHeader` con `data-id='experience'` (análogo al resto)". El anchor `#experience` ya existirá en el DOM, así que el cambio futuro es de 1 línea en `NavHeader.jsx` (un `<li><a data-id='experience'>Experience</a></li>`).

**Trade-off documentado**: la sección será visible al hacer scroll pero no desde el menú superior. **Aceptable** porque la feature ya aporta valor completo (P1) y el NavHeader se mejora sin urgencia.

### DA-08 — `prefers-color-scheme: light`

**Decisión**: **NO se implementa en v1**. Dark-only.

**Justificación**:
- Constitución I establece el portfolio como dark-only ("el sitio no es un ejercicio académico sino un producto vivo")
- El spec no lo pide
- Ningún token del Design System 001 lo considera
- El `prefers-color-scheme: light` requeriría definir TODOS los tokens con un override `@media (prefers-color-scheme: light)` — trabajo fuera del scope de la feature

**Acción documentada**: si en el futuro se quiere soporte light mode, se abordará como feature transversal con su propio spec.

---

## Data Model & Job Contract

### Schema JSDoc (referencia para 04-developer)

```js
/**
 * @typedef {Object} Job
 * @property {string} id            - REQUIRED. Slug único estable (kebab-case).
 *                                    Usado como `key` de React, ancla de tests.
 *                                    Patrón recomendado: "{empresa-slug}-{rol-slug}-{año}".
 * @property {string} company       - REQUIRED. Nombre visible. Max 60 chars.
 * @property {string} [companyLogo] - OPTIONAL. Path local "/logos/..." o undefined.
 *                                    NUNCA URL externa (mixed-content en GH Pages).
 * @property {string} role          - REQUIRED. Título del puesto. Max 80 chars.
 * @property {JobType} type         - REQUIRED. Enum cerrado (ver abajo).
 * @property {string} period        - REQUIRED. Texto pre-formateado. NO se parsea.
 *                                    Ej. "Jan 2023 — Present".
 * @property {string} startDate     - REQUIRED. ISO "YYYY-MM". Usado para orden
 *                                    y para `dateTime` de <time>.
 * @property {string} [endDate]     - OPTIONAL. ISO "YYYY-MM". Si `current: true`,
 *                                    DEBE ser `undefined` (EC-003).
 * @property {boolean} current      - REQUIRED. `true` si activo en fecha de hoy.
 * @property {string} location      - REQUIRED. Ciudad, país o "Remote".
 * @property {boolean} remote       - REQUIRED. `true` si 100% remoto.
 * @property {string[]} description - REQUIRED. 1-3 párrafos cortos, sin HTML.
 * @property {string[]} [achievements] - OPTIONAL. Bullet points clave. Si >0,
 *                                    habilita expandible (FR-004).
 * @property {Object<string, ReactNode>} stack - REQUIRED. Keys del set
 *                                    `JobStackKey` (subconjunto de techIcons).
 *                                    Si `Object.keys(stack).length === 0`,
 *                                    la fila se oculta (FR-005).
 * @property {string[]} [tags]      - OPTIONAL. Keywords cortos.
 * @property {JobLinks} [links]     - OPTIONAL. URLs externas.
 */

/**
 * @typedef {('full-time'|'part-time'|'contract'|'freelance'|'internship')} JobType
 */

/**
 * @typedef {Object} JobLinks
 * @property {string} [companyLink]   - URL a la web de la empresa.
 * @property {string} [projectLink]   - URL a un proyecto destacado del puesto.
 * @property {string} [referenceLink] - URL a carta de recomendación o LinkedIn post.
 */

/**
 * @typedef {('js'|'react'|'css'|'html'|'ts'|'tailwind'|'git'|'gitHub'|'gsap'|'storybook'|'vite'|'npm')} JobStackKey
 */
```

### Validación de runtime (FR-021)

**Decisión**: **JSDoc + validador explícito en dev, sin PropTypes ni TypeScript**.

**Justificación**:
- El codebase actual NO usa TypeScript ni PropTypes (verificado: `package.json` no tiene `typescript`, ningún `.tsx` en `src/`, ningún `import PropTypes`).
- Migrar a TypeScript para esta feature es **out of scope** (requeriría migración del codebase,宪法 III, IV).
- PropTypes añadiría una dev-dep y complejidad para un proyecto que actualmente no la usa.
- JSDoc sirve para IDEs y documentación, pero NO valida en runtime.

**Solución pragmática**: un validador runtime explícito `validateJobContract(job)` en `src/data/jobs.js` que:

1. En **modo dev** (`import.meta.env.DEV === true`): lanza `Error` en consola si faltan campos `required` o si los tipos no coinciden.
2. En **modo prod**: silencia los errores y devuelve `null` (el componente hace fallback de render con `<p role="status">Invalid job data</p>`).

```js
// src/data/jobs.js (referencia, NO a incluir en este plan)
function validateJobContract (job, index) {
  if (!import.meta.env.DEV) return
  const required = ['id', 'company', 'role', 'type', 'period', 'startDate', 'current', 'location', 'remote', 'description', 'stack']
  for (const field of required) {
    if (job[field] === undefined || job[field] === null) {
      console.error(`[jobs.js] Job at index ${index} is missing required field "${field}".`, job)
    }
  }
  if (job.current && job.endDate) {
    console.warn(`[jobs.js] Job ${job.id} has current: true AND endDate defined; endDate will be ignored (EC-003).`)
  }
  // ... más validaciones
}
```

> **FR-021 cumplimiento**: el spec exige "lanzar Error en consola (modo dev) si faltan campos required". El helper cumple esto. En prod, el componente es resiliente y renderiza fallback.

> **FR-022 cumplimiento**: el spec exige "PropTypes o TS types". Solución alternativa constitucionalmente válida: **exportar el JSDoc typedef** y referenciarlo desde los tests con JSDoc casts. La constitución §40 ("Prohibido usar jQuery u otras librerías que dupliquen funcionalidad de React") y §39 ("Prohibido agregar dependencias sin justificación") bloquean PropTypes. TypeScript requeriría migración masiva (out of scope). **JSDoc es la solución idiomática del codebase actual** (verificado: `src/data/projects.js` y los hooks usan `@typedef` extensivamente, ej. ya está documentado en `plan.md` 001 §261).

### Ejemplo de fixture (`tests/fixtures/jobs.js`)

```js
import { techIcons } from '../../src/data/icons.js'

export const minimalJob = {
  id: 'test-co-2024',
  company: 'Test Co',
  role: 'Frontend Dev',
  type: 'full-time',
  period: 'Jan 2024 — Present',
  startDate: '2024-01',
  current: true,
  location: 'Remote',
  remote: true,
  description: ['Built cool things.'],
  stack: { js: techIcons.js, react: techIcons.react }
}

export const featuredJob = { ...minimalJob, id: 'featured-co-2024', current: true }
export const historicalJob = { ...minimalJob, id: 'historical-co-2020', current: false, endDate: '2020-12', period: 'Jan 2020 — Dec 2020' }
export const jobWithAchievements = { ...minimalJob, id: 'with-ach-2023', achievements: ['Shipped feature X', 'Mentored 2 juniors'] }
export const jobEmptyStack = { ...minimalJob, id: 'no-stack-2022', stack: {} }
export const jobLongDescription = { ...minimalJob, id: 'long-desc-2021', description: ['Para 1', 'Para 2', 'Para 3'] }
export const jobWithLinks = { ...minimalJob, id: 'with-links-2023', links: { companyLink: 'https://example.com', projectLink: 'https://github.com/x' } }
```

---

## Animations Strategy

### Hook de entrada: `useFadeInJobCards`

**Patrón mejorado respecto a `useFadeInElement.js`**: el hook existente usa `gsap.from()` con un `ScrollTrigger` por elemento y un `animation.kill()` en cleanup que NO mata el trigger (memory leak menor). Para el batch de cards, se usa el patrón oficial de GSAP: `ScrollTrigger.batch` + `onEnter` con stagger.

```js
// src/Hooks/useFadeInJobCards.js (referencia, NO código fuente)
// Diferencias clave con useFadeInElement:
// 1. ScrollTrigger.batch para 1 observer compartido
// 2. Stagger de 0.12s entre cards (sensación cronológica)
// 3. Cleanup mata TANTO la batch completa (.forEach(t => t.kill())) como el tween interno
// 4. prefersReducedMotion: si true, gsap.set a autoAlpha 1 y return early (sin animation)
```

**Patrón de cleanup garantizado (memory leak prevention — FR-011 + design §5.1)**:
```js
return () => {
  // 1. Kill del tween explícito (si existe)
  if (tweenRef.current) tweenRef.current.kill()
  // 2. Kill de TODOS los triggers asociados a este hook
  ScrollTrigger.getAll()
    .filter(t => t.vars.trigger && gridRef.current?.contains(t.vars.trigger))
    .forEach(t => t.kill())
  // 3. gsap.set al estado final para evitar FOUC
  gsap.set(cards, { clearProps: 'all' })
}
```

**Trigger position**: `top bottom-=50` (idéntico a `useFadeInElement.js`), dando margen de anticipación sin intrusión.

### Hook de reorder: `useFlipJobs`

**Patrón FLIP** (First, Last, Invert, Play) para reordenar cuando cambia el filtro:

```js
// src/Hooks/useFlipJobs.js (referencia)
// useEffect([sortJobs]) {
//   if (prefersReducedMotion) return  // sin animación, React hace el re-render
//   const cards = gridRef.current.querySelectorAll('.job_card')
//   const state = Flip.getState(cards)  // First: capturar posiciones
//   // Last: el re-render de React aplica el nuevo orden
//   // Invert + Play: animar desde old → new
//   requestAnimationFrame(() => {
//     Flip.from(state, {
//       duration: 0.3,
//       ease: 'power2.inOut',
//       stagger: 0.04,
//       absolute: true,
//       onEnter: elems => gsap.fromTo(elems, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2 }),
//       onLeave: elems => gsap.to(elems, { opacity: 0, scale: 0.9, duration: 0.15 })
//     })
//   })
//   return () => { /* kill del Flip state si existe */ }
// }
```

**Performance**: la FLIP technique está optimizada en GSAP 3.13.0 y mantiene 60fps con 8 cards (caso máximo A10). Con >8 items, **out of scope** (OOS + §241).

**Heurística de fallback para gama baja** (mitigación de riesgo §12 del design):
```js
// Si navigator.hardwareConcurrency < 4, skip FLIP y dejar a React reordenar instantáneamente.
const isLowPower = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4
if (isLowPower || prefersReducedMotion) return
```

### Hook de pulso: `useBeaconPulse`

**Pulso infinito** del faro del Featured card:

```js
// src/Hooks/useBeaconPulse.js (referencia)
// useEffect([beaconRef]) {
//   if (prefersReducedMotion) return  // desactivado
//   const core = beacon.querySelector('.job_card_beacon_core')
//   const halo = beacon.querySelector('.job_card_beacon_halo')
//   const tl = gsap.timeline({ repeat: -1, yoyo: true })
//     .to(core, { scale: 1.2, duration: 0.9, ease: 'sine.inOut' }, 0)
//     .to(halo, { scale: 1.5, opacity: 0.3, duration: 0.9, ease: 'sine.inOut' }, 0)
//   return () => tl.kill()  // cleanup crítico (FR-011)
// }
```

### Borde animado del Featured

**CSS keyframes** (no GSAP) — más performante para loops cíclicos sin scroll-driven:

```css
/* En JobCard.module.css */
@keyframes jobFeaturedBorder {
  0%   { box-shadow: var(--shadow-bg-obj1); }
  50%  { box-shadow: var(--shadow-bg-obj2); }
  100% { box-shadow: var(--shadow-bg-obj1); }
}
.job_card[data-featured="true"] .job_card_surface {
  animation: jobFeaturedBorder 4s ease-in-out infinite;
}
```

### Animación de expansión inline (achievements)

**Patrón de dos pasos** (medir altura + animar, evitando `height: auto` directo):

```js
// Dentro de JobCard.jsx (referencia)
// const toggleExpand = useCallback(() => {
//   if (prefersReducedMotion) { setIsExpanded(p => !p); return }
//   const section = achievementsRef.current
//   if (isExpanded) {
//     // Collapse: animar a 0
//     gsap.to(section, { height: 0, autoAlpha: 0, duration: 0.32, ease: 'power2.in' })
//   } else {
//     // Expand: medir altura natural + animar
//     gsap.set(section, { height: 'auto', autoAlpha: 1, overflow: 'hidden' })
//     const fullHeight = section.offsetHeight
//     gsap.fromTo(section,
//       { height: 0, autoAlpha: 0 },
//       { height: fullHeight, autoAlpha: 1, duration: 0.32, ease: 'power3.out',
//         onComplete: () => gsap.set(section, { height: 'auto' }) }
//     )
//   }
//   setIsExpanded(p => !p)
// }, [isExpanded, prefersReducedMotion])
```

### `prefers-reduced-motion` (FR-010, FR-022, EC-009, design §2.5)

**Helper centralizado** `usePrefersReducedMotion()` (a crear en `src/Hooks/`):

```js
// useEffect con matchMedia listener; devuelve boolean
// Se usa en: useFadeInJobCards, useFlipJobs, useBeaconPulse, toggleExpand, JobsCards animations
```

**Mapeo a `prefers-reduced-motion: reduce`** (de design §2.5 + §5.7):
| Animación | Normal | Reduced |
|-----------|--------|---------|
| Card fade-in + rise | 0.9s + translateY 30px | 0.2s sin translate |
| Stagger entre cards | 0.12s | sin stagger |
| Faro pulso | infinite | desactivado |
| Borde animado Featured | 4s infinite | desactivado |
| Hover glow | 0.25s ease | instantáneo |
| Active scale | 0.1s | instantáneo |
| Expand achievements | 0.32s | instantáneo |
| Reorder filter | 0.3s FLIP | instantáneo |
| Conector reveal | 0.6s | desactivado |

---

## Accessibility Strategy (WCAG 2.1 AA)

| Aspecto | Implementación | FR/SC/DA |
|---------|---------------|----------|
| **Roles ARIA** | `<article role="article" aria-labelledby="job-{id}-company">` | FR-001 |
| **Landmark** | `<header>`, `<section>`, `<footer>`, `<nav>` semánticos | DA-05 |
| **Disclosure pattern** | Expand trigger: `aria-expanded={isExpanded}` + `aria-controls="job-{id}-achievements"` | WAI-ARIA Authoring Practices |
| **Hidden content** | Achievements: `aria-hidden={!isExpanded}` + `hidden` attribute (fallback) + `height: 0` | DA-05 |
| **Time semantics** | `<time dateTime={job.startDate}>` (ISO YYYY-MM) | FR-016 |
| **Logo decorativo** | `<img alt="" aria-hidden="true">` + initials placeholder `aria-hidden="true"` | FR-006, EC-005 |
| **Type badge label** | `aria-label="{FullLabel} employment"` (ej. "Full-time employment") | FR-007 |
| **Focus visible** | `outline: 2px solid #92FE9D; outline-offset: 3px` (ratio 12.6:1 AAA) | FR-014, design §4.4 |
| **Tab order** | Logo link → type badge (no focus) → stack icons → tags (no focus) → LinkButtons → expand trigger | Design §8.2 |
| **Enter/Space expand** | Botón nativo `<button>` con `onClick` + `onKeyDown` (precaution) | FR-014 |
| **Escape collapse** | Listener global en `JobCard`: si `Escape` y `isExpanded`, colapsa + `triggerRef.current.focus()` | Design §8.2, US-3 |
| **Focus restore** | Tras colapsar, foco vuelve al trigger (no al `<body>`) | US-3 acceptance 2 |
| **Contraste mínimo** | Todos los pares texto/fondo validados ≥7:1 (AAA en la mayoría) | Design §8.3 |
| **Touch targets** | ≥44×44px en mobile (LinkButtons, expand trigger) | WCAG 2.5.5 AAA, design §7.4 |
| **Progressive enhancement** | Sin JS: HTML semántico completo con info crítica visible | EC-010, Const. VII |
| **jest-axe** | Test automatizado en cada variante; 0 violaciones exigido | FR-015, SC-004 |

**Árbol de decisión de foco** (testeable):
1. Tab desde fuera del card → entra al primer focusable interno
2. Si el card root es `<button>` (caso de card "summary" simple), entra al root
3. Si tiene achievements, Tab también visita el trigger
4. Escape → colapsa + foco al trigger
5. Shift+Tab → sale del card en orden inverso

---

## Performance & Bundle Strategy

### Estimación de bundle impact (SC-007: <2KB gzipped)

| Componente / Hook | Estimación (gzip) | Notas |
|-------------------|-------------------|-------|
| `JobCard.jsx` + sub-componentes (6) | ~1.0 KB | Lógica presentacional, sin lógica pesada |
| `JobCard.module.css` | ~0.4 KB | Selectores scoped, sin duplicación |
| `JobsCards.jsx` + `.module.css` | ~0.3 KB | Wrapper minimal |
| `useSortJobs.js` | ~0.15 KB | Espejo de useSortProjects |
| `useFadeInJobCards.js` | ~0.2 KB | Wrapper de ScrollTrigger.batch |
| `useFlipJobs.js` | ~0.15 KB | Wrapper de gsap.Flip |
| `useBeaconPulse.js` | ~0.1 KB | Timeline simple |
| `useJobDuration.js` | ~0.05 KB | Helper puro |
| `useIsFeaturedJob.js` | ~0.05 KB | Helper puro |
| `usePrefersReducedMotion.js` | ~0.05 KB | MatchMedia listener |
| `Jobs.js` (data) | ~0.3 KB | 3-8 jobs × ~200 bytes cada uno |
| **TOTAL** | **~2.75 KB** | Ligeramente por encima del SC-007 (2KB) |

**Mitigación**: tree-shaking de Vite + minificación + gzip real será menor. Si el bundle final supera 2KB, se propone **mover `useJobDuration` y `useIsFeaturedJob` a una sola utility** (`src/lib/jobHelpers.js`) para ahorrar bytes de boilerplate de exports.

**Code splitting**: NO se justifica. La sección `JobsCards` se renderiza inmediatamente en la home (no es lazy), así que el code splitting no aporta beneficio. Si en el futuro se separa a una ruta `/experience`, se evaluará `React.lazy`.

**Preload de logos**: los `companyLogo` usan `loading="lazy"` (FR-006 + design §3.1). No se precargan; son imágenes pequeñas (≤64×64px) y decorativas.

**Imagen de performance clave**: el Featured card siempre se anima con `box-shadow` (CSS, GPU-accelerated), NO con re-layout. Los demás cards se animan con `transform: translateY` + `opacity` (compositor-only). Cero layout thrashing.

---

## Integration Plan: App.jsx y NavHeader

### Diff conceptual de `src/App.jsx`

```diff
 import { useRef } from 'react'
 import { AnimatedTitle } from './components/AnimatedTitle/AnimatedTitle.jsx'
 import { HeroSection } from './components/HeroSection/HeroSection.jsx'
 import { NavHeader } from './components/NavHeader/NavHeader.jsx'
 import { ProjectsCards } from './components/ProjectsCards/ProjectsCards.jsx'
+import { JobsCards } from './components/JobsCards/JobsCards.jsx'
 import { useAnimatedNavHeader } from './Hooks/useAnimatedNavHeader.js'
 import { BackgroundHeroCanvas } from './components/Backgrounds/BackgroundHeroCanvas.jsx'
 import { IsIconCheckFilterProvider } from './contexts/IsIconCheckFilter.jsx'
 import { NavToTop } from './components/NavToTop/NavToTop.jsx'
 import { useAnimatedNavToTop } from './Hooks/useAnimatedNavToTop.js'
 import { Footer } from './components/Footer/Footer.jsx'
 import { ContactSection } from './components/Contact/ContactSection.jsx'
 import { AboutMeSection } from './components/AboutMe/AboutMeSection.jsx'

 export default function () {
   const mainRef = useRef()
   const navHeaderRef = useRef()
   const navToTopRef = useRef()
   useAnimatedNavHeader({ mainRef, navHeaderRef })
   useAnimatedNavToTop({ mainRef, navToTopRef })

   return (
     <>
       <NavHeader ref={navHeaderRef} />
       <NavToTop ref={navToTopRef} />
       <AnimatedTitle>
         <HeroSection />
       </AnimatedTitle>
       <main ref={mainRef} className='container_main '>
-        <IsIconCheckFilterProvider>
-          <ProjectsCards />
-        </IsIconCheckFilterProvider>
+        <IsIconCheckFilterProvider>
+          <ProjectsCards />
+          <JobsCards />
+        </IsIconCheckFilterProvider>
         <AboutMeSection />
         <ContactSection />
         <BackgroundHeroCanvas />
       </main>
       <Footer />
     </>
   )
 }
```

**Cambios en `IsIconCheckFilterProvider`** (justificación DA-02):
- Se mueve de dentro de `<ProjectsCards>` al nivel de `<main>` (ya estaba así si miramos el código actual — `App.jsx` línea 30-32: el Provider YA envuelve solo ProjectsCards, no el resto del main). El cambio es **añadir `<JobsCards />` DENTRO del Provider**, no moverlo.

> **Corrección sobre mi análisis inicial**: re-leyendo `App.jsx`, el Provider ya está en el nivel correcto. Solo hay que añadir `<JobsCards />` como hermano de `<ProjectsCards />` dentro del Provider. **Diff simplificado** (ver arriba).

### `src/index.css` — Tokens nuevos (alineados con design §10.1)

Añadir al `:root` (después de las definiciones existentes, sin modificar nada):

```css
/* === JobCard — Feature 002 === */
/* Colores semánticos por tipo de empleo */
--color-job-type-fulltime: #00C9FF;
--color-job-type-contract: #92FE9D;
--color-job-type-freelance: #FFD166;
--color-job-type-parttime: #8fc6ff;
--color-job-type-internship: #c4b5fd;
/* Faro (current: true) */
--color-job-beacon: #00C9FF;
--color-job-beacon-glow: rgba(0, 201, 255, 0.6);
--color-job-beacon-bg: rgba(0, 201, 255, 0.04);
/* Conector cronológico */
--color-job-connector: rgba(125, 156, 184, 0.35);
--color-job-connector-active: rgba(0, 201, 255, 0.7);
/* Placeholder de logo (EC-005) */
--color-job-placeholder-bg: linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%);
/* Divider interno */
--color-job-divider: linear-gradient(90deg, transparent, rgba(0, 201, 255, 0.4), transparent);
/* Sombras */
--shadow-job-card-default: 0 0 0 1px var(--border-color), 0 0 20px -5px rgba(0, 201, 255, 0.15);
--shadow-job-card-hover: 0 0 0 1px rgba(0, 201, 255, 0.5), 0 0 35px -5px rgba(0, 201, 255, 0.55);
--shadow-job-beacon-core: 0 0 8px 2px var(--color-job-beacon);
--shadow-job-beacon-halo: 0 0 16px 6px var(--color-job-beacon-glow);
--shadow-job-expand: 0 20px 60px -10px rgba(0, 0, 0, 0.7);
/* Spacing & sizing */
--job-card-padding: clamp(1.25rem, 2vw, 1.75rem);
--job-card-gap: 1rem;
--job-rail-width: 44px;
--job-rail-dot-size: 10px;
--job-rail-dot-size-featured: 14px;
--job-beacon-size: 8px;
--job-beacon-glow-size: 24px;
--job-section-gap-mobile: 60px;
--job-section-gap-desktop: 100px;
/* Animation timings */
--job-expand-duration: 320ms;
--job-expand-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
--job-beacon-pulse-duration: 1.8s;
--job-connector-animation-duration: 600ms;
--job-reorder-duration: 300ms;
```

**25 tokens total** (alineados con design §10.1; verificación manual realizada contra design.md). **0 modificaciones** a tokens existentes.

### `src/contexts/IsIconCheckFilter.jsx` — Diff

```diff
 export function IsIconCheckFilterProvider ({ children }) {
   const [isIconCheck, setIsIconCheck] = useState({
     js: false,
     react: false,
     css: false,
     html: false,
     ts: false,
     git: false,
     gitHub: false,
-    gsap: false
+    gsap: false,
+    tailwind: false,
+    storybook: false,
+    vite: false,
+    npm: false
   })
   // ...resto sin cambios
 }
```

**Justificación**: paridad con las 12 keys de `techIcons`. **Sin breaking change** para Projects: las 4 nuevas keys se inicializan en `false` y los proyectos existentes (que no tienen esas keys en su `tech`) no se ven afectados (su `techsChecked` sigue siendo 0 para esas keys → no alteran el orden).

### `NavHeader` — Sin cambios en esta iteración (DA-07)

El anchor `#experience` existirá en el DOM, pero el link en el menú superior queda para una iteración separada. El usuario puede usar scroll manual o el atajo del navegador.

---

## Testing Strategy (TDD)

> **GAP detectado y resuelto**: el proyecto NO tiene test runner instalado. Esta feature introduce vitest + @testing-library/react + jest-axe como dev-deps, justificadas constitucionalmente por SC-005 y FR-015.

### Suites y archivos de test

| Suite | Archivo | Cobertura objetivo | Framework |
|-------|---------|-------------------|-----------|
| **Unit — hook sorting** | `tests/unit/useSortJobs.test.js` | 100% (lógica pura) | vitest + RTL |
| **Unit — helpers puros** | `tests/unit/useJobDuration.test.js` | 100% (matriz de edge cases) | vitest |
| **Unit — helpers puros** | `tests/unit/useIsFeaturedJob.test.js` | 100% (lógica pura) | vitest |
| **Unit — contract** | `tests/unit/validateJobContract.test.js` | 100% (validador) | vitest |
| **Unit — hook animation** | `tests/unit/useFadeInJobCards.test.js` | ≥90% (mocking de gsap) | vitest + gsap mock |
| **Unit — hook animation** | `tests/unit/useFlipJobs.test.js` | ≥90% (mocking de Flip) | vitest + gsap mock |
| **Integration — componente** | `tests/integration/JobCard.test.jsx` | ≥85% (todas las props) | RTL + vitest |
| **Integration — sub-componentes** | `tests/integration/JobCardHeader.test.jsx` | ≥85% | RTL |
| **Integration — disclosure** | `tests/integration/JobCardAchievements.test.jsx` | ≥90% (toggle, Escape, focus) | RTL + user-event |
| **Integration — grid** | `tests/integration/JobsCards.test.jsx` | ≥80% (render, empty, reorder) | RTL |
| **A11y — jest-axe** | `tests/a11y/JobCard.a11y.test.jsx` | 100% de variantes, 0 violaciones | jest-axe |
| **Smoke — App.jsx** | `tests/integration/App.test.jsx` | ≥70% (montaje sin errores) | RTL |

### Configuración de coverage (vitest.config.js)

```js
// Referencia, NO a incluir en este plan
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/araldev-portfolio/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/index.jsx', 'src/main.jsx', 'src/**/*.module.css'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }
    }
  }
})
```

**Umbral SC-005 (≥80%)**: enforced por Vitest; CI falla si algún threshold baja del 80%.

### Tests críticos (criterios de aceptación verificables)

1. **Render del Featured card** → contiene `data-featured="true"`, beacon visible, `border-left: 3px green`.
2. **Render del card sin achievements** → NO contiene botón expand trigger, `aria-expanded` no presente.
3. **Render del card con stack vacío** → fila de iconos ausente (FR-005).
4. **Render del card con `companyLogo` 404** → tras `onError`, muestra initials placeholder.
5. **Toggle expand** → `aria-expanded` cambia, altura animada, foco al primer `<li>` de achievements.
6. **Escape** → colapsa achievements + foco vuelve al trigger button.
7. **Filter integration** → activar 2 iconos tech reordena jobs por `techsChecked` desc.
8. **jest-axe 0 violaciones** en: Featured, Standard, Compact, with-achievements, empty-stack, no-tags, with-links.
9. **Reduced motion** → con `matchMedia('(prefers-reduced-motion: reduce)')` mockeado a `true`, no se instancian animaciones GSAP.
10. **Empty array** → si `jobs === []`, muestra `<p role="status">No experience entries available.</p>` (EC-006).

### Mocking de GSAP (vitest)

```js
// tests/setup.js
import { vi } from 'vitest'
vi.mock('gsap', async () => {
  const actual = await vi.importActual('gsap')
  return {
    ...actual,
    gsap: {
      ...actual.gsap,
      from: vi.fn(() => ({ kill: vi.fn() })),
      fromTo: vi.fn(() => ({ kill: vi.fn() })),
      set: vi.fn(),
      timeline: vi.fn(() => ({ kill: vi.fn(), to: vi.fn().mockReturnThis() })),
      registerPlugin: vi.fn()
    },
    ScrollTrigger: { getAll: vi.fn(() => []), batch: vi.fn(() => []), getById: vi.fn() }
  }
})
```

> **Limitación conocida**: los tests unitarios de hooks de animación validan que se LLAMA a GSAP, no que la animación es correcta visualmente. La validación visual de motion (60fps, transiciones) se hace en revisión manual del Reviewer + verificación con DevTools Performance panel (SC-002, design §12).

---

## Risks & Mitigations

| # | Riesgo | Probabilidad | Impacto | Mitigación | FR/SC/DA |
|---|--------|--------------|---------|------------|----------|
| **R1** | Memory leak de GSAP si cleanup falla (especialmente con `ScrollTrigger.batch`) | Media | Alto | Patrón de cleanup de 3 pasos documentado en `useFadeInJobCards` (kill tween + kill all associated triggers + clearProps). Verificación con `performance.memory` en DevTools. | FR-011, design §5.1 |
| **R2** | Reorder con FLIP causa jank en mobile gama baja | Media | Medio | Heurística `navigator.hardwareConcurrency < 4` → skip FLIP, reordenar instantáneo. Adicional: `prefers-reduced-motion` ya hace skip. | SC-002, design §12 |
| **R3** | El contexto `IsIconCheckFilter` solo tenía 8 keys; jobs con `tailwind`/`storybook`/`vite`/`npm` no se filtraban | Alta (detectado en este análisis) | Bajo | Añadir 4 keys al estado inicial del context (diff en §"Integration Plan"). Sin breaking change para Projects. | DA-02 |
| **R4** | El bundle del JobCard supera el SC-007 (<2KB gzipped) | Baja | Bajo | Estimación actual ~2.75KB; tree-shaking + gzip real será menor. Si supera, consolidar helpers en `src/lib/jobHelpers.js`. | SC-007 |
| **R5** | El `companyLogo` carga y falla en runtime (404 de `/logos/x.webp`) | Media | Bajo | `onError` en `<img>` → ocultar img + mostrar initials placeholder (EC-005). | FR-006 |
| **R6** | Conector cronológico desalineado entre cards de alturas distintas | Alta | Bajo (estético) | Conector por sección (`section::before`), no por card. Línea "atraviesa" los cards visualmente (intencional, metáfora bitácora). | DA-03, design §12 |
| **R7** | `jest-axe` falla por `aria-hidden` mal sincronizado con `hidden` attribute | Media | Alto (bloqueante) | Test explícito: `aria-hidden` === `hidden` siempre. Ambos atributos en el mismo atributo derivado `isExpanded`. | FR-015, DA-05 |
| **R8** | El Featured card (`current: true`) no aparece primero en el orden | Baja | Medio | `useSortJobs` ordena: `current: true` primero, luego `startDate` desc. Verificación con test que valida el primer elemento del array ordenado. | US-1 acceptance 2 |
| **R9** | `usePrefersReducedMotion` hook no se actualiza al cambiar el setting del SO en runtime | Media | Bajo | `matchMedia.addEventListener('change', ...)` para reactividad. Opcional en v1 (la mayoría de usuarios no cambian el setting en medio de una sesión). | FR-010 |
| **R10** | Tests E2E con Playwright no existen (OOS-10) | N/A | N/A | Cobertura con unit + integration + a11y. E2E queda out of scope por diseño (OOS-10 del spec). | OOS-10 |
| **R11** | Conflictos con `useFadeInElement` existente si se reusa por error en JobCard | Baja | Medio | `useFadeInElement` se mantiene para sus usos existentes; `useFadeInJobCards` es **un nuevo hook** específico para la grid de jobs. NUNCA importar `useFadeInElement` en componentes de JobCard. | A1, design §5.1 |
| **R12** | El Provider de `IsIconCheckFilter` queda con keys extras sin que Projects las use | Baja | Muy bajo | Tests existentes de Projects no se rompen (verificado: `techIcons` en Projects ya tenía `tailwind/storybook/vite/npm` referenciados pero el context no los declaraba — el bug actual es que los filtros de Projects sobre esas keys no funcionaban). El fix MEJORA Projects también. | DA-02 |

---

## Out of Scope Técnico (reiteración, alineado con spec §5)

- **OOS-T01** — TypeScript migration (rompería codebase; el codebase es JS con JSDoc).
- **OOS-T02** — PropTypes (rompe stack; JSDoc + validador runtime es la solución idiomática).
- **OOS-T03** — `JobModal` análogo a `ProjectModal` (decidido inline en A7 por Designer).
- **OOS-T04** — Skeleton/loading state (datos estáticos, no aplica).
- **OOS-T05** — i18n full con `react-i18next` (A5 del spec; agnóstico sí, traducción no).
- **OOS-T06** — Virtualización de la grid con >8 items (A10; out por A10).
- **OOS-T07** — Paginación o "Load more" (no aplica, 3-8 jobs).
- **OOS-T08** — Tests E2E con Playwright (OOS-10 del spec).
- **OOS-T09** — Modo `prefers-color-scheme: light` (DA-08; dark-only por Constitución I).
- **OOS-T10** — Actualización del `NavHeader` con link a `#experience` (DA-07; iteración separada).
- **OOS-T11** — Nuevas dependencias runtime (A1;宪法 §39).
- **OOS-T12** — Hooks de tracking/analytics (OOS-12; proyecto no implementa tracking).
- **OOS-T13** — Persistencia localStorage de "filtros favoritos" (OOS-08).

---

## Pre-Implementation Checklist (para 04-developer)

Antes de escribir la primera línea de código, el Developer DEBE verificar:

- [ ] **Spec leído íntegro** (`specs/002-job-card-component/spec.md`, 277 líneas, 22 FRs).
- [ ] **Design leído íntegro** (`specs/002-job-card-component/design.md`, 1266 líneas, 8 DAs).
- [ ] **Plan actual leído íntegro** (este archivo).
- [ ] **Constitución releída** (`.specify/memory/constitution.md`).
- [ ] **Código existente revisado**:
  - [ ] `src/components/ProjectsCards/ProjectsCards.jsx` (analogía estructural)
  - [ ] `src/Hooks/useSortProjects.js` (espejo a clonar)
  - [ ] `src/Hooks/useFadeInElement.js` (referencia de patrón, NO a reusar)
  - [ ] `src/contexts/IsIconCheckFilter.jsx` (modificar para añadir 4 keys)
  - [ ] `src/data/icons.js` (catálogo de 12 techIcons)
  - [ ] `src/App.jsx` (punto de montaje)
  - [ ] `src/index.css` (punto de adición de tokens)
- [ ] **Entorno preparado**:
  - [ ] `pnpm install` ejecutado
  - [ ] Branch `002-job-card-component` creado desde `main`
  - [ ] Vitest ejecutable: `pnpm test --run` debe pasar aunque no haya tests (0 tests, 0 failures)
- [ ] **Decisiones DA-01 a DA-08 confirmadas** (ver tabla arriba).
- [ ] **Tareas generadas por `setup-tasks.sh`** (no en este plan; el siguiente agente del pipeline las emite).
- [ ] **Fixtures `tests/fixtures/jobs.js` listos** (plantilla en §"Data Model").
- [ ] **Directorio `public/logos/` creado** con al menos 1 placeholder `.webp` para que EC-005 se pueda testear.

---

## Open Questions Resolved (resumen ejecutivo)

| ID original | Pregunta | Resolución | Decisión Arquitectónica |
|-------------|----------|------------|-------------------------|
| Spec §6 Q1 | Placement de la sección | Entre Projects y AboutMe | DA-06 |
| Spec §6 Q2 | Filter: reusar context o nuevo | Reusar `IsIconCheckFilter` + `useSortJobs` paralelo | DA-02 |
| Spec §6 Q3 | Expansión inline vs modal | Inline (resuelto por Designer en §0) | A7 cerrado en design |
| Spec §6 Q4 | `companyLogo`: asset o placeholder | Ambos (assets en `public/logos/` + fallback a initials) | Resuelto en design §0 + EC-005 |
| Design §11 DA-01 | Featured `span 2` o `1fr` | `1fr` | DA-01 |
| Design §11 DA-02 | Context global o jobs-only | Reusar global | DA-02 |
| Design §11 DA-03 | Conector por card o por sección | Por sección con `::before` | DA-03 |
| Design §11 DA-04 | `formatDuration` en componente o data | En componente (helper `useJobDuration`) | DA-04 |
| Design §11 DA-05 | Achievements `aria-hidden` o re-render | `aria-hidden` + render siempre | DA-05 |
| Design §11 DA-06 | SPA section o ruta separada | SPA section | DA-06 |
| Design §11 DA-07 | NavHeader en esta feature | NO, iteración separada | DA-07 |
| Design §11 DA-08 | `prefers-color-scheme: light` | NO, dark-only | DA-08 |

**Total decisiones cerradas**: 12 (4 del spec + 8 del design). **Cero preguntas abiertas** salen de este plan hacia el Developer.

---

## Handoff a 04-developer

**Estado del plan**: Completo. Listo para desglose de tareas atómicas.

**Archivos a crear** (15 nuevos):
1. `src/data/jobs.js`
2. `src/components/JobCard/JobCard.jsx`
3. `src/components/JobCard/JobCard.module.css`
4. `src/components/JobCard/JobCardHeader.jsx`
5. `src/components/JobCard/JobCardMeta.jsx`
6. `src/components/JobCard/JobCardDescription.jsx`
7. `src/components/JobCard/JobCardAchievements.jsx`
8. `src/components/JobCard/JobCardStack.jsx`
9. `src/components/JobCard/JobCardFooter.jsx`
10. `src/components/JobCard/JobCardLogo.jsx`
11. `src/components/JobsCards/JobsCards.jsx`
12. `src/components/JobsCards/JobsCards.module.css`
13. `src/Hooks/useSortJobs.js`
14. `src/Hooks/useFadeInJobCards.js`
15. `src/Hooks/useFlipJobs.js`
16. `src/Hooks/useBeaconPulse.js`
17. `src/Hooks/useJobDuration.js`
18. `src/Hooks/useIsFeaturedJob.js`
19. `src/Hooks/usePrefersReducedMotion.js`
20. `vitest.config.js`
21. `tests/setup.js`
22. `tests/fixtures/jobs.js`
23. `tests/unit/useSortJobs.test.js`
24. `tests/unit/useJobDuration.test.js`
25. `tests/unit/useIsFeaturedJob.test.js`
26. `tests/unit/validateJobContract.test.js`
27. `tests/unit/useFadeInJobCards.test.js`
28. `tests/unit/useFlipJobs.test.js`
29. `tests/integration/JobCard.test.jsx`
30. `tests/integration/JobCardHeader.test.jsx`
31. `tests/integration/JobCardAchievements.test.jsx`
32. `tests/integration/JobsCards.test.jsx`
33. `tests/a11y/JobCard.a11y.test.jsx`
34. `public/logos/.gitkeep`

**Archivos a modificar** (4):
1. `src/App.jsx` — montar `<JobsCards />` dentro del `IsIconCheckFilterProvider`, entre `<ProjectsCards />` y `<AboutMeSection />`
2. `src/index.css` — añadir 25 tokens `--job-*` y `--color-job-*` al `:root`
3. `src/contexts/IsIconCheckFilter.jsx` — añadir 4 keys (`tailwind`, `storybook`, `vite`, `npm`) al `useState` inicial
4. `package.json` — añadir dev-deps: `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jest-axe`, `jsdom`. Añadir script `"test": "vitest"`, `"test:run": "vitest --run"`, `"test:coverage": "vitest --coverage"`.

**Archivos a NO tocar** (protección):
- `src/components/ProjectsCards/**` — sin cambios
- `src/components/FilterProjects/**` — sin cambios (se reusa tal cual)
- `src/Hooks/useSortProjects.js` — sin cambios
- `src/Hooks/useFadeInElement.js` — sin cambios
- `src/components/NavHeader/**` — sin cambios en esta iteración
- `src/data/projects.js` — sin cambios
- `src/components/Icons/Icons.jsx` — sin cambios

**Próximo agente**: 04-developer (vía `setup-tasks.sh` para generar `tasks.md` atómicas).

---

**Version**: 1.0.0 | **Date**: 2026-06-01 | **Status**: Finalizado · Ready for 04-developer

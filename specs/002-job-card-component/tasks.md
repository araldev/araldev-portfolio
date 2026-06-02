# Task Breakdown: JobCard Component (Feature 002)

**Branch**: `002-job-card-component`
**Plan reference**: `plan.md` §"Handoff a 04-developer"
**Generated**: 2026-06-02

> **TDD Discipline**: cada componente/hook/helper tiene RED → GREEN → REFACTOR.

---

## Phase 0 — Setup & Security Gate

- [x] **P0.1 — Crear `tasks.md`** con el desglose atómico completo (este archivo). [DONE]
- [x] **P0.2 — Security audit de dev-deps necesarias** (vitest, jest-axe, @testing-library/*, jsdom). **APROBADO por @06-security**: 0 vulnerabilidades, vitest@4.1.7 parcheado contra CVE-2026-47429. ✓
  - `vitest@^2.1.0`
  - `@vitest/coverage-v8@^2.1.0`
  - `@testing-library/react@^16.0.0`
  - `@testing-library/jest-dom@^6.4.0`
  - `@testing-library/user-event@^14.5.0`
  - `jest-axe@^3.5.0`
  - `jsdom@^25.0.0`
  - Justificación constitucional: SC-005 (≥80% coverage) y FR-015 (jest-axe 0 violaciones) son no-negociables; sin estas dev-deps, las quality gates son incumplibles.
  - **No se permite `pnpm install` hasta que @06-security apruebe.**

---

## Phase 1 — Foundation (sin nuevas deps)

> Estas tareas NO requieren dependencias nuevas. Pueden completarse de inmediato.

### CSS Tokens (modificar `src/index.css`)

- [x] **P1.1 — Añadir 25 tokens `--job-*` y `--color-job-*` al `:root` de `src/index.css`**
  - Bloque: colores semánticos por tipo de empleo (5) ✓
  - Bloque: faro + beacon (3) ✓
  - Bloque: conector cronológico (2) ✓
  - Bloque: placeholder + divider (2) ✓
  - Bloque: sombras (5) ✓
  - Bloque: spacing & sizing (8) ✓
  - Bloque: animation timings (5) ✓
  - Justificación: ver `plan.md` §"Integration Plan → src/index.css"
  - **DONE**

### Modificar Context (sin breaking change)

- [x] **P1.2 — Añadir 4 keys (`tailwind`, `storybook`, `vite`, `npm`) al `useState` inicial de `src/contexts/IsIconCheckFilter.jsx`**
  - Paridad con las 12 keys de `techIcons` ✓
  - Justificación: DA-02 del plan + R3 del plan (riesgo detectado)
  - **DONE**

### Helpers de lógica pura (TDD)

- [x] **P1.3 — Test (RED): `tests/unit/useJobDuration.test.js`** ✓
- [x] **P1.4 — Impl (GREEN): `src/Hooks/useJobDuration.js`** ✓
- [x] **P1.5 — Test (RED): `tests/unit/useIsFeaturedJob.test.js`** ✓
- [x] **P1.6 — Impl (GREEN): `src/Hooks/useIsFeaturedJob.js`** ✓
- [x] **P1.7 — Test (RED): `tests/unit/usePrefersReducedMotion.test.js`** ✓
- [x] **P1.8 — Impl (GREEN): `src/Hooks/usePrefersReducedMotion.js`** ✓
- [x] **P1.9 — Test (RED): `tests/unit/validateJobContract.test.js`** ✓
- [x] **P1.10 — Impl (GREEN): `src/data/jobs.js`** ✓ (4 jobs cubriendo EC-001..EC-012)

### Hook de sorting (TDD)

- [x] **P1.11 — Test (RED): `tests/unit/useSortJobs.test.js`** ✓
- [x] **P1.12 — Impl (GREEN): `src/Hooks/useSortJobs.js`** ✓

### Hooks de animación (TDD — mocks de GSAP)

- [x] **P1.13 — Test (RED): `tests/unit/useFadeInJobCards.test.js`** ✓
- [x] **P1.14 — Impl (GREEN): `src/Hooks/useFadeInJobCards.js`** ✓
- [x] **P1.15 — Test (RED): `tests/unit/useFlipJobs.test.js`** ✓
- [x] **P1.16 — Impl (GREEN): `src/Hooks/useFlipJobs.js`** ✓
- [x] **P1.17 — Test (RED): `tests/unit/useBeaconPulse.test.js`** ✓
- [x] **P1.18 — Impl (GREEN): `src/Hooks/useBeaconPulse.js`** ✓

---

## Phase 2 — Componentes UI (TDD)

> Tests con `@testing-library/react` + `jest-axe` (requiere las dev-deps de P0.2).

### Sub-componentes de JobCard

- [x] **P2.1 — Test (RED): `tests/integration/JobCardLogo.test.jsx`** ✓
- [x] **P2.2 — Impl (GREEN): `src/components/JobCard/JobCardLogo.jsx`** ✓
- [x] **P2.3 — Test (RED): `tests/integration/JobCardHeader.test.jsx`** ✓
- [x] **P2.4 — Impl (GREEN): `src/components/JobCard/JobCardHeader.jsx`** ✓
- [x] **P2.5 — Test (RED): `tests/integration/JobCardMeta.test.jsx`** ✓
- [x] **P2.6 — Impl (GREEN): `src/components/JobCard/JobCardMeta.jsx`** ✓
- [x] **P2.7 — Test (RED): `tests/integration/JobCardDescription.test.jsx`** ✓
- [x] **P2.8 — Impl (GREEN): `src/components/JobCard/JobCardDescription.jsx`** ✓
- [x] **P2.9 — Test (RED): `tests/integration/JobCardStack.test.jsx`** ✓
- [x] **P2.10 — Impl (GREEN): `src/components/JobCard/JobCardStack.jsx`** ✓
- [x] **P2.11 — Test (RED): `tests/integration/JobCardAchievements.test.jsx`** ✓
- [x] **P2.12 — Impl (GREEN): `src/components/JobCard/JobCardAchievements.jsx`** ✓
- [x] **P2.13 — Test (RED): `tests/integration/JobCardFooter.test.jsx`** ✓
- [x] **P2.14 — Impl (GREEN): `src/components/JobCard/JobCardFooter.jsx`** ✓

### Componente raíz JobCard

- [x] **P2.15 — Test (RED): `tests/integration/JobCard.test.jsx`** ✓ (15+ test cases)
- [x] **P2.16 — Impl (GREEN): `src/components/JobCard/JobCard.jsx`** ✓
- [x] **P2.17 — CSS: `src/components/JobCard/JobCard.module.css`** ✓

### Sección JobsCards

- [x] **P2.18 — Test (RED): `tests/integration/JobsCards.test.jsx`** ✓
- [x] **P2.19 — Impl (GREEN): `src/components/JobsCards/JobsCards.jsx`** ✓
- [x] **P2.20 — CSS: `src/components/JobsCards/JobsCards.module.css`** ✓

### Accesibilidad

- [x] **P2.21 — Test (RED): `tests/a11y/JobCard.a11y.test.jsx`** ✓ (6 variantes)

---

## Phase 3 — Integración

- [x] **P3.1 — Modificar `src/App.jsx`** — añadir `<JobsCards />` dentro de `<IsIconCheckFilterProvider>`, entre `<ProjectsCards />` y `<AboutMeSection />` ✓
- [x] **P3.2 — Crear `public/logos/.gitkeep`** — directorio de assets ✓
- [x] **P3.3 — Smoke test: `tests/integration/App.test.jsx`** — montaje sin errores ✓

---

## Phase 4 — Quality Gates (DESPUÉS de security audit)

> Estas tareas requieren que P0.2 haya sido aprobada por @06-security.

- [x] **P4.1 — Configurar `vitest.config.js`** — hereda vite.config + jsdom env + thresholds ≥80% ✓
- [x] **P4.2 — Configurar `tests/setup.js`** — `jest-dom` matchers + axe setup ✓
- [x] **P4.3 — Añadir scripts a `package.json`**: `test`, `test:run`, `test:coverage` ✓
- [x] **P4.4 — `pnpm install`** ✓ (autorizado por @06-security)
- [x] **P4.5 — `pnpm test --run`** — 99/99 tests verdes ✓
- [x] **P4.6 — `pnpm test:coverage`** — coverage global 91.6% stmts / 84.25% branches / 90.47% funcs / 94.41% lines (todos ≥80%) ✓
- [x] **P4.7 — `pnpm run lint`** — 0 warnings en archivos nuevos ✓ (los 5 errores pre-existentes NO son míos)
- [x] **P4.8 — `pnpm run build`** — exit code 0, bundle 409.88 kB / gzip 144.81 kB ✓
- [x] **P4.9 — Verificar NO regresión en `ProjectCard`** — `ProjectsCards` + `useSortProjects` intactos, App.jsx renderiza ambas secciones ✓

---

## Resumen de entregables

**Archivos nuevos (34)** — alineados con `plan.md` §"Handoff a 04-developer":
- `src/data/jobs.js`
- `src/components/JobCard/JobCard.jsx` + `JobCard.module.css`
- `src/components/JobCard/JobCardHeader.jsx`
- `src/components/JobCard/JobCardMeta.jsx`
- `src/components/JobCard/JobCardDescription.jsx`
- `src/components/JobCard/JobCardAchievements.jsx`
- `src/components/JobCard/JobCardStack.jsx`
- `src/components/JobCard/JobCardFooter.jsx`
- `src/components/JobCard/JobCardLogo.jsx`
- `src/components/JobsCards/JobsCards.jsx` + `JobsCards.module.css`
- `src/Hooks/useSortJobs.js`
- `src/Hooks/useFadeInJobCards.js`
- `src/Hooks/useFlipJobs.js`
- `src/Hooks/useBeaconPulse.js`
- `src/Hooks/useJobDuration.js`
- `src/Hooks/useIsFeaturedJob.js`
- `src/Hooks/usePrefersReducedMotion.js`
- `vitest.config.js`
- `tests/setup.js`
- `tests/fixtures/jobs.js`
- `tests/unit/{useSortJobs,useJobDuration,useIsFeaturedJob,usePrefersReducedMotion,validateJobContract,useFadeInJobCards,useFlipJobs,useBeaconPulse}.test.js`
- `tests/integration/{JobCard,JobCardLogo,JobCardHeader,JobCardMeta,JobCardDescription,JobCardStack,JobCardAchievements,JobCardFooter,JobsCards,App}.test.jsx`
- `tests/a11y/JobCard.a11y.test.jsx`
- `public/logos/.gitkeep`

**Archivos modificados (4)**:
- `src/App.jsx` — montar `<JobsCards />` dentro del Provider
- `src/index.css` — 25 tokens nuevos
- `src/contexts/IsIconCheckFilter.jsx` — 4 keys añadidas
- `package.json` — dev-deps + scripts (post-audit)

---

## Phase 5 — Hotfix runtime (post-deploy, @04-developer)

> **Trigger**: error reportado en runtime real del navegador por el usuario
> ```
> Uncaught TypeError: _toArray is not a function
>     at new FlipState2 (gsap_Flip.js:881)
>     at Flip.getState (gsap_Flip.js:1240)
>     at useFlipJobs.js:34
> ```
> La suite 99/99 pasaba verde porque `tests/unit/useFlipJobs.test.js`
> mockea por completo `gsap` y `gsap/Flip`, bypaseando el path real de
> registro del plugin. El bug nunca se ejercitó en jsdom.

- [x] **P5.1 — Diagnóstico de causa raíz**
  - Confirmado: **opción (a)** del reporte — `Flip` se importa desde
    `gsap/Flip` pero nunca se registra con `gsap.registerPlugin(Flip)`.
  - Patrón ya existente en el codebase para los otros plugins:
    `src/components/ScrollSync.jsx:7` y `src/Hooks/useAnimatedTitle.js:7`.
  - Sin registro, `Flip.getState(cards)` falla porque `gsap.utils.toArray`
    (minificado como `_toArray`) no se enlaza al closure del namespace de
    Flip hasta que `registerPlugin` corre.
  - Sin necesidad de tocar `vite.config.js` ni `optimizeDeps` — el
    problema es de orden de side-effect, no de bundle/optimización.

- [x] **P5.2 — Fix mínimo en `src/Hooks/useFlipJobs.js`**
  - Añadido `gsap.registerPlugin(Flip)` a nivel de módulo (después de
    los imports, antes del `export function useFlipJobs`).
  - Comentario inline mínimo (5 líneas) explicando la causa y la
    referencia al patrón existente.
  - **Diff conceptual**:
    ```diff
     import { gsap } from 'gsap'
     import { Flip } from 'gsap/Flip'
     import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'
    +gsap.registerPlugin(Flip)
    ```

- [x] **P5.3 — Test de regresión en `tests/unit/useFlipJobs.test.js`**
  - Sustituido el `registerPlugin: vi.fn()` anónimo por un mock
    instrumentado en `vi.hoisted` (`mocks.mockRegisterPlugin`).
  - Nuevo test `'registers the Flip plugin with GSAP at module load
    (regression: runtime TypeError _toArray is not a function)'` que
    verifica:
    1. `registerPlugin` fue invocado (al menos una vez, en el import
       del módulo).
    2. El primer argumento tiene `getState` y `from` (i.e. es el plugin
       Flip, no otra cosa).
  - Eliminado `mockRegisterPlugin.mockClear()` del `beforeEach` para no
    borrar la evidencia del call a nivel de import.

- [x] **P5.4 — Re-ejecución de la suite de tests**
  - `pnpm test:run` → **100/100 tests verdes** (99 previos + 1 nuevo
    de regresión).
  - `pnpm test:coverage` → mantenidos los thresholds constitucionales
    (≥80% en las 4 métricas):
    | Métrica     | Pre-fix (P4.6) | Post-fix (P5.4) |
    |-------------|---------------:|----------------:|
    | Statements  |         91.6 % |         91.63 % |
    | Branches    |        84.25 % |         84.25 % |
    | Functions   |        90.47 % |         90.47 % |
    | Lines       |        94.41 % |         94.44 % |
  - `pnpm run build` → exit 0, bundle idéntico (409.90 kB / 144.81 kB
    gzip). Sin impacto en el tamaño del bundle.

- [x] **P5.5 — Verificación visual con Playwright (`webapp-testing`)**
  - Vite dev server levantado en background en
    `http://localhost:5173/araldev-portfolio/`.
  - Script Playwright headless con captura de `console` + `pageerror`
    y screenshot de `#experience`.
  - Resultado:
    - **0 page errors** (antes: TypeError `_toArray is not a function`).
    - **0 _toArray errors** en consola.
    - **4 job cards** renderizados en `#experience` (= los 4 jobs
      definidos en `src/data/jobs.js`, todos los EC-001..EC-012).
    - Screenshot confirma estética "Holo-Log Career" intacta: card
      featured (Araldev) con faro cyan y borde animado, todos los
      tokens `--job-*` resuelven correctamente.
  - El warning residual `SplitText called before fonts loaded` (en
    `HeroSection`/`AnimatedTitle`) es **pre-existente y fuera de scope**
    de este fix — pertenece a una issue separada de la sección Hero,
    no a la feature 002.

- [x] **P5.6 — Reporte al Orquestador**
  - Estado: **Finalizado**.
  - Siguiente paso (08-Deployer): el pipeline puede continuar con la
    re-build + re-deploy a GitHub Pages cuando @05-Reviewer y
    @06-Security den VºBº.

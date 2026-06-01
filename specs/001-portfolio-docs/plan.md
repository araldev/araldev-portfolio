# Implementation Plan: araldev-portfolio

**Branch**: `001-portfolio-docs` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-portfolio-docs/spec.md` and design from `/specs/001-portfolio-docs/design.md`

## Summary

Portfolio web estático del desarrollador Frontend Arturo Alba García (Araldev). Es una SPA React con animaciones scroll-triggered mediante GSAP ScrollTrigger, smooth scroll con Lenis, formulario de contacto vía EmailJS con reCAPTCHA invisible, y sistema de filtrado de proyectos por tecnología. El portfolio cumple todos los requisitos funcionales del spec.md: animación de entrada dramática con SVG mask reveal, navegación sticky con hide/show basado en dirección de scroll, modal de proyecto con pausado de Lenis, y diseño responsive mobile-first.

## Technical Context

**Language/Version**: JavaScript ES2022+ (React 18.3.1)

**Primary Dependencies**:
- `react`: 18.3.1 — UI framework
- `react-dom`: 18.3.0 — DOM rendering
- `gsap`: 3.13.0 — Animations & ScrollTrigger
- `lenis`: 1.3.3 — Smooth scroll with React integration
- `@emailjs/browser`: 4.4.1 — Email sending service
- `react-google-recaptcha`: 3.1.0 — Invisible CAPTCHA
- `@fontsource/roboto`: 5.2.6 — Font loading

**Build Tool**: Vite 6.3.5

**Storage**: N/A — Portfolio estático, sin base de datos. Datos de proyectos en `src/data/projects.js`

**Testing**: Standard (ESLint 17.1.2 con StandardJS config)

**Target Platform**: Navegadores modernos (Chrome, Firefox, Safari, Edge) — desktop y mobile

**Project Type**: SPA (Single Page Application) — portfolio estático con GitHub Pages deployment

**Performance Goals**:
- Initial load < 3s en 3G
- 60fps para animaciones GSAP
- Filter response < 100ms
- Modal animation 400-600ms

**Constraints**:
- Sin SSR/SSG — SPA pura
- Graceful degradation de animaciones sin JS
- Mobile-first responsive design

**Scale/Scope**: 3 proyectos estáticos, 8 tecnologías filtrables, 1 formulario de contacto

## Constitution Check

La constitución en `.specify/memory/constitution.md` está vacía (plantilla). No hay gates que verificar para esta fase de documentación.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-docs/
├── plan.md              # Este archivo
├── research.md          # N/A — sin dependencias de investigación
├── data-model.md        # N/A — sin base de datos
├── quickstart.md        # N/A — proyecto existente
├── contracts/           # N/A — sin contratos API externos
└── tasks.md             # Generado por setup-tasks.sh
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── AboutMe/
│   │   ├── AboutMeSection.jsx
│   │   └── AboutMeSection.module.css
│   ├── AnimatedTitle/
│   │   ├── AnimatedTitle.jsx
│   │   ├── AnimatedTitle.module.css
│   │   └── titles.js
│   ├── Backgrounds/
│   │   ├── BackgroundHero.jsx
│   │   ├── BackgroundHero.module.css
│   │   ├── BackgroundHeroCanvas.jsx
│   │   └── BackgroundHeroCanvas.module.css
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.module.css
│   ├── Contact/
│   │   ├── ContactSection.jsx
│   │   └── ContactSection.module.css
│   ├── FilterProjects/
│   │   ├── FilterProjects.jsx
│   │   └── FilterProjects.module.css
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   └── Footer.module.css
│   ├── HeroSection/
│   │   ├── HeroSection.jsx
│   │   └── HeroSection.module.css
│   ├── Icons/
│   │   └── Icons.jsx              # SVG icons library
│   ├── LinkButton/
│   │   ├── LinkButton.jsx
│   │   └── LinkButton.module.css
│   ├── NavHeader/
│   │   ├── NavHeader.jsx
│   │   └── NavHeader.module.css
│   ├── NavToTop/
│   │   ├── NavToTop.jsx
│   │   └── NavToTop.module.css
│   ├── ProjectModal/
│   │   ├── ProjectModal.jsx
│   │   └── ProjectModal.module.css
│   └── ProjectsCards/
│       ├── ProjectsCards.jsx
│       └── ProjectsCards.module.css
├── contexts/
│   └── IsIconCheckFilter.jsx      # Filter state context
├── data/
│   ├── icons.js                   # Icon exports
│   ├── iconsVariables.js
│   └── projects.js                # Static project data
├── Hooks/
│   ├── useAnimatedNavHeader.js    # Nav show/hide on scroll
│   ├── useAnimatedNavToTop.js     # NavToTop visibility
│   ├── useAnimatedTitle.js        # GSAP title animation
│   ├── useFadeInElement.js        # Generic fade-in hook
│   ├── useFadeInText.js           # Text reveal hook
│   ├── useIsIconCheckFilter.js    # Filter context consumer
│   ├── useNavPaths.js            # Navigation paths
│   ├── useNavToTopPath.js        # Scroll to top logic
│   ├── usePreloadImg.js          # Image preloading
│   ├── useSendEmailJs.js         # EmailJS integration
│   └── useSortProjects.js        # Project sorting/filtering
├── assets/
│   ├── yo-sin-fondo-M.webp       # Profile image (mobile)
│   ├── yo-sin-fondo-L.webp       # Profile image (desktop)
│   ├── brand-araldev.webp        # Brand logo
│   ├── brand-araldev-miniatura.webp # Nav logo
│   ├── screenshot-v12-ui.png     # Project screenshot
│   ├── screenshot-web-game.png   # Project screenshot
│   └── shot-english-web.webp     # Project screenshot
├── App.jsx                        # Root component
├── index.css                     # Global styles & CSS variables
└── index.jsx                     # Entry point with Lenis provider

public/
└── cv-araldev.pdf               # CV download file

.env                              # Environment variables (dev)
.env.local                        # (production, gitignored)
```

**Structure Decision**: Single React SPA sin monorepo ni paquetes separados. Arquitectura modular por componentes con CSS Modules para scoping de estilos. Context API para estado global de filtros.

## Architecture Overview

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.jsx                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ReactLenis Provider (Lenis smooth scroll instance)      │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  ScrollSync (GSAP ↔ Lenis RAF sync)                 │ │   │
│  │  │  ┌─────────────────────────────────────────────────┐│ │   │
│  │  │  │  App.jsx                                        ││ │   │
│  │  │  │  ├── IsIconCheckFilterProvider (Context)        ││ │   │
│  │  │  │  │   └── ProjectsCards → FilterProjects        ││ │   │
│  │  │  │  ├── AnimatedTitle (GSAP ScrollTrigger pin)    ││ │   │
│  │  │  │  ├── HeroSection                                ││ │   │
│  │  │  │  ├── AboutMeSection                             ││ │   │
│  │  │  │  ├── ContactSection → useSendEmailJs → EmailJS ││ │   │
│  │  │  │  └── Footer                                     ││ │   │
│  │  │  └─────────────────────────────────────────────────┘│ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── NavHeader (fixed, animated show/hide)
├── NavToTop (fixed, appears on scroll threshold)
├── AnimatedTitle (GSAP pinned scroll animation)
│   └── HeroSection
├── main (container_main)
│   ├── IsIconCheckFilterProvider
│   │   └── ProjectsCards
│   │       ├── FilterProjects (tech filter bar)
│   │       └── ProjectCard[] → ProjectModal (portal)
│   ├── AboutMeSection
│   ├── ContactSection (EmailJS + reCAPTCHA)
│   └── BackgroundHeroCanvas (decorative)
└── Footer
```

### Key Architectural Patterns

**1. GSAP + Lenis Integration** (`ScrollSync.jsx`):
- GSAP ticker syncs with Lenis RAF
- `gsap.ticker.lagSmoothing(0)` prevents jank
- ScrollTrigger updates on each frame
- Proper cleanup on unmount

**2. Modal Scroll Lock** (`ProjectModal.jsx`):
- Lenis paused via `lenis.stop()` on modal open
- Body overflow hidden to prevent background scroll
- Escape key listener for accessibility
- Portal rendering to `document.body`

**3. Filter State Management** (`IsIconCheckFilter.jsx`):
- React Context for global filter state
- `useSortProjects` hook consumes context and re-sorts projects
- Projects sorted by number of matching technologies (descending)

**4. Animation Cleanup**:
- All `useEffect` hooks return cleanup functions
- `ScrollTrigger.getById('id').kill()` for named triggers
- `gsap.timeline().kill()` for animation timelines
- `IntersectionObserver.disconnect()` for scroll observations

### External Service Integration

**EmailJS** (`useSendEmailJs.js`):
```javascript
// Environment variables required:
VITE_EMAILJS_PUBLIC_KEY   // EmailJS public key
VITE_EMAILJS_SERVICE_ID   // GmailSMTP
VITE_EMAILJS_TEMPLATE_ID  // ContactUs template
```

**Google reCAPTCHA** (`ContactSection.jsx`):
```javascript
// Environment variable required:
VITE_RECAPTCHA_INVISIBLE_SITE_KEY  // Invisible CAPTCHA site key
```

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS authentication | `QEtH4wqiDz-2S7rkS` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service identifier | `GmailSMTP` |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS email template | `ContactUs` |
| `VITE_RECAPTCHA_INVISIBLE_SITE_KEY` | Google reCAPTCHA v3 | `6LcpSmMrAAAAAOlhls...` |

## Complexity Tracking

N/A — Sin violaciones de constitución. El portfolio es un proyecto existente documentado, no una implementación nueva.

## API Contracts (N/A)

El portfolio no consume APIs externas más allá de:
- **EmailJS**: Servicio de email transaccional (envío de formulario)
- **Google reCAPTCHA**: Servicio de verificación CAPTCHA (anti-spam)

Ambos servicios usan SDKs client-side (`@emailjs/browser`, `react-google-recaptcha`) con configuración via environment variables.

## Data Model

### Project Entity

```javascript
Project {
  id: number,
  imgSrc: string,              // URL to project screenshot
  title: string,               // Project name
  description: string[],       // Array of description paragraphs
  tech: {                      // Object with tech icons as ReactNodes
    [techKey: string]: ReactNode
  },
  links: {
    npmLink?: string,          // Optional npm package URL
    storybookLink?: string,    // Optional Storybook URL
    demoLink?: string,         // Optional live demo URL
    codeLink?: string          // GitHub repository URL
  },
  details: Detail[]            // Modal detail sections
}

Detail {
  id: string,                  // UUID generated at build
  imgIndex: number,            // Index into mockDetailImages array
  featureTag?: string,         // Optional feature tag label
  title: string,               // Detail section title
  text: string                 // Detail section description
}

mockDetailImages: Array<{
  gradient: string,            // CSS gradient string
  pattern: 'grid' | 'dots' | 'waves' | 'circles' | 'diagonal'
}>
```

### Filter State

```javascript
IsIconCheckFilterContext {
  isIconCheck: {
    js: boolean,
    react: boolean,
    css: boolean,
    html: boolean,
    ts: boolean,
    git: boolean,
    gitHub: boolean,
    gsap: boolean
  },
  setIsIconCheck: React.Dispatch<React.SetStateAction<...>>
}
```

### Contact Form Data

```javascript
ContactForm {
  name: string,                // Required
  email: string,               // Required, validated email format
  subject: string,             // Required
  message: string,            // Required
  time: string,                // Auto-generated: locale datetime
  'g-recaptcha-response': string // Token from reCAPTCHA v3
}
```

## File Responsibilities

| File | Responsibility |
|------|----------------|
| `index.jsx` | Lenis provider setup, app entry point |
| `ScrollSync.jsx` | GSAP/Lenis RAF synchronization |
| `App.jsx` | Root component, layout composition |
| `useAnimatedTitle.js` | GSAP ScrollTrigger title reveal animation |
| `useAnimatedNavHeader.js` | NavHeader show/hide based on scroll direction |
| `useAnimatedNavToTop.js` | NavToTop visibility based on scroll position |
| `useSortProjects.js` | Project filtering and sorting logic |
| `useSendEmailJs.js` | EmailJS send wrapper with error handling |
| `ProjectModal.jsx` | Portal-based modal with GSAP animations |
| `AnimatedTitle.jsx` | Title overlay section with SVG mask |

## Deployment

- **Host**: GitHub Pages
- **Base path**: `/araldev-portfolio/`
- **Build command**: `pnpm build` → `vite build`
- **Deploy command**: `pnpm deploy` → `vite build && gh-pages -d dist`
- **Assets**: Public directory served as static files

## Dependencies Diagram

```
react@18.3.1
├── react-dom@18.3.0
├── gsap@3.13.0
│   └── ScrollTrigger (bundled with gsap)
│   └── SplitText (bundled with gsap, registered in ScrollSync)
├── lenis@1.3.3
│   └── @lenis/react (integrated via ReactLenis)
├── @emailjs/browser@4.4.1
├── react-google-recaptcha@3.1.0
└── @fontsource/roboto@5.2.6
    ├── @fontsource/roboto/700.css
    ├── @fontsource/roboto/600.css
    ├── @fontsource/roboto/500.css
    └── @fontsource/roboto/400.css
```

## Build Configuration

**vite.config.js**:
- React plugin with SWC
- Base path: `/araldev-portfolio/` (for GitHub Pages)

**ESLint**:
- StandardJS rules
- Browser environment
- React JSX closing tag location relaxed

---

**Version**: 1.0.0 | **Date**: 2026-06-01 | **Status**: Finalizado

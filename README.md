<div align="center">

# 🚀 Araldev Portfolio

### _Frontend Developer — Crafting modern, animated, visually engaging web experiences_

[![GitHub deployments](https://img.shields.io/github/deployments/araldev/araldev-portfolio/github-pages?label=deploy&style=for-the-badge&logo=github&logoColor=white&color=%2300C9FF)](https://araldev.github.io/araldev-portfolio/)
[![Tests](https://img.shields.io/badge/tests-164%20%7C%2048%20visual-92FE9D?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/araldev/araldev-portfolio/actions)
[![A11y](https://img.shields.io/badge/a11y-axe%200%20violations-FFD166?style=for-the-badge&logo=deque&logoColor=white)](https://github.com/araldev/araldev-portfolio)
[![License](https://img.shields.io/badge/license-MIT-8fc6ff?style=for-the-badge)](LICENSE.md)

---

**Stack**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-ffcd25?style=flat-square&logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-4-6db33f?style=flat-square&logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-1.60-45ba4b?style=flat-square&logo=playwright)
![StandardJS](https://img.shields.io/badge/StandardJS-JS%20%26%20JSX-F7DF1E?style=flat-square)
![CSS Modules](https://img.shields.io/badge/CSS-Modules-663399?style=flat-square)
![GSAP](https://img.shields.io/badge/GSAP-3-0ae448?style=flat-square)
![Three.js](https://img.shields.io/badge/Three.js-r184-000000?style=flat-square&logo=three.js)
![Lenis](https://img.shields.io/badge/Lenis-1.3-3178C6?style=flat-square)

</div>

---

## ✨ Features

- **Smooth scrolling** with Lenis (auto-raf, synced touch)
- **GSAP + Three.js** animations for immersive interactions
- **1700+ lines** of pure CSS Modules — no Tailwind
- **Custom SVG icons** — 20+ tech brand icons, inline SVG with hover brand colors
- **i18n** — Full English / Spanish support via `react-i18next`
- **Accessibility** — axe-core 0 violations, semantic HTML, ARIA landmarks
- **164 unit tests** + **42 Playwright visual tests** across 3 viewports
- **Pre-commit hooks** via Husky — tests + visual regression guard
- **Dark-first design** with cyan/blue gradient accents

## 📦 Projects

| Project | Description | Stack |
|---------|-------------|-------|
| **v12-ui** | React component library + hooks. Tailwind CSS v4, fully typed, tree-shakeable. 10 components + 2 hooks. | React, TypeScript, Tailwind CSS, Storybook, Vitest, NPM |
| **English Web** | Full-stack learning project — JWT auth, Hexagonal Architecture, vanilla frontend, CSS 3D flip cards. | Java, Spring Boot, PostgreSQL, Angular, JUnit, RxJS, AI |

## 💼 Experience

**NTT DATA — Full-Stack Developer Intern** (Apr 2026 – May 2026)
- Backend with Java + Spring Boot (REST services, JUnit + Mockito)
- Frontend with Angular (standalone components, Signals)
- PostgreSQL (subqueries, views, stored procedures, triggers)
- Git + GitHub workflow (branches, PRs, code review)

## 🧪 Testing Philosophy

```
src/
├── tests/
│   ├── integration/    # Component integration tests
│   ├── unit/           # Hook & utility unit tests
│   ├── visual/         # Playwright visual regression (3 viewports)
│   └── a11y/           # axe-core automated accessibility
```

Every commit runs:
- `npm test` → 164 Vitest tests
- `pnpm test:visual` → 42 Playwright snapshot tests (desktop, tablet, mobile)

## 🚀 Quick Start

```bash
pnpm install
pnpm dev       # Development server
pnpm test      # Unit + integration tests
pnpm test:visual         # Visual regression (Playwright)
pnpm test:visual:update  # Update snapshots after intentional UI changes
pnpm build     # Production build
pnpm deploy    # Build + deploy to GitHub Pages
```

## 🛠 Tech Stack

| Category | Tools |
|----------|-------|
| **Core** | React 18, Vite 6, CSS Modules |
| **Animation** | GSAP 3, Three.js, Lenis |
| **Testing** | Vitest 4, Playwright 1.60, axe-core |
| **Linting** | StandardJS |
| **Fonts** | Roboto (400/500/600/700) via @fontsource |
| **i18n** | Custom React Context (no heavy libs) |
| **Icons** | 20+ inline custom SVGs with brand-color hover |

## 📄 License

MIT © [Araldev](https://github.com/araldev)

---

<div align="center">

[![Portfolio](https://img.shields.io/badge/🌐%20Live-araldev.github.io-00C9FF?style=for-the-badge)](https://araldev.github.io/araldev-portfolio/)
[![GitHub](https://img.shields.io/badge/github-araldev-181717?style=for-the-badge&logo=github)](https://github.com/araldev)

</div>

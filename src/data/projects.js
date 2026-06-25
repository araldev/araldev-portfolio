/**
 * =============================================================================
 * PROJECTS DATA — ARCHITECTURE DOCUMENTATION
 * =============================================================================
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │  SOURCE OF TRUTH: locale files (en.json / es.json)                         │
 * │                                                                             │
 * │  projects.js = STRUCTURE ONLY                                               │
 * │  locale files = CONTENT (title, shortDescription, description, details)     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * WHY THIS ARCHITECTURE?
 * ----------------------
 * - Content can be translated without modifying code
 * - Single source of truth per language
 * - Structure (IDs, images, links) is shared; content is translated
 *
 * DATA FLOW:
 * ----------
 *   projects.js          →  useTranslatedProjects()  →  Component
 *   (structure only)          (merge with locale)          (rendered)
 *
 * projects.js FIELDS:
 * -------------------
 *   id              - unique numeric identifier
 *   contentKey      - maps to projectsContent.{key} in locale files
 *   imgSrc          - thumbnail image for project cards
 *   gallery         - [{src, alt}] array for modal detail sections
 *   title           - display name (fallback if t() fails)
 *   shortDescription - ONE-LINE fallback only (should match locale)
 *   description     - fallback paragraphs only (should match locale)
 *   tech            - icon components for tech stack display
 *   tags            - filter tags for project cards
 *   npmLink / storybookLink / demoLink / codeLink - external URLs
 *
 * LOCALE FILE STRUCTURE (projectsContent.{contentKey}):
 * ------------------------------------------------------
 *   shortDescription - one-line project summary
 *   description[]   - array of description paragraphs
 *   details[]        - [{id, imgIndex, title, text, code}] feature details
 *
 * AGENT INSTRUCTIONS:
 * -------------------
 * - When adding a new project: add structure to projects.js AND content to BOTH locale files
 * - When editing content: edit locale files ONLY (en.json + es.json for full i18n)
 * - When editing structure (images, links, tech stack): edit projects.js
 * - NEVER edit shortDescription/description in projects.js for content purposes
 *
 * @see src/i18n/locales/en.json  - English content (PRIMARY)
 * @see src/i18n/locales/es.json  - Spanish content
 * @see src/Hooks/useTranslatedProjects.js - merge logic
 * =============================================================================
 */

/* eslint-disable quotes */
import { techIcons } from './icons'
import v12UiHeroCinematic from '../assets/v12-ui-hero-cinematic.png'
import realHero from '../assets/real-hero.webp'
import realStack from '../assets/real-stack.webp'
import realButtons from '../assets/real-buttons.webp'
import realControls from '../assets/real-controls.webp'
import realAccordion from '../assets/real-accordion.webp'
import demoFull from '../assets/demo-full.webp'
import bundlephobiaStats from '../assets/bundlephobia-stats.png'
import englishWebHero from '../assets/00-hero.webp'
import englishWebArchitecture from '../assets/01-architecture.webp'
import englishWebAuth from '../assets/02-auth.webp'
import englishWebFrontend from '../assets/03-frontend.webp'
import englishWebFlipcards from '../assets/04-flipcards.webp'
import englishWebJson from '../assets/05-json.webp'
import englishWebLearned from '../assets/06-learned.webp'
import magicLogo from '../assets/v12-ui-magic-logo.png'
import v12UiStack from '../assets/v12-ui-stack.png'

/**
 * Fallback mock images for projects without gallery images.
 * Used when a detail's imgIndex exceeds available gallery images.
 * @deprecated Prefer real gallery images; this is only a fallback.
 */
export const mockDetailImages = [
  { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'grid' },
  { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', pattern: 'dots' },
  { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', pattern: 'waves' },
  { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', pattern: 'circles' },
  { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', pattern: 'diagonal' },
  { gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', pattern: 'grid' }
]

/**
 * Projects array — STRUCTURE ONLY.
 *
 * CONTENT LIVES IN LOCALE FILES.
 *
 * Each project MUST have a contentKey that maps to projectsContent.{key}
 * in both en.json and es.json locale files.
 */
export const projects = [
  {
    id: 1,
    contentKey: 'v12-ui',
    imgSrc: v12UiHeroCinematic,
    gallery: [
      { src: demoFull, alt: 'Vista completa del sistema de componentes' },
      { src: bundlephobiaStats, alt: 'Bundlephobia stats: 68.3KB minified, 17.6KB gzip, tree-shakeable' },
      { src: v12UiStack, alt: 'Button y Stack componentes polimórficos' },
      { src: realButtons, alt: 'Button — 9 variantes con neon glow halos' },
      { src: realAccordion, alt: 'Accordion — 3 panels, arrow-key navigation' },
      { src: realControls, alt: 'Toggle + Select controles WAI-ARIA' },
      { src: magicLogo, alt: 'MagicLogo efecto de partículas' }
    ],
    // content fields below are FALLBACKS ONLY — edit locale files for content
    title: 'v12-ui',
    shortDescription: '', // Fallback only — content in locale files
    description: [],       // Fallback only — content in locale files
    tech: {
      ts: techIcons.ts,
      react: techIcons.react,
      tailwind: techIcons.tailwind,
      vite: techIcons.vite,
      npm: techIcons.npm,
      storybook: techIcons.storybook,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    tags: ['TypeScript', 'React', 'Storybook', 'A11Y', 'Tailwind v4'],
    npmLink: 'https://www.npmjs.com/package/v12-ui',
    storybookLink: 'https://araldev.github.io/v12-ui/',
    demoLink: `${import.meta.env.BASE_URL}v12-demo/index.html`,
    codeLink: 'https://github.com/araldev/v12-ui'
  },
  {
    id: 3,
    contentKey: 'english-web',
    imgSrc: englishWebHero,
    imgPosition: 'left', // Hero image focuses left side (3200x2000 → 4:3 card)
    gallery: [
      { src: englishWebArchitecture, alt: 'Arquitectura Hexagonal — Screaming Architecture' },
      { src: englishWebAuth, alt: 'Autenticación JWT desde cero con rotación de tokens' },
      { src: englishWebFrontend, alt: 'Frontend vanilla — navegación HTTP real' },
      { src: englishWebFlipcards, alt: 'CSS 3D Flip Cards con transform-style: preserve-3d' },
      { src: englishWebJson, alt: 'Contenido dinámico vía JSON — sin HTML ni CSS' },
      { src: englishWebLearned, alt: 'Lecciones aprendidas — arquitectura sobre frameworks' }
    ],
    title: 'English Web',
    shortDescription: '', // Fallback only — content in locale files
    description: [],       // Fallback only — content in locale files
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git,
      nodejs: techIcons.nodejs
    },
    tags: ['Vanilla JS', 'HTML', 'CSS', 'Node.js'],
    npmLink: '',
    storybookLink: '',
    demoLink: 'https://araldev.github.io/english-web/index.html',
    codeLink: 'https://github.com/araldev/english-web'
  }
]

/* eslint-disable quotes */
import { techIcons } from './icons'
import v12UiHeroCinematic from '../assets/v12-ui-hero-cinematic.png'
import realHero from '../assets/real-hero.webp'
import realStack from '../assets/real-stack.webp'
import realButtons from '../assets/real-buttons.webp'
import realControls from '../assets/real-controls.webp'
import realAccordion from '../assets/real-accordion.webp'
import demoFull from '../assets/demo-full.webp'
import shotEnglishWeb from '../assets/shot-english-web.webp'
import screenshotWebGame from '../assets/screenshot-web-game.png'

function genId () {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 10)
}

export const mockDetailImages = [
  {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    pattern: 'grid'
  },
  {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    pattern: 'dots'
  },
  {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    pattern: 'waves'
  },
  {
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    pattern: 'circles'
  },
  {
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    pattern: 'diagonal'
  },
  {
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    pattern: 'grid'
  }
]

export const projects = [
  {
    id: 1,
    contentKey: 'v12-ui',
    imgSrc: v12UiHeroCinematic,
    gallery: [
      { src: demoFull, alt: 'Vista completa del sistema de componentes' },
      { src: realHero, alt: 'Hero section con efectos cinematográficos' },
      { src: realButtons, alt: 'Button — 9 variantes con neon glow halos' },
      { src: realControls, alt: 'Toggle (WAI-ARIA switch) + Select (WAI-ARIA combobox)' },
      { src: realAccordion, alt: 'Accordion — 3 panels, arrow-key navigation' },
      { src: realStack, alt: 'Stack tecnológico' }
    ],
    title: 'v12-ui',
    shortDescription: 'React component library con utility-first design, accessibility y canvas particle effects',
    description: [
      'A React component library with a focus on utility-first design and accessibility. Built by araldev. Fully typed, tree-shakable, zero-config.',
      'Canvas particle effects, accessibility-first primitives, Tailwind v4 theming. Supports React 18 and 19 with 100% TypeScript coverage.'
    ],
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
    codeLink: 'https://github.com/araldev/v12-ui',
    details: [
      {
        id: genId(),
        imgIndex: 0,
        title: 'Tree-shaking Real',
        text: 'Importa solo lo que usas. Button: 4.7KB · Stack: 496 bytes · Toggle: 2.8KB · Accordion: 6.5KB. Si solo necesitas Button y Stack, tu bundle suma ~5KB. El resto nunca llega a producción.',
        code: `import { Button, Stack } from 'v12-ui'
// Stack: 496 bytes | Button: 4.7KB
// Accordion bundle completo: 6.5KB`
      },
      {
        id: genId(),
        imgIndex: 1,
        title: 'Polimórfico + CVA',
        text: 'Button se adapta al contexto: rendered como <button> o <a> según props. class-variance-authority define 9 variants (primary, secondary, muted, accent, success, warning, error, info, ghost) + border, shadow, rounded, size.',
        code: `<Button variant="primary" size="md">Ship it</Button>
<Button as="a" href="/docs" variant="ghost">Docs</Button>
<Button variant="success" shadow rounded="pill">Enabled</Button>`
      },
      {
        id: genId(),
        imgIndex: 2,
        title: 'Dark/Light Theme',
        text: 'Tailwind CSS v4 con @theme. Los tokens --bg-primary, --text-primary, --border-primary se adaptan al tema activo. AnimatedBackground auto-detecta prefers-color-scheme y ajusta partículas.',
        code: `/* Tailwind @theme integration */
@theme {
  --color-bg-primary: var(--v12-bg);
  --color-text-primary: var(--v12-text);
}
/* Automatic dark/light via CSS vars */`
      },
      {
        id: genId(),
        imgIndex: 3,
        title: 'WAI-ARIA + Keyboard',
        text: 'Accordion: arrow-key navigation (up/down/home/end). Select: combobox con keyboard navigation. Toggle: switch pattern con aria-checked. Todos los componentes respetan focus-visible y prefers-reduced-motion.',
        code: `<Accordion>
  <Accordion.Item>
    <Accordion.Trigger>What is v12-ui?</Accordion.Trigger>
    <Accordion.Content>...</Accordion.Content>
  </Accordion.Item>
</Accordion>`
      },
      {
        id: genId(),
        imgIndex: 4,
        title: 'Stack Tecnológico',
        text: 'React 18/19 · TypeScript 5.8 (tipado estricto) · Tailwind CSS v4 · Vite 7 · Storybook 10 · Vitest + RTL · clsx + tailwind-merge · class-variance-authority · Semantic Release',
        code: `// GitHub metrics (Jun 2026)
TypeScript: 91.2% · CSS: 7.8% · Other: 1.0%
Components: 10 | Hooks: 2 | Tests: passing
License: MIT | Releases: 25+`
      },
      {
        id: genId(),
        imgIndex: 5,
        title: 'Zero-config Setup',
        text: '2 líneas para empezar. npm i v12-ui + import styles. No config files, no wrappers, no providers. Los tokens de tema se injectan via CSS y funcionan con cualquier Tailwind setup.',
        code: `npm i v12-ui
import 'v12-ui/styles.css'
import { Button } from 'v12-ui'
// Zero config. Works out of the box.`
      }
    ]
  },
  {
    id: 2,
    contentKey: 'listening-maze',
    imgSrc: screenshotWebGame,
    title: 'Listening Maze',
    shortDescription: 'Juego de escucha activa en inglés con niveles escalables via JSON',
    description: [
      'Game de navegación auditiva donde el jugador sigue instrucciones en inglés para encontrar la salida del laberinto. Sistema de niveles driven por JSON para máxima escalabilidad.',
      'Diseñado táctil y responsive. Feedback visual inmediato para cada acción del jugador. Integración en English Web como ejercicio principal del Game Center.'
    ],
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    tags: ['Vanilla JS', 'CSS', 'Game'],
    npmLink: '',
    storybookLink: '',
    demoLink: 'https://araldev.github.io/english-web/exercises.html',
    codeLink: 'https://github.com/araldev/english-web/blob/main/src/js/games/listening-maze.js',
    details: [
      {
        id: genId(),
        imgIndex: 4,
        title: 'Niveles Escalables via JSON',
        text: 'Cada nivel se define en un archivo JSON con estructura de laberinto, instrucciones auditivas y metadata. Añadir nuevos niveles no requiere cambios en código — solo agregar una entrada al array.'
      },
      {
        id: genId(),
        imgIndex: 5,
        title: 'Audio Guidance en Inglés',
        text: 'Instrucciones spoken en inglés guían al jugador por el laberinto. Sistema de audio integrado que reproduce indicaciones claras y progresivamente más complejas según el nivel.'
      },
      {
        id: genId(),
        imgIndex: 0,
        title: 'Interactive Grammar Cards',
        text: 'Después de completar cada laberinto, se muestran grammar cards con el vocabulario y estructuras usadas. Refuerzo positivo que conecta el juego con el aprendizaje.'
      },
      {
        id: genId(),
        imgIndex: 1,
        title: 'Responsive & Touch-friendly',
        text: 'Controles táctiles optimizados para tablets y smartphones. D-pad virtual y botones de acción adaptados para pantalla táctil sin perder precisión en la navegación.'
      }
    ]
  },
  {
    id: 3,
    contentKey: 'english-web',
    imgSrc: shotEnglishWeb,
    title: 'English Web',
    shortDescription: 'Plataforma educativa vanilla HTML/CSS/JS para aprender inglés',
    description: [
      'Mi primer proyecto completo: plataforma de ejercicios interactivos y juegos educativos construidos 100% con vanilla HTML, CSS y JavaScript. Arquitectura JSON-driven para escalabilidad sin dependencias.',
      '104 commits de código escrito a mano. Incluye ejercicios de gramática, vocabulario, comprensión auditiva y el Game Center con Listening Maze como flagship feature.'
    ],
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    tags: ['Vanilla JS', 'HTML', 'CSS'],
    npmLink: '',
    storybookLink: '',
    demoLink: 'https://araldev.github.io/english-web/index.html',
    codeLink: 'https://github.com/araldev/english-web',
    details: [
      {
        id: genId(),
        imgIndex: 2,
        title: 'Vanilla Architecture',
        text: 'HTML 37.1% · CSS 32.4% · JS 30.5%. Cero dependencias externas. Todo escrito desde cero para dominar los fundamentos antes de usar frameworks o librerías. Rendimiento óptimo y tamaño mínimo.'
      },
      {
        id: genId(),
        imgIndex: 3,
        title: 'JSON-driven Game Levels',
        text: 'El contenido de ejercicios y niveles se almacena en estructuras JSON. Agregar nuevo contenido (preguntas, vocabulario, mapas) no requiere modificar HTML — solo actualizar los datos.'
      },
      {
        id: genId(),
        imgIndex: 4,
        title: 'Game Center Integration',
        text: 'English Web integra múltiples juegos educativos bajo una navegación unificada. Listening Maze es el flagship, con grammar cards y tracking de progreso por sesión.'
      },
      {
        id: genId(),
        imgIndex: 5,
        title: 'Learning-first Design',
        text: 'Cada interacción está diseñada para reforzar el aprendizaje: feedback inmediato, progresión de dificultad, y repetición espaciada. Interfaz clara que prioriza la educación sobre lo visual.'
      }
    ]
  }
]

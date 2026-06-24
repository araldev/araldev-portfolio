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
      { src: bundlephobiaStats, alt: 'Bundlephobia stats: 68.3KB minified, 17.6KB gzip, tree-shakeable' }
    ],
    title: 'v12-ui',
    shortDescription: 'Librería de componentes UI autoresponsive y autoTheme para React',
    description: [
      'Sistema de componentes React con tipado completo en TypeScript. Construcción profesional con tree-shaking, builds ESM & CJS, y GSAP + Lenis integrados para animaciones fluidas.',
      '4 componentes core (Button, Stack, AnimatedBackground, Text) + 1 custom hook. Documentación interactiva en Storybook y publicación oficial en npm.'
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
        title: '10 Componentes Listos para Producción',
        text: 'Vista completa del sistema: Button (polimórfico), Stack, Text, Accordion, Select, Toggle, AnimatedBackground, MagicText, MagicLogo, MagicMouseFollower. Cada uno documentado en Storybook con ejemplos interactivos.',
        code: `// Sistema completo en Storybook
// 10 componentes | 2 hooks | 100% TypeScript
// MIT License | 25+ releases`
      },
      {
        id: genId(),
        imgIndex: 1,
        title: 'Canvas Particle Effects',
        text: 'AnimatedBackground con partículas que responden al cursor. Light-source glow dinámico, spring physics, y auto-desactivación cuando prefers-reduced-motion está activo. El hero de la demo usa este efecto.',
        code: `// AnimatedBackground props
<AnimatedBackground
  particleCount={50}
  duration={3}
  colors={['#0d9488', '#14b8a6']}
/>`
      },
      {
        id: genId(),
        imgIndex: 2,
        title: 'Button: 9 Variants + CVA',
        text: 'class-variance-authority define variants consistentes: primary, secondary, muted, accent, success, warning, error, info, ghost. Cada variant tiene estados hover, active, disabled y focus-visible.',
        code: `<Button variant="primary">Primary</Button>
<Button variant="success" shadow rounded="pill">
  Success with shadow
</Button>
<Button as="a" href="/docs" variant="ghost">
  Link as button
</Button>`
      },
      {
        id: genId(),
        imgIndex: 3,
        title: 'WAI-ARIA Controls',
        text: 'Toggle: WAI-ARIA switch pattern con aria-checked. Select: WAI-ARIA combobox con keyboard navigation (arrow keys, enter, escape). Ambos soporta focus-visible y reduced-motion.',
        code: `// Toggle - WAI-ARIA switch
<Toggle aria-label="Enable notifications" />
// Select - WAI-ARIA combobox
<Select>
  <Select.Option value="1">Option 1</Select.Option>
</Select>`
      },
      {
        id: genId(),
        imgIndex: 4,
        title: 'Accordion con Keyboard Nav',
        text: 'WAI-ARIA accordion con arrow-key navigation (up/down/home/end). 3 paneles expandibles con transiciones suaves. Soporta muted y ghost variants para diferentes estilos visuales.',
        code: `// Accordion - WAI-ARIA pattern
<Accordion type="single" collapsible>
  <Accordion.Item value="1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>...</Accordion.Content>
  </Accordion.Item>
</Accordion>`
      },
      {
        id: genId(),
        imgIndex: 5,
        title: 'Stack Tecnológico',
        text: 'React 18/19 · TypeScript 5.8 · Tailwind CSS v4 · Vite 7 · Storybook 10 · Vitest + RTL · clsx + tailwind-merge · class-variance-authority · Semantic Release',
        code: `// Bundlephobia (Jun 2026)
v12-ui: 68.3KB (17.6KB gzip)
├── class-variance-authority: 1.5KB
├── tailwind-merge: 51.5KB
└── clsx: 774 bytes
// Tree-shakeable: solo lo que usas llega`
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

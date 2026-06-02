/* eslint-disable quotes */
import { techIcons } from './icons'

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
    imgSrc: new URL('/src/assets/screenshot-v12-ui.png', import.meta.url).href,
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
    tags: ['TypeScript', 'React', 'Storybook'],
    npmLink: 'https://www.npmjs.com/package/v12-ui',
    storybookLink: 'https://araldev.github.io/v12-ui/',
    demoLink: '',
    codeLink: 'https://github.com/araldev/v12-ui',
    details: [
      {
        id: genId(),
        imgIndex: 0,
        title: 'Componentes Polimórficos',
        text: 'Button y Text son componentes polimórficos que adaptan su estructura HTML según el contexto (button, a, div, span...). Stack proporciona un container Flex flexible con control total sobre dirección, gap y alineación.'
      },
      {
        id: genId(),
        imgIndex: 1,
        title: 'AnimatedBackground Canvas',
        text: 'Componente canvas que genera animaciones de partículas abstractas. Configurable en duración, densidad y colores. Integrado con GSAP para control preciso del timeline y transiciones suaves.'
      },
      {
        id: genId(),
        imgIndex: 2,
        title: 'Tree-shakable & Dual Builds',
        text: 'Paquete optimizado para producción: exports ESM para bundlers modernos y CJS para compatibilidad legacy. Tree-shaking garantiza que solo el código usado llega a producción.'
      },
      {
        id: genId(),
        imgIndex: 3,
        title: 'Stack Tecnológico',
        text: 'TypeScript 79% · CSS 19.4% · JS 1.6%. 147 commits, 9 releases (última v0.2.5 ago 2025). Licencia MIT. Integración directa con Tailwind CSS y soporte para autoTheme sin configuración.'
      }
    ]
  },
  {
    id: 2,
    imgSrc: new URL('/src/assets/screenshot-web-game.png', import.meta.url).href,
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
    imgSrc: new URL('/src/assets/shot-english-web.webp', import.meta.url).href,
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

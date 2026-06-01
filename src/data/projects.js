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
    description: [
      'Librería de componentes UI autoresponsive, autoTheme y sin ninguna configuración.',
      'Se puede usar en cualquier proyecto de React, ya que es un paquete npm.'
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
    npmLink: 'https://www.npmjs.com/package/v12-ui',
    storybookLink: 'https://araldev.github.io/v12-ui/',
    demoLink: '',
    codeLink: 'https://github.com/araldev/v12-ui',
    details: [
      {
        id: genId(),
        imgIndex: 0,
        title: 'Componentes Autoresponsive',
        text: 'Cada componente se adapta automáticamente al viewport sin necesidad de media queries. Los estilos se calculan en tiempo real usando unidades relativas y contenedores flexibles que responden al tamaño del contenedor padre.'
      },
      {
        id: genId(),
        imgIndex: 1,
        title: 'AutoTheme sin Configuración',
        text: 'El sistema de theming detecta automáticamente la preferencia del usuario (claro/oscuro) y aplica los colores adecuados. No requiere Providers, Context ni configuración inicial — simplemente importa el componente y funciona.'
      },
      {
        id: genId(),
        imgIndex: 2,
        title: 'Storybook Integrado',
        text: 'Todos los componentes están documentados en Storybook con ejemplos interactivos, variaciones de props y estados. Ideal para desarrollo, testing visual y colaboración en equipo.'
      },
      {
        id: genId(),
        imgIndex: 3,
        title: 'Publicado en npm',
        text: 'Disponible como paquete npm listo para instalar en cualquier proyecto React. Con tipado completo en TypeScript y soporte para Tailwind CSS out of the box.'
      }
    ]
  },
  {
    id: 2,
    imgSrc: new URL('/src/assets/screenshot-web-game.png', import.meta.url).href,
    title: 'Listening Maze',
    description: [
      'Juego de escucha activa, donde debes encontrar la salida de un laberinto.',
      "Está diseñado para ser escalable, añadiendo niveles al archivo json se crean automáticamente."
    ],
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    npmLink: '',
    storybookLink: '',
    demoLink: 'https://araldev.github.io/english-web/exercises.html',
    codeLink: 'https://github.com/araldev/english-web/blob/main/src/js/games/listening-maze.js',
    details: [
      {
        id: genId(),
        imgIndex: 4,
        title: 'Mecánica del Juego',
        text: 'El jugador escucha instrucciones en inglés y debe navegar por un laberinto hasta encontrar la salida. Cada nivel aumenta en complejidad, entrenando el oído y la comprensión auditiva de forma progresiva.'
      },
      {
        id: genId(),
        imgIndex: 5,
        title: 'Niveles Escalables',
        text: 'Los niveles se definen en un archivo JSON. Añadir nuevos mapas, instrucciones y obstáculos es tan simple como agregar una nueva entrada al array. El motor del juego renderiza automáticamente cada nivel.'
      },
      {
        id: genId(),
        imgIndex: 0,
        title: 'Feedback Visual',
        text: 'Cada acción del jugador tiene retroalimentación visual inmediata: caminos correctos se iluminan, errores muestran animaciones y la salida brilla al ser descubierta. Todo construido con CSS y JavaScript vanilla.'
      },
      {
        id: genId(),
        imgIndex: 1,
        title: 'Responsive y Táctil',
        text: 'Diseñado para funcionar tanto en desktop como en dispositivos móviles. Los controles táctiles permiten jugar en tablets y smartphones sin perder precisión ni experiencia de usuario.'
      }
    ]
  },
  {
    id: 3,
    imgSrc: new URL('/src/assets/shot-english-web.webp', import.meta.url).href,
    title: 'English Web',
    description: [
      'Mi primer proyecto, el cual desarrollé sólo con JavaScript, CSS y HTML para poner en práctica las bases que aprendí antes de usar frameworks y librerías.',
      'Quise hacerlo así para aprender bien las bases antes de empezar a usar frameworks y librerías.'
    ],
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    npmLink: '',
    storybookLink: '',
    demoLink: 'https://araldev.github.io/english-web/index.html',
    codeLink: 'https://github.com/araldev/english-web',
    details: [
      {
        id: genId(),
        imgIndex: 2,
        title: 'Fundamentos Sólidos',
        text: 'Construido desde cero con HTML semántico, CSS moderno (Flexbox, Grid, variables) y JavaScript puro. Fue mi proyecto de aprendizaje para dominar las bases antes de saltar a frameworks.'
      },
      {
        id: genId(),
        imgIndex: 3,
        title: 'Ejercicios Interactivos',
        text: 'La plataforma incluye ejercicios de gramática, vocabulario y comprensión auditiva. Cada ejercicio se genera dinámicamente desde estructuras de datos, permitiendo añadir nuevo contenido sin tocar el HTML.'
      },
      {
        id: genId(),
        imgIndex: 4,
        title: 'Game Center',
        text: 'Además de los ejercicios tradicionales, incluye juegos educativos como el Listening Maze. Todo integrado en una misma plataforma con navegación unificada y progresión de dificultad.'
      },
      {
        id: genId(),
        imgIndex: 5,
        title: 'Sin Dependencias',
        text: 'Cero dependencias externas. Todo el CSS y JavaScript está escrito a mano, lo que garantiza un rendimiento óptimo, tamaño mínimo y comprensión total del código. Ideal para aprender y para producción.'
      }
    ]
  }
]

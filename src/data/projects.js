/* eslint-disable quotes */
import { techIcons } from './icons'

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
    npmLink: '@/assets/shot-english-web.webp',
    storybookLink: 'https://araldev.github.io/v12-ui/',
    demoLink: '',
    codeLink: 'https://github.com/araldev/v12-ui'
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
    codeLink: 'https://github.com/araldev/english-web/blob/main/src/js/games/listening-maze.js'
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
    codeLink: 'https://github.com/araldev/english-web'
  }
]

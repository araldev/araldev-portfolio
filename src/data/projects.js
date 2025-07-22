/* eslint-disable quotes */
import { techIcons } from './icons'

export const projects = [
  {
    id: 1,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'English Web',
    description: [
      'Fue mi primer proyecto, en el cual puse en práctica lo que fuí aprendiendo.',
      'Está desarrollado con js, CSS y HTML. Quise hacerlo así para aprender bien las bases antes de empezar a usar frameworks y librerías.'
    ],
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    demoLink: 'https://araldev.github.io/english-web/index.html',
    codeLink: 'https://github.com/araldev/english-web'
  },
  {
    id: 2,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'Listening Maze',
    description: [
      'Fue mi primer proyecto, en el cual puse en práctica lo que fuí aprendiendo.',
      'Está desarrollado con js, CSS y HTML. Quise hacerlo así para aprender bien las bases antes de empezar a usar frameworks y librerías.'
    ],
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    demoLink: 'https://araldev.github.io/english-web/exercises.html',
    codeLink: 'https://github.com/araldev/english-web/blob/main/src/js/games/listening-maze.js'
  },
  {
    id: 3,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'v12-ui',
    description: [
      'Es una librería de componentes UI autoresponsive, detecta el tema de la página y modifica los componentes automáticamente según la preferencia o el data-theme, gracias a un custom hook que usa new MutationObserver.',
      'Se puede usar en cualquier proyecto de React, ya que es un paquete npm.',
      'Requiere de 0 configuración, ya que se importa el componente que quieras usar en cada archivo y la stylesheet en el punto de entrada de tu app.'
    ],
    tech: {
      ts: techIcons.ts,
      react: techIcons.react,
      tailwind: techIcons.tailwind,
      gsap: techIcons.gsap,
      vite: techIcons.vite,
      storybook: techIcons.storybook,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    demoLink: '',
    codeLink: ''
  },
  {
    id: 4,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'Red Social',
    description: [
      'Fue mi primer proyecto, en el cual puse en práctica lo que fuí aprendiendo.',
      'Está desarrollado con js, CSS y HTML. Quise hacerlo así para aprender bien las bases antes de empezar a usar frameworks y librerías.'
    ],
    tech: {
      ts: techIcons.ts,
      react: techIcons.react,
      css: techIcons.css,
      html: techIcons.html,
      gsap: techIcons.gsap,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    },
    demoLink: '',
    codeLink: ''
  }
]

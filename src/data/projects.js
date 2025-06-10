import { techIcons } from './icons'

export const projects = [
  {
    id: 1,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'English Web',
    description: 'ejemplo de descripción no muy larga',
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    }
  },
  {
    id: 2,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'Juego del laverinto',
    description: 'Juego lógico en inglés sobre decidir el camino correcto',
    tech: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    }
  },
  {
    id: 3,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'Biblioteca de Componentes',
    description: 'Biblioteca de componentes UI de React',
    tech: {
      ts: techIcons.ts,
      react: techIcons.react,
      tailwind: techIcons.tailwind,
      html: techIcons.html,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    }
  },
  {
    id: 4,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'Red Social',
    description: 'ejemplo de descripción no muy larga',
    tech: {
      ts: techIcons.ts,
      react: techIcons.react,
      css: techIcons.css,
      html: techIcons.html,
      gsap: techIcons.gsap,
      gitHub: techIcons.gitHub,
      git: techIcons.git
    }
  }
]

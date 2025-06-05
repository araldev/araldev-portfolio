import { techIconsDictionary } from './icons'

export const projects = [
  {
    id: 1,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'English Web',
    description: 'ejemplo de descripción no muy larga',
    tech: {
      js: techIconsDictionary.js,
      react: techIconsDictionary.react,
      gitHub: techIconsDictionary.gitHub
    }
  },
  {
    id: 2,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'Juego',
    description: 'ejemplo de descripción no muy larga',
    tech: {
      js: techIconsDictionary.js,
      css: techIconsDictionary.css,
      html: techIconsDictionary.html
    }
  }
]

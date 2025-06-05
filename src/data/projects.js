import { techIconsDictionary } from './icons'

export const projects = [
  {
    id: 1,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'English Web',
    description: 'ejemplo de descripción no muy larga',
    tech: [
      techIconsDictionary.js,
      techIconsDictionary.react
    ]
  },
  {
    id: 2,
    imgSrc: `${import.meta.env.BASE_URL}/images/shot-english-web.webp`,
    title: 'Juego',
    description: 'ejemplo de descripción no muy larga',
    tech: [
      techIconsDictionary.js,
      techIconsDictionary.css,
      techIconsDictionary.html
    ]
  }
]

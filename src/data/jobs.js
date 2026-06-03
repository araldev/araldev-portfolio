/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} company
 * @property {string} [companyLogo]
 * @property {string} role
 * @property {('full-time'|'part-time'|'contract'|'freelance'|'internship')} type
 * @property {string} period
 * @property {string} startDate - ISO "YYYY-MM"
 * @property {string} [endDate] - ISO "YYYY-MM"
 * @property {boolean} current
 * @property {string} location
 * @property {boolean} remote
 * @property {string[]} description
 * @property {string[]} [achievements]
 * @property {Object<string, any>} stack
 * @property {string[]} [tags]
 * @property {{companyLink?: string, projectLink?: string, referenceLink?: string}} [links]
 */

import { techIcons } from './icons.js'

/**
 * Validator for the Job contract (FR-021).
 * In dev mode, logs errors/warnings. In prod, returns silently.
 * @param {Job} job
 * @param {number} index
 * @returns {boolean} true if valid (or prod mode), false if invalid in dev
 */
export function validateJobContract (job, index = 0) {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) {
    return true
  }

  const required = [
    'id', 'company', 'role', 'type', 'period', 'startDate',
    'current', 'location', 'remote', 'description', 'stack'
  ]
  let valid = true

  for (const field of required) {
    if (job[field] === undefined || job[field] === null) {
      // eslint-disable-next-line no-console
      console.error(`[jobs.js] Job at index ${index} is missing required field "${field}".`, job)
      valid = false
    }
  }

  if (job.current && job.endDate) {
    // eslint-disable-next-line no-console
    console.warn(`[jobs.js] Job ${job.id} has current: true AND endDate defined; endDate will be ignored (EC-003).`)
  }

  if (job.startDate && !/^\d{4}-\d{2}$/.test(job.startDate)) {
    // eslint-disable-next-line no-console
    console.error(`[jobs.js] Job ${job.id} startDate must be in ISO "YYYY-MM" format, got "${job.startDate}".`)
    valid = false
  }

  if (job.endDate && !/^\d{4}-\d{2}$/.test(job.endDate)) {
    // eslint-disable-next-line no-console
    console.error(`[jobs.js] Job ${job.id} endDate must be in ISO "YYYY-MM" format, got "${job.endDate}".`)
    valid = false
  }

  const validTypes = ['full-time', 'part-time', 'contract', 'freelance', 'internship']
  if (job.type && !validTypes.includes(job.type)) {
    // eslint-disable-next-line no-console
    console.error(`[jobs.js] Job ${job.id} has invalid type "${job.type}". Allowed: ${validTypes.join(', ')}.`)
    valid = false
  }

  return valid
}

/**
 * Static job data. Single entry — the NTT DATA internship
 * (April 2026 — May 2026) sourced from the candidate's CV.
 *
 * The previous 4-entry mock history (Araldev Tech Lead,
 * Independent, PrevSaaS, EdTech Lab) was removed in this
 * revision because those were placeholder data, not actual
 * work history. The JobCard section now shows the only
 * real professional experience on the CV.
 *
 * @type {Job[]}
 */
export const jobs = [
  {
    id: 'ntt-data-practicas-2026',
    company: 'NTT DATA',
    companyLogo: undefined,
    role: 'Backend & Full-Stack Developer (Prácticas)',
    type: 'internship',
    period: 'Abril 2026 — Mayo 2026',
    startDate: '2026-04',
    endDate: '2026-05',
    current: false,
    location: 'Málaga, Spain',
    remote: false,
    description: [
      'Prácticas profesionales en NTT DATA dentro del programa de formación Java SE + Spring Boot. El programa cubrió 6 áreas técnicas (Backend, Testing, Datos, Frontend, IA, Liderazgo técnico) con foco en el ecosistema empresarial Java y la entrega de un proyecto final integrador.',
      'Trabajo en equipo interdisciplinario bajo metodologías ágiles, con pair-programing, code reviews y ceremonias Scrum como práctica diaria. El proyecto final consistió en una solución integral de principio a fin, coordinando el ciclo de vida completo (SDLC) desde los requerimientos hasta el despliegue.'
    ],
    achievements: [
      'Desarrollo Backend con Java + Spring Boot: implementación de servicios RESTful robustos, optimizando la lógica de negocio y asegurando la escalabilidad del sistema. Dominio profundo del ecosistema Spring (Boot, Data, Security), arquitectura de microservicios y gestión del ciclo de vida de aplicaciones empresariales.',
      'Calidad de Software (Testing): creación de suites de pruebas unitarias e integración con JUnit 5 y Mockito, garantizando una cobertura de código superior al 85%. Mentalidad Testing-First, capacidad de aislar dependencias para pruebas unitarias y depuración eficiente de errores complejos.',
      'Gestión de Datos: modelado y administración de esquemas en PostgreSQL, optimizando consultas SQL complejas para mejorar el tiempo de respuesta. Optimización de bases de datos relacionales, diseño de esquemas normalizados y gestión de transacciones.',
      'Desarrollo Frontend con Angular: creación de interfaces de usuario dinámicas, receptivas y basadas en componentes, conectadas a APIs mediante servicios. Programación reactiva (RxJS), gestión de estado en frontend y creación de Single Page Applications (SPA).',
      'Integración de Inteligencia Artificial: exploración e implementación de soluciones basadas en IA para automatización de tareas y análisis de datos en el entorno del proyecto. Integración de LLMs, diseño de prompts efectivos y flujo de trabajo con APIs de IA generativa.',
      'Proyecto Final: liderazgo técnico en el desarrollo de una solución integral de principio a fin, coordinando el ciclo de vida completo (SDLC), desde los requerimientos hasta el despliegue. Resolución de problemas complejos bajo metodologías ágiles, trabajo en equipo interdisciplinario y visión integral del software.',
      'Java SE Programmer Certification Preparation (NTT DATA / Oracle Training): formación avanzada orientada a la Certificación Profesional de Oracle. Conocimiento profundo del núcleo de Java (multihilo, lambdas, streams, concurrencia, gestión de memoria) y buenas prácticas de programación bajo estándares internacionales.'
    ],
    stack: {
      java: techIcons.java,
      spring: techIcons.spring,
      postgres: techIcons.postgres,
      angular: techIcons.angular,
      junit: techIcons.junit,
      rxjs: techIcons.rxjs,
      ia: techIcons.ia,
      git: techIcons.git,
      gitHub: techIcons.gitHub
    },
    tags: ['Prácticas', 'NTT DATA', 'Java', 'Spring Boot', 'Angular', 'IA', 'SDLC'],
    links: {}
  }
]

// Validate all jobs at module load (dev only)
jobs.forEach((job, i) => validateJobContract(job, i))

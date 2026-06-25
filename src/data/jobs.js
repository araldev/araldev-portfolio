/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} company
 * @property {string} [companyLogo]
 * @property {React.ReactNode} [companyIcon]
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
 * @property {string[]} [tags] — Soft skills only. NO tech stack, NO role types (e.g. 'Java', 'Spring Boot', 'Prácticas').
 *                                     Tech skills go in `stack`, role context in `type`. This section is for
 *                                     human/soft skills that help recruiters understand the candidate's
 *                                     professional attributes beyond technology.
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
 * (April 2026 — May 2026) revised with realistic achievements
 * for a first-year DAW dual internship.
 *
 * @type {Job[]}
 */
export const jobs = [
  {
    id: 'ntt-data-practicas-2026',
    contentKey: 'nttData',
    company: 'NTT DATA',
    companyLogo: undefined,
    companyIcon: techIcons.nttData,
    role: 'Full-Stack Developer',
    type: 'internship',
    period: 'Abril 2026 — Mayo 2026',
    startDate: '2026-04',
    endDate: '2026-05',
    current: false,
    location: 'Málaga, Spain',
    remote: false,
    description: [
      'Prácticas en NTT DATA dentro del programa de formación Java y Spring Boot. Trabajamos backend con Spring Boot (servicios REST), testing con JUnit y Mockito, PostgreSQL, frontend con Angular, y un proyecto integrador donde aplicamos todo lo aprendido.',
      'El proyecto final se desarrolló en equipo usando Git y GitHub para coordinar el trabajo: cada funcionalidad en una rama independiente, los cambios se integraban mediante Pull Requests y se revisaban antes de mergear. Una forma real de trabajar en equipo con control de versiones.',
      'Además, realizamos cursos especializados en ingeniería de prompts con IA generativa y en testing unitario con mocks, complementando la formación técnica con habilidades en dos áreas clave del desarrollo moderno.'
    ],
    achievements: [
      'Uso de Git y GitHub como herramienta de coordinación: aplicamos Git para gestionar el trabajo en equipo con ramas por funcionalidad, commits atómicos, Pull Requests y merges controlados. Ya conocía Git, aquí lo implementamos como herramienta de coordinación real en un equipo.',
      'Desarrollo backend con mini proyectos: realicé varios proyectos pequeños en Java con Spring Boot donde implementaba endpoints REST, servicios y lógica de negocio. Cada mini proyecto abordaba una tecnología o concepto distinto.',
      'SQL avanzado en PostgreSQL: trabajé con consultas complejas incluyendo subconsultas anidadas, vistas, procedimientos almacenados, funciones y triggers.',
      'Curso de Angular con standalone components y Signals: realicé un curso específico donde aprendí la nueva arquitectura con componentes standalone y Signals. Creamos un frontend completo con Angular.',
      'Curso de testing unitario con mocks: formación específica en creación de mocks y verificación de comportamiento con Mockito y JUnit.',
      'Curso de ingeniería de prompts con IA generativa: formación en prompts avanzados (cerrados/abiertos, zero-shot, few-shot, chain-of-thought), configuración de hiperparámetros, generación SQL precisa, comparativa de plataformas IA, MLOps y seguridad legal.',
      'Metodologías ágiles: trabajo con sprints quincenales y daily standups, estimación de tareas y uso de Kanban.',
      'Documentación técnica: redacción de documentación de funcionalidades implementadas, incluyendo decisiones de diseño y ejemplos de uso.'
    ],
    stack: {
      java: techIcons.java,
      spring: techIcons.spring,
      postgres: techIcons.postgres,
      angular: techIcons.angular,
      junit: techIcons.junit,
      ia: techIcons.ia,
      git: techIcons.git,
      gitHub: techIcons.gitHub
    },
    // ⚠️ Soft skills ONLY — no tech stack, no role types.
    // Tech → `stack` property. Role → `type` property.
    tags: ['Trabajo en equipo', 'Metodologías ágiles', 'Resolución de problemas', 'Comunicación efectiva', 'Adaptabilidad'],
    links: {}
  }
]

// Validate all jobs at module load (dev only)
jobs.forEach((job, i) => validateJobContract(job, i))

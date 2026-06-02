# Feature Specification: JobCard Component

**Feature Branch**: `002-job-card-component`
**Created**: 2026-06-01
**Status**: Draft → Ready for Review
**Input**: User description: "Componente nuevo `JobCard` que represente experiencia laboral / puestos de trabajo en el portfolio, manteniendo la calidad y convenciones del `ProjectCard` existente (futurismo minimalista, animaciones GSAP ScrollTrigger, WCAG 2.1 AA). El contrato de datos del Job no existe y debe ser propuesto por el Analista."

---

## 1. User Scenarios & Testing *(mandatory)*

### User Story 1 — Reclutador revisa la trayectoria profesional (Priority: P1)

Un reclutador o cliente potencial quiere evaluar la trayectoria profesional del desarrollador de un vistazo, identificando rápidamente empresas, roles, periodos y stack técnico usado en cada posición.

**Why this priority**: Es la sección que valida la "experiencia" del CV en vivo. Un reclutador técnico decide en pocos segundos si el candidato encaja con el perfil buscado; sin esta sección el portfolio pierde su propósito principal de carta de presentación profesional.

**Independent Test**: Se valida abriendo la URL del portfolio, haciendo scroll hasta la sección de experiencia, y verificando que cada `JobCard` se renderiza con su información contractual (company, role, period, location, type, description, stack) con animaciones de entrada GSAP y sin errores en consola.

**Acceptance Scenarios**:

1. **Given** el visitante hace scroll hasta la sección de experiencia, **When** el primer `JobCard` entra en el viewport, **Then** se anima desde una opacidad 0 con un ligero `translateY` a su posición final usando GSAP ScrollTrigger.
2. **Given** la sección de experiencia está visible, **When** el visitante visualiza la lista de `JobCard`, **Then** los jobs se renderizan ordenados por `startDate` descendente (más reciente primero), y los jobs con `current: true` aparecen al inicio de la lista.
3. **Given** un `JobCard` se renderiza, **When** se muestra la información, **Then** se ven claramente: nombre de empresa, role, periodo formateado (ej. "Jan 2023 — Present"), location, badge de tipo (full-time/contract/freelance/internship) y la fila de iconos de tecnologías usadas.
4. **Given** el visitante navega con teclado, **When** tabula hasta un `JobCard`, **Then** el card recibe un focus ring visible (sin perder contraste WCAG) y, si es expandible, se puede abrir con `Enter` o `Space`.
5. **Given** el visitante visualiza la página en mobile (≤768px), **When** los `JobCard` se renderizan, **Then** el layout colapsa a una sola columna con tipografía fluid usando `clamp()` y mantiene legibilidad y contraste.

---

### User Story 2 — Visitante filtra experiencia por stack tecnológico (Priority: P2)

Un visitante (reclutador técnico o technical lead) quiere ver rápidamente en qué posiciones se usó una tecnología concreta (por ejemplo "React" o "TypeScript") para evaluar profundidad de experiencia.

**Why this priority**: Aporta valor tangible para la decisión de contacto. Es P2 y no P1 porque el valor principal del componente es el renderizado (US-1); el filtrado es una mejora de discovery que se apoya en el contexto `IsIconCheckFilter` ya existente en el proyecto.

**Independent Test**: Se valida haciendo clic en uno o varios iconos de tecnología del `FilterProjects` (o de un nuevo `FilterJobs` si se decide desacoplar), y verificando que los `JobCard` se reordenan por número de matches descendente, ocultando o reubicando los que no coincidan según la decisión de UX final.

**Acceptance Scenarios**:

1. **Given** el visitante está en la sección de experiencia, **When** activa el filtro "React", **Then** los `JobCard` con `stack.react` definido aparecen antes que los que no lo tienen, y el orden se actualiza en <100ms.
2. **Given** el visitante activa varios filtros (React + TypeScript), **When** la lógica de ordenamiento se ejecuta, **Then** los jobs con ambas tecnologías aparecen primero, seguidos de los que tienen solo una, y al final los que no tienen ninguna.
3. **Given** ningún filtro está activo, **When** la sección carga, **Then** los `JobCard` se muestran en su orden cronológico por defecto (más reciente primero).
4. **Given** el visitante interactúa con los filtros, **When** los jobs se reordenan, **Then** las animaciones de repositioning respetan `prefers-reduced-motion: reduce` (sin transiciones bruscas o motion sickness).

---

### User Story 3 — Visitante explora logros detallados de un puesto (Priority: P3)

Un visitante quiere ver información ampliada de un puesto concreto (logros, métricas, links a proyectos) sin abandonar la sección.

**Why this priority**: El contenido extendido es valioso pero no bloqueante. La P3 refleja que la mayoría del valor de la sección se entrega en el render del card base (US-1). El detalle extendido puede entregarse mediante expansión inline del card o un modal análogo a `ProjectModal`, decisión que se delega al Designer.

**Independent Test**: Se valida activando el modo expandido/detalle de un `JobCard` y verificando que la lista de `achievements[]` y los `links` opcionales son accesibles, navegables por teclado y cerrables con `Escape` o un botón explícito.

**Acceptance Scenarios**:

1. **Given** un `JobCard` es expandible, **When** el visitante hace clic en "Ver más" o pulsa `Enter` sobre el card, **Then** la sección de `achievements[]` se revela con animación de fade-in + height animation, y el foco se mueve al contenido expandido.
2. **Given** el card está expandido, **When** el visitante pulsa `Escape`, **Then** el card colapsa y el foco vuelve al trigger que lo abrió.
3. **Given** un job tiene `links.companyLink` definido, **When** el card expande, **Then** se muestra un `LinkButton` que abre la URL en nueva pestaña con `rel="noopener noreferrer"` y `target="_blank"`.
4. **Given** un job no tiene `achievements[]`, **When** el visitante intenta expandir, **Then** el botón "Ver más" NO se renderiza (estado vacío por defecto).

---

### Edge Cases

- **EC-001 — Job sin `achievements[]`**: El botón "Ver más" no se renderiza; el card muestra solo `description[]` y `stack`. Si el `JobCard` es siempre expandible, la sección de achievements se omite limpiamente sin reservar espacio fantasma.
- **EC-002 — Job con `stack` vacío (`{}`)**: La fila de iconos de tecnologías se oculta por completo y el card no deja altura residual. No se renderiza un placeholder ("No technologies") porque falsearía la información.
- **EC-003 — Job con `current: true` y `endDate` definido (o viceversa)**: Se prioriza `current: true` para mostrar "Present" en el period; `endDate` se ignora silenciosamente. Un warning en consola en modo dev es aceptable.
- **EC-004 — `period` con formato no ISO o malformado**: El componente DEBE aceptar un `period` ya formateado como string (ej. "Jan 2023 — Present") y NO intentar parsearlo; la responsabilidad de formateo queda en la capa de datos (`src/data/jobs.js`). El componente hace fallback mostrando `period` raw sin tirar errores.
- **EC-005 — `companyLogo` 404 o URL inválida**: Se renderiza un placeholder con las iniciales de la empresa (primer caracter de cada palabra) sobre fondo gradient cyan→green, manteniendo la estética y la accesibilidad (`alt=""` decorativo + `aria-hidden="true"`).
- **EC-006 — Listas vacías**: Si la fuente `src/data/jobs.js` devuelve `[]`, la sección entera (título + grid) se oculta y se muestra un fallback accesible: `<p role="status">No experience entries available.</p>`.
- **EC-007 — `description[]` con un único elemento muy largo (>500 chars)**: El card respeta el contenido sin truncar, pero el `paragraph-max-width: 60ch` de la constitución aplica para legibilidad. Se permite scroll interno en la sección expandida.
- **EC-008 — Múltiples jobs en la misma empresa**: Permitido y común (ej. promotions). El `id` único evita warnings de React keys. Visualmente cada card mantiene su línea de tiempo independiente; opcionalmente el Designer puede añadir un sutil conector vertical para denotar continuidad.
- **EC-009 — `prefers-reduced-motion: reduce` activo**: Las animaciones GSAP de entrada se reducen a un fade simple de 200ms o se desactivan completamente; la transición de filtro es instantánea. El componente sigue siendo funcional y accesible.
- **EC-010 — JS deshabilitado (progressive enhancement)**: El `JobCard` se renderiza como HTML semántico estático con `<article>` + `<h3>` para company/role, `<time>` para period, y `<ul>` para stack (como texto plano, sin iconos SVG dinámicos). Se preserva toda la información crítica.
- **EC-011 — `tags` con caracteres especiales o muy largos**: Se truncan visualmente con `text-overflow: ellipsis` y se aplica `word-break: break-word` para evitar overflow horizontal en mobile.
- **EC-012 — Rate-limiting / bloqueo de IP externo (imgSrc)**: NO APLICA — el `JobCard` no consume recursos externos. Las imágenes opcionales (`companyLogo`) son URLs a `public/` o assets locales del portfolio. Sin llamadas a LinkedIn, CDNs externos ni APIs.

---

## 2. Requirements *(mandatory)*

### Functional Requirements

#### Renderizado del componente

- **FR-001**: El `JobCard` DEBE renderizarse como un `<article>` semántico con `aria-labelledby` enlazando al heading del card (company + role), para que lectores de pantalla anuncien el contenido como una unidad coherente.
- **FR-002**: El `JobCard` DEBE mostrar, en este orden visual: badge de `type` (full-time/part-time/contract/freelance/internship), `company` (h3), `role` (h4 con styling diferenciado, ej. gradient text), `period` (h5 con `<time>` semántico), `location` + indicador `remote`, `description[]` (párrafos), `stack` (fila de iconos) y, opcionalmente, la fila de `tags` y los `links`.
- **FR-003**: El componente DEBE aceptar la prop `job` (objeto `Job`) y NO acoplarse a la fuente de datos; los datos vendrán de `src/data/jobs.js` por consistencia con `ProjectCard` (Asunción A3).
- **FR-004**: Si `job.achievements` es `undefined` o `length === 0`, el botón "Ver más" NO DEBE renderizarse. Si el card es siempre expandible, la sección de achievements se omite sin reservar altura.
- **FR-005**: Si `job.stack` es un objeto vacío `{}` o no contiene entradas renderizables, la fila de iconos DEBE ocultarse por completo (no mostrar placeholder).
- **FR-006**: Si `job.companyLogo` está presente, DEBE renderizarse con `<img loading="lazy" alt="" aria-hidden="true">` (decorativo) dentro de un contenedor con `border-radius` consistente. Si falla la carga, el `onError` dispara el placeholder de iniciales (EC-005).
- **FR-007**: El badge de `type` DEBE usar un color semántico consistente con la constitución (cyan/green) y un `aria-label` descriptivo (ej. `<span aria-label="Full-time employment">FT</span>` o texto visible según decisión del Designer).
- **FR-008**: Los `links` (company, project, reference) DEBEN abrirse en nueva pestaña con `rel="noopener noreferrer"` y `target="_blank"`, siguiendo el patrón de `LinkButton` ya en el proyecto (FR-009 de 001).

#### Animaciones

- **FR-009**: El `JobCard` DEBE usar GSAP ScrollTrigger (no CSS transitions) para la animación de entrada, con `autoAlpha: 0→1` y `translateY: 30px→0`, disparada cuando el card entra al viewport (`top bottom - 50`).
- **FR-010**: La animación de entrada DEBE respetar `prefers-reduced-motion: reduce` consultando `window.matchMedia('(prefers-reduced-motion: reduce)').matches` y aplicando un fallback de fade 200ms sin `translate`.
- **FR-011**: El `ScrollTrigger` DEBE limpiarse en el `return` del `useEffect` (`.kill()`) para evitar memory leaks, replicando el patrón de la constitución (línea 89 del spec 001).
- **FR-012**: El filtrado de jobs (US-2) DEBE reordenar con una transición de `position` animada por GSAP o por FLIP technique, con duración <300ms y `prefers-reduced-motion` deshabilitado.
- **FR-013**: Si la sección completa (US-2 filter) activa animaciones, DEBE mantener 60fps en dispositivos modernos (medido con DevTools Performance panel), nunca más de 50fps en gama baja (Constitución: "Performance puede relajarse a 50fps mínimo en dispositivos de gama baja").

#### Accesibilidad

- **FR-014**: El `JobCard` DEBE ser completamente navegable por teclado: `Tab` para focus, `Enter`/`Space` para expandir/colapsar (si aplica), `Escape` para cerrar, con focus visible de al menos 2px outline y contraste AA (ratio ≥3:1 contra el fondo `#111117`).
- **FR-015**: El componente DEBE pasar el audit de `jest-axe` sin violaciones (Constitución Quality Gate #5).
- **FR-016**: El `period` DEBE envolverse en `<time>` semántico con `dateTime` apuntando al `startDate` en formato ISO (`YYYY-MM`) para que las máquinas comprendan la cronología, sin afectar el render visual del texto pre-formateado.
- **FR-017**: El componente NO DEBE atrapar el foco de manera permanente (focus trap) salvo en el caso de un modal análogo a `ProjectModal`; en expansión inline el foco fluye naturalmente.

#### Responsive & Internacionalización

- **FR-018**: El `JobCard` DEBE ser responsive con breakpoints: 1 columna en mobile (≤768px), 2 columnas en tablet (769–1199px) y grid de hasta 3 columnas en desktop (≥1200px), con `grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))` o el equivalente decidido por Designer.
- **FR-019**: El tipografía del card DEBE usar las CSS variables `--font-size-subtitle`, `--font-size-paragraph` y `--paragraph-max-width: 60ch` ya definidas en el Design System.
- **FR-020**: El componente DEBE ser agnóstico al idioma: los textos visibles (`type` badge, "Ver más", etc.) se pasan como props o se localizan en una capa superior; NO se hardcodean strings en español en el `.jsx`. (Asunción A5: i18n queda fuera del scope de esta feature, pero el componente no debe impedirlo.)

#### Datos y Contrato

- **FR-021**: El componente DEBE consumir el objeto `Job` definido en §3 (Key Entities) y DEBE lanzar `Error` en consola (modo dev) si faltan campos `required` (`company`, `role`, `period`, `startDate`, `current`, `location`, `remote`, `description`, `stack`).
- **FR-022**: El componente DEBE tener una `PropTypes` (o, si se decide migrar, TypeScript types) declaración explícita del contrato `Job`, exportada y reutilizable por `src/data/jobs.js` y los tests.

---

### Key Entities *(include if feature involves data)*

#### `Job` — Entidad principal

Representa una posición laboral / experiencia profesional en el portfolio. Inspirada en el contrato de `Project` (mismo proyecto) y en estándares de portfolio profesional (LinkedIn, GitHub README, JSON Resume schema).

```javascript
Job {
  // === Identidad ===
  id: string,                          // REQUIRED. Slug único estable (ej. "araldev-tech-lead-2024")
                                       // Usado como `key` de React, ancla de scroll y para tests.

  // === Información de la empresa ===
  company: string,                     // REQUIRED. Nombre visible de la empresa.
  companyLogo?: string,                // OPTIONAL. Ruta a asset local (ej. "/logos/acme.webp") o undefined.
                                       // Se prefiere asset local; sin URLs externas para no acoplar
                                       // a CDNs no confiables ni generar mixed-content en GitHub Pages.

  // === Información del puesto ===
  role: string,                        // REQUIRED. Título del puesto (ej. "Frontend Tech Lead").
  type: 'full-time'                    // REQUIRED. Tipo de empleo. Valores permitidos (enum cerrado):
      | 'part-time'                    //   - 'full-time'   → FT badge
      | 'contract'                     //   - 'part-time'   → PT badge
      | 'freelance'                    //   - 'contract'    → CT badge
      | 'internship',                  //   - 'freelance'   → FL badge
                                       //   - 'internship'  → IN badge

  // === Cronología ===
  period: string,                      // REQUIRED. Texto ya formateado para mostrar al usuario.
                                       //   Ej. "Jan 2023 — Present", "2021 — 2022", "Sep 2020 — Mar 2021".
                                       //   El componente NO parsea este string; lo muestra tal cual.
  startDate: string,                   // REQUIRED. Fecha de inicio en formato ISO "YYYY-MM".
                                       //   Usada para ordenamiento cronológico (descendente) y
                                       //   para el atributo `dateTime` de <time>.
  endDate?: string,                    // OPTIONAL. Fecha de fin en formato ISO "YYYY-MM".
                                       //   Si `current: true`, debe ser `undefined` (no null).
  current: boolean,                    // REQUIRED. `true` si el puesto está activo en la fecha de
                                       //   última actualización del portfolio.

  // === Ubicación ===
  location: string,                    // REQUIRED. Ciudad/país o "Remote" (ej. "Madrid, Spain",
                                       //   "Barcelona, Spain", "Remote", "Hybrid — Madrid").
  remote: boolean,                     // REQUIRED. `true` si fue 100% remoto, `false` si fue
                                       //   presencial o híbrido. El badge "Remote" se muestra solo
                                       //   si `remote: true` (el híbrido se denota en `location`).

  // === Contenido descriptivo ===
  description: string[],               // REQUIRED. Array de párrafos cortos (1-3 elementos).
                                       //   Cada elemento es un string plano, sin HTML.
                                       //   Mismo shape que `Project.description` para consistencia.
  achievements?: string[],             // OPTIONAL. Lista de logros clave del puesto (bullet points).
                                       //   Si está presente y tiene length > 0, habilita la
                                       //   vista expandible. Si está vacío o undefined, el card
                                       //   no es expandible y se omite "Ver más" (EC-001).

  // === Stack y metadata ===
  stack: {                             // REQUIRED. Mismo shape que `Project.tech`.
    [techKey: string]: ReactNode       //   Clave: identificador de tecnología ('react', 'ts', etc.)
  },                                   //   Valor: el componente <Icon> correspondiente.
                                       //   Si el objeto está vacío, la fila no se renderiza (FR-005).
  tags?: string[],                     // OPTIONAL. Keywords cortos para categorización y
                                       //   búsqueda interna (no se usan para filtrado visual).
  links?: {                            // OPTIONAL. Enlaces externos del puesto.
    companyLink?: string,              //   URL a la web de la empresa o página de la posición.
    projectLink?: string,              //   URL a un proyecto destacado realizado en el puesto.
    referenceLink?: string             //   URL a carta de recomendación, LinkedIn post, etc.
  }
}
```

#### `JobType` — Enum auxiliar

```javascript
// Valores permitidos para Job.type (exportados para reutilización en datos y tests)
type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'freelance'
  | 'internship';
```

#### `JobStackKey` — Catálogo cerrado (subconjunto de `Project.tech`)

Para mantener consistencia visual, las claves permitidas en `Job.stack` son las mismas que `Project.tech`: `js, react, css, html, ts, tailwind, git, gitHub, gsap, storybook, vite, npm`. El componente reusa los iconos de `src/components/Icons/Icons.jsx` sin introducir nuevas dependencias (Constitución: "Prohibido agregar dependencias sin justificación documentada en el spec.md").

#### Relación con entidades existentes

- **`Project`**: El `JobCard` NO se relaciona directamente con proyectos específicos (no se renderiza una lista de proyectos dentro de un job). El cross-reference se hace en la capa de datos vía `links.projectLink` cuando aplica.
- **`TechIcon`**: Reutilizado textualmente. Mismo import path que `ProjectCard`.
- **`IsIconCheckFilter` context (opcional)**: Si se implementa el filtrado (US-2), el `JobCard` puede consumir este contexto existente para mantener paridad de comportamiento con `ProjectCard`. La decisión de crear un `IsIconCheckFilterJobs` separado o reutilizar el mismo es del Designer/Architect.

---

## 3. Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cada `JobCard` se renderiza con su contenido contractual completo en <50ms tras la hidratación, manteniendo el FCP del portfolio en <3s (Constitución: "El sitio debe cargar en menos de 3 segundos en conexiones estándar").
- **SC-002**: La animación de entrada de los `JobCard` se ejecuta a 60fps en Chrome/Firefox/Safari desktop modernos y a mínimo 50fps en dispositivos gama baja (medido con DevTools Performance panel; Constitución línea 112).
- **SC-003**: El filtrado de jobs (US-2) responde en <100ms tras el click, equivalente al SC-004 del spec 001 para `ProjectCard`.
- **SC-004**: El componente pasa el audit de `jest-axe` con 0 violaciones y valida los ratios de contraste AA en el badge de `type`, headings y links (Constitución WCAG 2.1 AA).
- **SC-005**: La cobertura de tests del componente (Vitest + @testing-library/react) alcanza ≥80% en líneas, funciones y branches (Constitución Quality Gate #1).
- **SC-006**: El componente es 100% funcional con `prefers-reduced-motion: reduce` activo y con JS deshabilitado (graceful degradation), entregando el contenido crítico vía HTML semántico.
- **SC-007**: El bundle del componente añade <2KB gzipped al build de producción, sin nuevas dependencias en `package.json` (todos los iconos y utilidades se reutilizan del proyecto existente).

---

## 4. Assumptions

- **A1**: El stack técnico del `JobCard` es el mismo que el del `ProjectCard`: React 18.3.1 + GSAP 3.13.0 (ScrollTrigger) + CSS Modules. NO se introducen nuevas dependencias. Todo el código reutiliza hooks existentes (`useFadeInElement`) y la librería de iconos (`src/components/Icons/Icons.jsx`).
- **A2**: El renderizado del componente es responsabilidad de un nuevo `src/components/JobCard/JobCard.jsx` con su `JobCard.module.css` homólogo, siguiendo la convención de carpetas de los componentes existentes (001 spec, §10).
- **A3**: Los datos de jobs vivirán en `src/data/jobs.js` exportando un `Array<Job>`, mismo patrón que `src/data/projects.js`. La fuente es estática (no API externa).
- **A4**: La sección de experiencia se integra en la misma SPA, en una nueva `<section id="experience">` cuyo placement exacto (entre Projects y AboutMe, o entre AboutMe y Contact) es decisión del Designer/Architect. El `NavHeader` se actualizará en una iteración separada para incluir el nuevo anchor (out of scope aquí salvo decisión contraria del Designer).
- **A5**: La internacionalización (i18n) está fuera del scope de esta feature (consistente con A8 del spec 001). Sin embargo, el componente se diseña agnóstico: los textos visibles se pasan como props (`expandLabel`, `collapseLabel`, etc.) para permitir i18n futura sin refactor.
- **A6**: El `JobCard` puede ser visualmente similar al `ProjectCard` (mismo clip-path hexagonal, misma paleta, misma fila de iconos), pero el Designer tiene libertad total para proponer una estética diferenciada que comunique "trayectoria" en lugar de "proyecto" (ej. timeline vertical, conector entre cards, badge de duración, etc.). El "cómo" visual NO se especifica aquí.
- **A7**: El comportamiento de "Ver más" / expansión se implementa como expansión inline del propio card (no como modal separado), para diferenciarse de `ProjectModal` y mantener la sección autocontenida. Si el Designer decide modal, será decisión de él y requerirá `JobModal` homólogo. **Esto queda ABIERTO como decisión del Designer**.
- **A8**: El filtro de jobs (US-2) puede reutilizar el `IsIconCheckFilter` context existente o crear un `IsIconCheckFilterJobs` paralelo. La decisión de reusar vs. desacoplar es del Architect (02/03). Esta spec documenta ambos comportamientos como aceptables siempre que se respete SC-003.
- **A9**: El componente NO se renderiza dentro de `ProjectCard` ni viceversa. Son componentes hermanos consumiendo entidades distintas.
- **A10**: Se asume que habrá entre 3 y 8 jobs en el portfolio (basado en una trayectoria profesional de ~5 años). La grid responsive está optimizada para 4-6 items visibles. Más de 8 items puede requerir paginación/virtualización (out of scope de esta feature).

---

## 5. Out of Scope *(mandatory)*

Explícitamente NO forman parte de esta feature (ni se documentarán ni se implementarán aquí):

- **OOS-01 — Integración con LinkedIn API / GitHub API / JSON Resume fetchers**: Los datos son estáticos y hardcoded en `src/data/jobs.js`. No se hace scraping ni fetching externo.
- **OOS-02 — CMS headless para edición dinámica** (Sanity, Contentful, Strapi, etc.): La actualización de jobs requiere editar el archivo JS y redeploy.
- **OOS-03 — Internacionalización (i18n) full**: El componente es agnóstico (A5), pero no se implementa `react-i18next` ni se traducen los textos de la sección de experiencia en esta iteración.
- **OOS-04 — Edición inline desde la UI**: No hay un panel de admin ni modo "edit" en producción. Los jobs se gestionan en código.
- **OOS-05 — Información salarial, equity, beneficios**: Por privacidad y porque distrae del propósito del portfolio. Se omite `salary`, `equity`, `benefits` del contrato.
- **OOS-06 — Sistema de reviews/ratings de empresas** (como Glassdoor embebido): No aplica al propósito del portfolio.
- **OOS-07 — Timeline visual cronológico con scroll horizontal**: La idea está mencionada en A6 como opción del Designer, pero su implementación detallada (con connectors, dots, etc.) es decisión del Designer; si se elige, se documentará en `design.md` de esta feature.
- **OOS-08 — Persistencia de "jobs favoritos" o bookmarks**: No se requiere state de usuario. El portfolio es read-only.
- **OOS-09 — Generación automática de CV PDF desde los jobs**: El CV es un asset estático pre-existente (`public/cv-araldev.pdf`); no se regenera dinámicamente desde `src/data/jobs.js` en esta feature.
- **OOS-10 — Tests E2E con Playwright para la sección de experiencia**: Los tests E2E completos del portfolio son out of scope; se cubren con unit + integration tests del componente (Vitest + @testing-library/react + jest-axe).
- **OOS-11 — Animación de "typewriter" en la descripción del job o efectos de sonido**: Animaciones con propósito (Constitución VI) — el efecto debe comunicar, no decorar.
- **OOS-12 — Métricas/analitycs de interacción con JobCards** (clicks, hovers, expand rate): Tracking no está implementado en el proyecto (Asunción A9 del spec 001).

---

## 6. Open Questions for the User / Designer / Architect

Estas preguntas NO bloquean la consolidación del spec (el contrato está propuesto y es accionable), pero se dejan explícitas para que el equipo las resuelva en las siguientes fases del pipeline. Si alguna respuesta cambia materialmente la implementación, el spec se revisará.

1. **Placement de la sección**: ¿La nueva sección `Experience` va **entre `Projects` y `AboutMe`**, o **entre `AboutMe` y `Contact`**? (Esto afecta el orden narrativo del portfolio y la decisión de actualizar el `NavHeader`.)
2. **Filtrado (US-2)**: ¿Se reutiliza el `IsIconCheckFilter` context existente (con misma barra de filtros que Projects) o se crea un `FilterJobs` independiente con su propio estado? (Implicación arquitectónica: 02-Architect.)
3. **Expansión inline vs. modal (A7)**: ¿El "Ver más" expande el propio card inline, o abre un `JobModal` análogo a `ProjectModal`? (Decisión de UX, 02-Designer.)
4. **`companyLogo`**: ¿Se sube como asset a `public/logos/` o se omite en la primera iteración y se renderiza solo el placeholder de iniciales? (Decisión de assets, 02-Designer.)

---

**Version**: 0.1.0 | **Created**: 2026-06-01 | **Status**: Draft → Ready for Review

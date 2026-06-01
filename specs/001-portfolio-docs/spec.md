# Feature Specification: araldev-portfolio

**Feature Branch**: `001-portfolio-docs`

**Created**: 2026-06-01

**Status**: Finalizado

**Input**: Documentación del portfolio existente del desarrollador Frontend Arturo Alba García (Araldev)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante potencial descubre el portfolio (Priority: P1)

Un reclutador o cliente visita el portfolio para conocer las habilidades y proyectos del desarrollador.

**Why this priority**: Es el caso de uso principal del portfolio — atraer oportunidades laborales y mostrar competencias técnicas.

**Independent Test**: Puede ser validado completamente abriendo la URL del portfolio y navegando por las secciones sin autenticación ni datos externos.

**Acceptance Scenarios**:

1. **Given** el visitante abre la URL del portfolio, **When** la página carga, **Then** la animación de título con scroll se ejecuta correctamente mostrando "Arturo Alba García" y "Frontend Developer"
2. **Given** el visitante hace scroll, **When** la animación de entrada termina, **Then** la sección Hero muestra correctamente el nombre, título, descripción y botones sociales (LinkedIn, GitHub, Gmail, Discord)
3. **Given** el visitante hace scroll hacia abajo, **When** llega a la sección About Me, **Then** ve su foto, branding personal y texto biográfico con animaciones de fade-in
4. **Given** el visitante hace scroll hacia Projects, **When** la sección carga, **Then** ve los 3 proyectos (v12-ui, Listening Maze, English Web) con sus descripciones y tecnologías

---

### User Story 2 - Visitante filtra y explora proyectos (Priority: P1)

Un visitante quiere encontrar proyectos específicos según la tecnología utilizada.

**Why this priority**: Permite a los reclutadores encontrar rápidamente proyectos relevantes para sus necesidades técnicas.

**Independent Test**: Puede probarse haciendo clic en los iconos de filtro de tecnologías y verificando que los proyectos se reordenan según las tecnologías seleccionadas.

**Acceptance Scenarios**:

1. **Given** el visitante está en la sección Projects, **When** hace clic en el filtro "React", **Then** el proyecto v12-ui aparece primero por tener más tecnologías coincidentes
2. **Given** el visitante hace clic en múltiples filtros (React + TypeScript), **When** activa los filtros, **Then** los proyectos se reordenan dinámicamente sin recargar la página
3. **Given** el visitante hace clic en "Mostrar más" de un proyecto, **When** se abre el modal, **Then** ve los detalles del proyecto con animaciones de entrada y puede cerrar con el botón X o la tecla Escape
4. **Given** el visitante está en el modal de proyecto, **When** hace scroll por los detalles, **Then** ve las secciones de características con animaciones de reveal progresivo

---

### User Story 3 - Visitante descarga CV y contacta (Priority: P2)

Un visitante interesado quiere descargar el CV o contactar directamente al desarrollador.

**Why this priority**: Facilita la conversión de visitante a prospecto/cliente.

**Independent Test**: Puede probarse descargando el CV (verificando que el archivo PDF se descarga) y enviando un formulario de contacto (verificando el envío real via EmailJS).

**Acceptance Scenarios**:

1. **Given** el visitante está en la sección Hero, **When** hace clic en "Download CV", **Then** se descarga el archivo `cv-araldev.pdf`
2. **Given** el visitante hace scroll hasta Contact, **When** llena el formulario (nombre, email, asunto, mensaje), **Then** el reCAPTCHA invisible se ejecuta y al completar el envío, EmailJS envía el correo
3. **Given** el visitante envía el formulario, **When** el envío es exitoso, **Then** aparece el mensaje "Successfully sent" en verde durante 5 segundos
4. **Given** el visitante intenta enviar sin completar el CAPTCHA, **When** hace clic en Send, **Then** ve el error "Please complete the CAPTCHA"

---

### User Story 4 - Navegación fluida entre secciones (Priority: P2)

Un visitante quiere navegar rápidamente a cualquier sección del portfolio.

**Why this priority**: Mejora la experiencia de usuario con navegación intuitiva y smooth scroll.

**Independent Test**: Puede probarse haciendo clic en cada enlace del NavHeader y verificando el scroll animado a la sección correspondiente.

**Acceptance Scenarios**:

1. **Given** el visitante hace scroll, **When** el header entra en la vista, **Then** el NavHeader aparece con animación desde arriba
2. **Given** el visitante hace clic en "Projects" en el NavHeader, **When** hace clic, **Then** Lenis smooth scroll lleva a la sección Projects
3. **Given** el visitante hace scroll hacia abajo, **When** supera cierto umbral, **Then** el botón "NavToTop" aparece para volver rápidamente al inicio
4. **Given** el visitante está en mobile, **When** abre el menú hamburguesa, **Then** el overlay se muestra y los enlaces funcionan correctamente

---

### Edge Cases

- **Proyectos sin demoLink**: Si un proyecto no tiene demo disponible (como v12-ui que solo tiene npm, storybook y código), los botones de Demo no se renderizan
- **Filtros sin proyectos coincidentes**: Si se activan filtros que ningún proyecto cumple, se muestran todos los proyectos ordenados por relevancia (0 matches = al final)
- **Modal en mobile**: El modal es responsive y su contenido es scrollable dentro del viewport
- **EmailJS fallido**: Si el servicio de EmailJS falla, se muestra el mensaje de error devuelto por la API
- **Imágenes 404**: Los proyectos tienen URLs de imágenes hardcodeadas; si faltan se muestra placeholder
- **Lenis scroll conflict**: Cuando se abre el modal, Lenis se pausa (`lenis.stop()`) y se reanuda al cerrar
- **GSAP ScrollTrigger cleanup**: Todos los ScrollTriggers se limpian adecuadamente en el return de useEffect para evitar memory leaks

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El portfolio DEBE mostrar una animación de título en la entrada usando GSAP ScrollTrigger con efecto de mask SVG
- **FR-002**: El NavHeader DEBE ocultarse al hacer scroll hacia abajo y aparecer al hacer scroll hacia arriba (ScrollTrigger)
- **FR-003**: El botón NavToTop DEBE aparecer cuando el scroll supera cierto umbral y permitir volver al inicio con smooth scroll
- **FR-004**: Los proyectos DEBEN poder filtrarse por tecnología (js, react, css, html, ts, git, gitHub) y ordenarse dinámicamente
- **FR-005**: El ProjectModal DEBE abrirse al hacer clic en "Mostrar más", pausar Lenis, y cerrarse con Escape o botón de cerrar
- **FR-006**: El formulario de contacto DEBE validar todos los campos como requeridos, ejecutar reCAPTCHA invisible, y enviar via EmailJS
- **FR-007**: Todas las secciones DEBEN tener animaciones de fade-in/scroll usando GSAP y los hooks personalizados (useFadeInElement, useFadeInText)
- **FR-008**: El portfolio DEBE funcionar en desktop y mobile con CSS responsive y breakpoints adecuados
- **FR-009**: Los enlaces sociales (LinkedIn, GitHub, Gmail, Discord) DEBEN abrirse en nueva pestaña con rel="noopener noreferrer"
- **FR-010**: El footer DEBE mostrar información de contacto y navegación secundaria con enlaces funcionales

### Key Entities

- **Project**: Representa un proyecto del portfolio con id, imgSrc, title, description[], tech{}, links (npmLink, storybookLink, demoLink, codeLink), details[]
- **TechIcon**: Icono SVG de tecnología (js, react, css, html, ts, git, gitHub, gsap, storybook, vite, npm)
- **SocialIcon**: Icono SVG para redes sociales (linkedin, discord, gmail, gitHub)
- **FilterState**: Estado del contexto IsIconCheckFilter con booleanos para cada tecnología
- **ContactForm**: Datos del formulario con name, email, subject, message, time, g-recaptcha-response

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tiempo de carga inicial de la página menor a 3 segundos en conexión estándar (3G)
- **SC-002**: Todas las animaciones GSAP se ejecutan sin jank (60fps) en dispositivos modernos
- **SC-003**: El formulario de contacto envía emails exitosamente через EmailJS y muestra feedback en menos de 5 segundos
- **SC-004**: Los filtros de proyectos responden en menos de 100ms al hacer clic
- **SC-005**: El modal de proyecto se abre y cierra con animaciones fluidas (400-600ms)
- **SC-006**: Navegación smooth con Lenis funciona en todos los navegadores modernos
- **SC-007**: El portfolio es completamente funcional sin JavaScript bloqueante (graceful degradation de animaciones)

---

## Assumptions

- **A1**: Los assets estáticos (imágenes de proyectos, CV PDF) están disponibles en las rutas especificadas en el código
- **A2**: Las variables de entorno (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY, VITE_RECAPTCHA_INVISIBLE_SITE_KEY) están configuradas correctamente en el entorno de producción
- **A3**: El archivo `cv-araldev.pdf` existe en `public/` o `src/public/` para la descarga del CV
- **A4**: EmailJS y reCAPTCHA están correctamente configurados en el servicio de email del desarrollador
- **A5**: El portfolio es estático (SSR no requerido) — SPA con React + Vite
- **A6**: Mobile support es requerido (responsive design) pero tablets y phones tienen prioridad de uso sobre desktop para la navegación
- **A7**: Los proyectos mostrados son estáticos (no se fetching de API externa) — los datos vienen de `src/data/projects.js`
- **A8**: No se requiere internacionalización (i18n) — todo el contenido está en español e inglés según preferencia del desarrollador
- **A9**: Analytics y tracking no están implementados (out of scope)
- **A10**: El SEO básico se maneja via标签 meta en el HTML generado por Vite

---

**Version**: 1.0.0 | **Ratified**: 2026-06-01 | **Last Amended**: 2026-06-01

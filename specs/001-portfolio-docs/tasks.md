# Tasks: araldev-portfolio Documentation

**Feature Branch**: `001-portfolio-docs`
**Created**: 2026-06-01
**Status**: En progreso

---

## 1. Verificación de Implementación vs Spec

### 1.1 Verificar FR-001: Animación de título GSAP ScrollTrigger con SVG mask

- [ ] **Verificar** que `AnimatedTitle.jsx` implementa correctamente la animación de entrada con GSAP ScrollTrigger y efecto de mask SVG
- [ ] **Verificar** que `useAnimatedTitle.js` limpia correctamente los ScrollTriggers en el return del useEffect (línea ~299-310)
- [ ] **Verificar** que el efecto de mask SVG revela el texto del título progresivamente durante el scroll
- [ ] **Documentar** cualquier discrepancia con el spec

### 1.2 Verificar FR-002: NavHeader hide/show en scroll

- [ ] **Verificar** que `useAnimatedNavHeader.js` implementa hide al hacer scroll down y show al hacer scroll up
- [ ] **Verificar** que el NavHeader tiene los estilos de animación de entrada/salida (opacity, transform)
- [ ] **Documentar** el umbral de scroll utilizado si está implementado

### 1.3 Verificar FR-003: Botón NavToTop

- [ ] **Verificar** que `NavToTop.jsx` aparece cuando el scroll supera un umbral definido
- [ ] **Verificar** que el botón permite volver al inicio con smooth scroll
- [ ] **Documentar** el umbral de visibilidad utilizado

### 1.4 Verificar FR-004: Filtrado de proyectos por tecnología

- [ ] **Verificar** que `FilterProjects.jsx` permite filtrar por las tecnologías especificadas (js, react, css, html, ts, git, gitHub)
- [ ] **Verificar** que `useSortProjects.js` ordena los proyectos dinámicamente según las tecnologías coincidentes
- [ ] **Verificar** que los proyectos sin match se muestran al final
- [ ] **Documentar** la lógica de ordenamiento implementada

### 1.5 Verificar FR-005: ProjectModal con pausado de Lenis

- [ ] **Verificar** que `ProjectModal.jsx` se abre al hacer clic en "Mostrar más"
- [ ] **Verificar** que Lenis se pausa (`lenis.stop()`) al abrir el modal
- [ ] **Verificar** que Lenis se reanuda (`lenis.start()`) al cerrar el modal
- [ ] **Verificar** que el modal se cierra con la tecla Escape y el botón X
- [ ] **Verificar** que el modal usa `createPortal` para renderizarse en `document.body`
- [ ] **Documentar** la implementación de animaciones del modal

### 1.6 Verificar FR-006: Formulario de contacto con EmailJS y reCAPTCHA

- [ ] **Verificar** que `ContactSection.jsx` tiene validación de campos requeridos
- [ ] **Verificar** que `useSendEmailJs.js` implementa reCAPTCHA invisible antes del envío
- [ ] **Verificar** que el formulario envía vía EmailJS con las variables de entorno correctas
- [ ] **Verificar** que se muestra feedback de éxito/error al usuario
- [ ] **Documentar** las variables de entorno requeridas (VITE_EMAILJS_*)

### 1.7 Verificar FR-007: Animaciones fade-in con GSAP

- [ ] **Verificar** que `useFadeInElement.js` implementa animaciones de entrada con scroll trigger
- [ ] **Verificar** que `useFadeInText.js` implementa animaciones de texto con caracteres
- [ ] **Verificar** que las secciones principales (Hero, About, Projects, Contact) usan estos hooks
- [ ] **Documentar** las direcciones de animación soportadas (up, down, left, right)

### 1.8 Verificar FR-008: Diseño responsive mobile-first

- [ ] **Verificar** que los breakpoints definidos en `design.md` están correctamente implementados en los CSS modules
- [ ] **Verificar** que el menú hamburguesa funciona correctamente en mobile
- [ ] **Verificar** que los ProjectCards son responsive (425px → 350px en mobile)
- [ ] **Documentar** los breakpoints implementados

### 1.9 Verificar FR-009: Enlaces sociales con security attributes

- [ ] **Verificar** que todos los enlaces sociales usan `target="_blank"` y `rel="noopener noreferrer"`
- [ ] **Verificar** en `HeroSection.jsx` (líneas 27-38) y `Footer.jsx`
- [ ] **Documentar** cualquier enlace que no cumpla con los atributos de seguridad

### 1.10 Verificar FR-010: Footer funcional

- [ ] **Verificar** que el `Footer.jsx` muestra información de contacto y navegación secundaria
- [ ] **Verificar** que los enlaces del footer son funcionales
- [ ] **Documentar** el contenido del footer

---

## 2. Revisión de Código (Code Review)

### 2.1 Linting y Code Smells

- [ ] **Ejecutar** `pnpm lint` para verificar StandardJS compliance
- [ ] **Corregir** errores de lint si los hay
- [ ] **Revisar** uso de `console.warn`/`console.log` - deben ser removidos o conditionalizados para producción
- [ ] **Revisar** que no hay `any` types en código TypeScript (si aplica) o uso inadecuado de typing
- [ ] **Documentar** code smells encontrados

### 2.2 Memory Leaks y Cleanup

- [ ] **Verificar** que todos los `useEffect` tienen cleanup functions apropiados
- [ ] **Verificar** que los `ScrollTrigger` se limpian correctamente en `useAnimatedTitle.js`
- [ ] **Verificar** que los `IntersectionObserver` se disconnectan en `ProjectModal.jsx`
- [ ] **Verificar** que los `setTimeout` se limpian en `useSendEmailJs.js`
- [ ] **Documentar** cualquier riesgo de memory leak encontrado

### 2.3 GSAP + Lenis Integration

- [ ] **Verificar** que `ScrollSync.jsx` o su equivalente sincroniza RAF de GSAP con Lenis
- [ ] **Verificar** `gsap.ticker.lagSmoothing(0)` está configurado para evitar jank
- [ ] **Documentar** la arquitectura de sincronización actual

---

## 3. Testing y Coverage

### 3.1 Estado Actual de Tests

- [ ] **Confirmar** que no existen archivos de test (`*.test.js`, `*.spec.js`, `*.test.jsx`, `*.spec.jsx`)
- [ ] **Verificar** que `package.json` no tiene script de tests configurado
- [ ] **Documentar** la cobertura actual: 0% (sin tests)

### 3.2 Recomendaciones de Testing

- [ ] **Evaluar** la necesidad de agregar Jest/Vitest para testing unitario
- [ ] **Evaluar** la necesidad de agregar Playwright/Cypress para testing E2E
- [ ] **Priorizar** los siguientes componentes para testing:
  - `useSortProjects.js` - lógica de filtrado/ordenamiento
  - `useSendEmailJs.js` - manejo de errores y estados
  - `FilterProjects.jsx` - interacción de filtros
  - `ProjectModal.jsx` - apertura/cierre y animaciones
- [ ] **Documentar** un plan de testing mínimo viable si se decide implementar

---

## 4. Issues y Mejoras Documentadas

### 4.1 Bug Crítico: CV Download Link Incorrecto

- [ ] **Identificar** el bug en `HeroSection.jsx` línea 23:
  ```jsx
  <a className={styles.button_cv} href='../public/cv-araldev.pdf' download>
  ```
- [ ] **Corregir** la ruta a `/cv-araldev.pdf` (public es served desde root)
- [ ] **Verificar** que el archivo `public/cv-araldev.pdf` existe y tiene contenido válido
- [ ] **Nota**: El archivo existe pero tiene 0 bytes - debe ser reemplazado con un CV real

### 4.2 Bug: Archivo CV Vacío

- [ ] **Verificar** que `public/cv-araldev.pdf` tiene contenido real
- [ ] **Nota**: El archivo existe con 0 bytes - requiere ser reemplazado
- [ ] **Documentar** esta limitación hasta que se proporcione el archivo

### 4.3 Mejora: Dependencias Desactualizadas

- [ ] **Documentar** versiones disponibles:
  - `gsap`: 3.13.0 → 3.15.0 (minor)
  - `lenis`: 1.3.3 → 1.3.23 (patch)
  - `react`: 18.3.1 → 19.2.6 (major)
  - `react-dom`: 18.3.0 → 19.2.6 (major)
- [ ] **Evaluar** actualización de react a v19 (breaking change)
- [ ] **Evaluar** actualización de lenis a última versión patch

### 4.4 Mejora: Gestión de Entorno

- [ ] **Verificar** que las variables de entorno están documentadas
- [ ] **Documentar** variables requeridas:
  - `VITE_EMAILJS_PUBLIC_KEY`
  - `VITE_EMAILJS_SERVICE_ID`
  - `VITE_EMAILJS_TEMPLATE_ID`
  - `VITE_RECAPTCHA_INVISIBLE_SITE_KEY`
- [ ] **Verificar** que `.env` existe y tiene valores placeholder
- [ ] **Nota**: Variables sensibles NO deben commitearse

### 4.5 Mejora: SEO y Metadata

- [ ] **Verificar** que `index.html` tiene meta tags apropiados
- [ ] **Evaluar** agregar Open Graph tags para social sharing
- [ ] **Evaluar** agregar sitemap.xml
- [ ] **Documentar** estado actual de SEO

---

## 5. Checklist de Cumplimiento de Spec

### User Story 1: Visitante descubre el portfolio
- [ ] Animación de título con scroll se ejecuta correctamente
- [ ] HeroSection muestra nombre, título, descripción y botones sociales
- [ ] AboutMeSection muestra foto, branding y texto biográfico con fade-in
- [ ] ProjectsSection muestra los 3 proyectos con descripciones y tecnologías

### User Story 2: Visitante filtra proyectos
- [ ] Filtros de tecnologías funcionan correctamente
- [ ] Proyectos se reordenan dinámicamente
- [ ] Modal se abre/cierra con animaciones
- [ ] Modal es responsive y scrollable

### User Story 3: Descarga CV y contacto
- [ ] Download CV descarga el archivo (BUG: link incorrecto + archivo vacío)
- [ ] Formulario valida campos requeridos
- [ ] reCAPTCHA invisible se ejecuta
- [ ] EmailJS envía correctamente
- [ ] Feedback de éxito/error se muestra

### User Story 4: Navegación fluida
- [ ] NavHeader aparece/desaparece según dirección de scroll
- [ ] Smooth scroll funciona con Lenis
- [ ] Botón NavToTop aparece después del umbral
- [ ] Menú hamburguesa funciona en mobile

---

## 6. Edge Cases Documentados

- [ ] **Proyectos sin demoLink**: Confirmar que botones de Demo no se renderizan cuando no hay demo
- [ ] **Filtros sin proyectos coincidentes**: Verificar que se muestran todos los proyectos ordenados por relevancia
- [ ] **Modal en mobile**: Confirmar que es responsive y scrollable
- [ ] **EmailJS fallido**: Verificar que se muestra mensaje de error de la API
- [ ] **Imágenes 404**: Identificar si hay placeholders para imágenes faltantes
- [ ] **Lenis scroll conflict**: Verificar que `lenis.stop()` se llama al abrir modal
- [ ] **GSAP ScrollTrigger cleanup**: Confirmar que todos los triggers se limpian en unmount

---

**Última actualización**: 2026-06-01
**Próximo paso**: Completar verificación FR-001 a FR-010 y documentar hallazgos

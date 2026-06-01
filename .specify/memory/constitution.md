# araldev-portfolio Constitution

## Core Principles

### I. Principio de Portfolio (Propósito del Sitio)
El portfolio personal es la carta de presentación profesional del desarrollador. Debe transmitir competencia técnica, creatividad y profesionalismo. Todo contenido publicado debe ser preciso, actualizado y demostrar habilidades reales. El sitio no es un ejercicio académico sino un producto vivo que representa la marca personal del desarrollador.

### II. Principio de Performance (Velocidad y Fluidez)
La primera impresión determina la percepción de calidad. El sitio debe cargar en menos de 3 segundos en conexiones estándar y mantener 60fps en animaciones. GSAP se utilizará exclusivamente para animaciones de alto impacto; transiciones simples se manejarán con CSS. Lenis proporcionará scroll suave nativo sin comprometer la accesibilidad del teclado.

### III. Principio de Accesibilidad Universal
El sitio debe cumplir WCAG 2.1 Nivel AA como mínimo. Navegación completa por teclado, contraste adecuado, texto alternativo en imágenes, y soporte para lectores de pantalla son obligatorios. Animaciones respetarán la preferencia `prefers-reduced-motion`. El formulario de contacto incluirá validación accesible y mensajes de error claros.

### IV. Principio de Testing (TDD/SDD)
Ninguna feature se considera completa sin tests. El coverage mínimo es 80% para lógica de negocio y componentes UI críticos. Tests unitarios para hooks y utilidades, tests de integración para componentes compuestos, y validación de accesibilidad con jest-axe. Los tests deben ejecutarse exitosamente antes de cualquier merge.

### V. Principio de Seguridad (Defense in Depth)
La seguridad es responsabilidad absoluta del desarrollador. Dependencias se mantendrán actualizadas mediante auditorías periódicas con `pnpm audit`. Credenciales (EmailJS keys, reCAPTCHA keys) nunca se hardcodean; se usarán variables de entorno. Secrets en Git history requieren inmediata rotación. reCAPTCHA v3 proporcionará protección anti-spam sin afectar UX.

### VI. Principio de Animaciones Significativas
Las animaciones GSAP deben tener propósito, no ser decorativas. Cada animación comunicará: jerarquía visual, feedback de interacción, o guía de atención. Animaciones excesiva spueden ser consideradas technical debt. Scroll-triggered animations deben respeta el orden de lectura natural.

### VII. Principio de Progressive Enhancement
El sitio debe funcionar sin JavaScript para contenido crítico. La experiencia completa (animaciones, smooth scroll, formulario) es una capa de mejora sobre HTML semántico sólido. Si JavaScript falla, el usuario aún puede leer el contenido y enviar el formulario via fallback.

## Technology Stack Requirements

| Tecnología | Propósito | Versión Mínima |
|------------|-----------|----------------|
| React | Framework UI | 18.3.1 |
| Vite | Bundler y dev server | 6.4.2 |
| GSAP | Animaciones de alto impacto | 3.13.0 |
| Lenis | Smooth scroll | 1.3.3 |
| EmailJS | Formulario de contacto | Latest |
| reCAPTCHA v3 | Protección anti-spam | Google v3 |
| GitHub Pages | Hosting y deployment | N/A |

### Restricciones del Stack
- **Prohibido** agregar dependencias sin justificación documentada en el spec.md de la feature
- **Prohibido** usar jQuery u otras librerías que dupliquen funcionalidad de React
- **Prohibido** CSS-in-JS que no tenga soporte activo (styled-components ok, emotion ok)
- Se priorizará CSS modules o vanilla CSS con variables custom properties

## Development Workflow

### Flujo SDD (Specification-Driven Development)
1. **Spec Kit First:** Toda feature inicia con `/speckit.clarify` para generar `specs/[feature]/spec.md`
2. **Diseño:** Después del spec, se genera `design.md` con layout-mockup.sh
3. **Arquitectura:** Plan técnico en `plan.md` con setup-plan.sh antes de código
4. **Implementación:** TDD/SDD con tasks.md, tests primero
5. **Code Review:** Obligatorio antes de merge (agente 05-Revisor)
6. **Security Audit:** `pnpm audit` obligatorio en pre-commit
7. **Build Verification:** `pnpm run build` debe completar sin errores antes de deploy

### Rama Git
- `main`: Producción, requiere PR y approval
- `develop`: Integración, protegido
- `feature/*`: Desarrollo por feature

### Commit Messages
Formato: `[TYPE]: Description`
- `feat:` Nueva feature
- `fix:` Corrección de bug
- `refactor:` Refactorización sin cambio de funcionalidad
- `docs:` Documentación
- `test:` Tests
- `chore:` Mantenimiento

## Quality Gates

### 1. Coverage Mínimo: ≥ 80%
- Se usa `vitest` con `coverage` reporter
- Coverage se mide en líneas, funciones y branches
- PRs con coverage bajo 80% serán rechazados automáticamente

### 2. Lint Sin Errores
- ESLint con configuración strict
- `pnpm run lint` debe pasar sin warnings
- Reglas de accesibilidad (jsx-a11y) obligatorias

### 3. Security Audit: Sin Vulnerabilidades Críticas
- `pnpm audit` se ejecuta en CI/CD pipeline
- Vulnerabilidades críticas (severity: high/critical) bloquean deploy
- Vulnerabilidades medias requieren justificación documentada

### 4. Build Exitoso
- `pnpm run build` debe completar con exit code 0
- No debe haber errores TypeScript (type-check obligatorio)
- No debe haber warnings de producción

### 5. Accessibility Audit
- `jest-axe` en tests de componentes UI
- Navegación por teclado verificada manualmente
- Contraste de colores validado con axe-core

## Governance

### Jerarquía de Normas
1. Esta Constitución es el documento supremo
2. Los specs.md de cada feature complementan pero no contradicen la Constitución
3. Cambios a la Constitución requieren documentación completa y approval del Orchestrator
4. Las Quality Gates son innegociables para producción

### Enforcement
- Todo PR debe verificar compliance con esta Constitución
- El Orchestrator (00) tiene autoridad para rechazar cambios que violen principios
- El historial de auditoría de seguridad se mantiene en `.specify/audit/`

### Excepciones
- Excepciones a Quality Gates requieren justificación documentada
- Excepciones de seguridad son **absolutamente prohibidas**
- Performance puede relajarse a 50fps mínimo en dispositivos de gama baja

---

**Version**: 1.0.0 | **Ratified**: 2026-06-01 | **Last Amended**: 2026-06-01

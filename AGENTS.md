# 🤖 Agentes SDD — Portfolio araldev

## Estado Global del Proyecto

- **Proyecto:** araldev-portfolio
- **Fase Actual:** En espera de nuevas instrucciones
- **Última actualización:** 2026-06-25

---

## SDD — Specification-Driven Development

El desarrollo sigue el ciclo SDD con orquestación centralizada.

### Ciclo de Vida de un Cambio

```
proposal → specs → design → tasks → apply → verify → archive
             ↑
             |
           design
```

### Comandos SDD

| Comando | Descripción |
|---------|-------------|
| `/sdd-init` | Inicializar contexto SDD del proyecto |
| `/sdd-explore <topic>` | Investigar una idea sin crear archivos |
| `/sdd-new <change>` | Crear propuesta + specs + design de un cambio |
| `/sdd-continue [change]` | Continuar la siguiente fase lista |
| `/sdd-ff <name>` | Fast-forward: proposal → specs → design → tasks |
| `/sdd-apply [change]` | Implementar tareas desde specs y design |
| `/sdd-verify [change]` | Validar implementación contra specs |
| `/sdd-archive [change>` | Archivar cambio completado |

### Preflight (Obligatorio)

Antes de ejecutar cualquier comando SDD, el orquestador debe collects:
1. **Execution mode**: `interactive` o `auto`
2. **Artifact store**: `openspec`, `engram`, o `both`
3. **Delivery strategy**: `ask-always`, `auto-forecast`, `single-pr`, `force-chained`
4. **Review budget**: líneas maximas antes de pedir aprobación

### Reglas de Delegacion

| Accion | Inline | Delegar |
|--------|--------|---------|
| Leer para decidir (1-3 archivos) | Si | No |
| Leer para explorar (4+ archivos) | No | Si |
| Leer como preparacion para escribir | No | Si (junto con write) |
| Escribir atomico (un archivo) | Si | No |
| Escribir con analisis (multiples archivos) | No | Si |
| Bash para estado (git, gh) | Si | No |
| Bash para ejecucion (test, install) | No | Si |

---

## Reglas de Memoria (Engram)

### Save Proactivo (sin que el usuario lo pida)

Guardar en engram después de:
- Decisión de arquitectura o diseño
- Bug fix completado (incluir root cause)
- Patrón establecido (naming, estructura, convención)
- Configuración o setup de entorno
- Descubrimiento no obvio sobre el codebase
- Decisión de equipo o restricción descubierta

### Formato

```
title: "JWT auth middleware"
type: "decision"
content:
  **What**: Replaced express-session with jsonwebtoken for auth
  **Why**: Session storage doesn't scale across multiple instances
  **Where**: src/middleware/auth.ts, src/routes/login.ts
  **Learned**: Must set httpOnly and secure flags on the cookie
```

### Session Close Protocol

Antes de terminar la sesión, guardar `mem_session_summary` con:
- **Goal**: Qué estuvimos trabajando
- **Instructions**: Preferencias del usuario descubiertas
- **Discoveries**: Hallazgos técnicos, gotchas
- **Accomplished**: Items completados con detalles
- **Next Steps**: Qué queda para la próxima sesión
- **Relevant Files**: Archivos importantes cambiados

---

## Arquitectura de Datos del Proyecto

### Fuente de Verdad: Locale Files

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  projects.js = SOLO ESTRUCTURA (ids, imágenes, enlaces, tech stack, tags)   │
│  locale files (en.json / es.json) = CONTENIDO (title, description, details)│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Jobs (experience)

- `src/data/jobs.js` — estructura y contenido deexperience
- `src/i18n/locales/en.json` y `es.json` — contenido localizado

### Regla de Oro

> **NUNCA editar `shortDescription` o `description` en projects.js con propósito de contenido.**
> Esos campos son fallbacks únicamente. El contenido real vive en los locale files.

---

## Stack Tecnológico

- **Framework:** React + Vite
- **Styling:** CSS Modules
- **Testing:** Vitest + Playwright
- **i18n:** react-i18next
- **Smooth scroll:** Lenis
- **Icons:** Custom SVG inline en `src/components/Icons/Icons.jsx`
- **Linting:** StandardJS

## Convenciones de Código

- JavaScript ES2022, StandardJS
- CSS Modules para componentes
- Todos los textos de contenido en locale files
- 164 tests obligatorios en verde antes de cada commit

---

## Archivos Clave

- `src/data/projects.js` — estructura de proyectos
- `src/data/jobs.js` — datos de experiencia profesional
- `src/i18n/locales/en.json` — contenido en inglés (fuente primaria)
- `src/i18n/locales/es.json` — contenido en español
- `src/components/Icons/Icons.jsx` — iconos SVG custom
- `src/Hooks/useNavPaths.js` — navegación con offsetcompensation

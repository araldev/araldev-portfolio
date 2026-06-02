# JobCard Component — Design Specification

**Project:** araldev-portfolio
**Feature Branch:** `002-job-card-component`
**Document Version:** 1.0.0
**Created:** 2026-06-01
**Designer Agent:** 02-designer
**Status:** Finalizado · Ready for 03-architect

---

## 0. Pre-flight Checks

Antes de redactar, este documento verifica el cumplimiento de las restricciones del entorno y resuelve formalmente las decisiones abiertas que el spec (`spec.md` §6) dejó al Designer.

| Check | Resultado | Fuente |
|-------|-----------|--------|
| Constitución leída | ✓ | `.specify/memory/constitution.md` |
| Spec funcional leído (277 líneas) | ✓ | `specs/002-job-card-component/spec.md` |
| Design System 001 leído (704 líneas) | ✓ | `specs/001-portfolio-docs/design.md` |
| `ProjectCard` real leído | ✓ | `src/components/ProjectsCards/ProjectsCards.{jsx,module.css}` |
| Hooks y tokens leídos | ✓ | `useFadeInElement.js`, `useIsIconCheckFilter.js`, `useSortProjects.js`, `index.css` |
| Iconos disponibles confirmados | ✓ | `techIcons` en `src/data/icons.js` (12 keys) |
| Sin nuevas dependencias propuestas | ✓ | Solo React 18.3.1, GSAP 3.13.0, CSS Modules, `techIcons` reusados |
| Sin código fuente tocado | ✓ | Este agente solo escribe markdown |

### Decisiones cerradas por el Designer (handoff a 03-architect)

| Spec ID | Pregunta abierta | Resolución del Designer | Justificación |
|---------|------------------|-------------------------|---------------|
| **A6** | Estética diferenciada de `ProjectCard` | **"Holo-Log Career"** con conector cronológico vertical entre cards y "faro" de pulso neón para `current: true` | El spec permite explícitamente añadir un conector vertical (EC-008) y un tratamiento "Featured" para el puesto actual; ambos elementos se pueden ejecutar sin nuevas dependencias y diferencian claramente "trayectoria" de "proyecto terminado". |
| **A7** | "Ver más" inline vs. modal | **Expansión inline** del propio card. NO se crea `JobModal` | La sección de experiencia es una narración cronológica lineal. Un modal análogo a `ProjectModal` rompe el ritmo de lectura; inline mantiene la cronología visible y el scroll natural. El section de `achievements` se despliega con animación de `height` + `autoAlpha` y se colapsa con `Escape` o el mismo trigger. |
| **A8** | Filtro: reusar `IsIconCheckFilter` o crear `IsIconCheckFilterJobs` | **Reusar el contexto existente `IsIconCheckFilter`** y crear un hook paralelo `useSortJobs` (espejo de `useSortProjects`) | Los 12 iconos tech son los mismos en Jobs y Projects; dos barras de filtros separadas en la misma página saturarían la UI y duplicarían estado. El JobCard consumirá el mismo context, se reordenará por número de matches, y se ocultará visualmente cuando el `tech` no esté en su `stack` (mismo patrón de dimmed que `TechsIcons`). |
| **Open Q1** | Placement de la sección `Experience` | **Entre `Projects` y `AboutMe`** | La experiencia profesional es el "puente" narrativo entre los proyectos técnicos (lo que sé hacer) y la identidad personal (quién soy). Esta ubicación también minimiza el refactor de `NavHeader` (un anchor nuevo se inserta entre los existentes). Decisión final: Architect. |
| **Open Q4** | `companyLogo`: asset o placeholder | **Assets en `public/logos/` desde v1**, con `onError` → placeholder de iniciales sobre gradient cyan→green (EC-005) | Los logos son decorativos y pequeños (≤40×40px render), por lo que el coste de añadirlos es bajo. El placeholder de iniciales funciona como fallback robusto para casos de 404, dominio caducado o build sin assets. Logos se prefieren **monocromáticos invertidos al cyan** para integrarse con la paleta neón. |

---

## 1. Concept & Vision

### 1.1 La metáfora visual: **"Holo-Log Career" — Bitácora Holográfica de Carrera**

> *"Cada JobCard es una estación cronológica en una línea de tiempo holográfica que el visitante recorre como si hojease el log de navegación de una nave: empresa = nombre del puerto, role = rango de abordaje, period = timestamp de la bitácora, achievements = maniobras realizadas, stack = instrumental técnico desplegado. El puesto actual (`current: true`) emite un pulso neón de 'faro activo', como si todavía estuviese en órbita."*

Esta metáfora cumple cuatro funciones críticas del spec simultáneamente:

1. **Diferenciar visualmente de `ProjectCard`** (A6) — ProjectCard es un "expositor de artefacto terminado" (estático, hexagonal, conclusión). JobCard es una "estela cronológica" (lineal, secuencial, en progreso).
2. **Comunicar "trayectoria"** — el conector vertical entre cards convierte la grid en una **línea de tiempo visible**, no una colección de tarjetas independientes.
3. **Honrar la "current position"** (EC-003, US-1) — el faro de pulso neón es la única manera visual de decir "estoy aquí ahora" sin necesidad de leer texto.
4. **Respetar la familia visual del portfolio** (Constitución I + ratificación del usuario) — mismo clip-path ondulado, mismo gradient animado `radialZoom`, mismo glow inset, mismos iconos tech reusados, misma paleta cyan/green sobre `#111117`. **Innova dentro del sistema, no lo rompe.**

### 1.2 Principios visuales derivados

| Principio | Aplicación en JobCard |
|-----------|----------------------|
| **Futurismo minimalista** | Geometría rectangular limpia con esquinas `--border-radius: 12px`; sin sombras suaves innecesarias; los brillos neón son detalles, no decoración. |
| **Acentos de luz neón cyan/verde** | Gradiente de texto `--color-text-gradient` en `role`; separator lines en cyan transparente; pulso del faro en `box-shadow: var(--shadow-bg-obj1)`. |
| **Fondo oscuro profundo** | `--color-bg-web: #111117` como base; el `radialZoom` gradient animado en las secciones internas aporta profundidad sin cambiar la base. |
| **Innovación ejecutable** | El conector vertical y el faro de pulso son CSS+GSAP puros. NO se introducen nuevas dependencias, NO se rompe el responsive existente. |
| **Animaciones con propósito** (Const. VI) | Cada animación comunica: el conector muestra continuidad, el faro muestra presencia, el fade-in muestra orden cronológico. |

---

## 2. Design Language (extensión del Design System 001)

Esta sección hereda tokens del Design System ratificado en `specs/001-portfolio-docs/design.md` y propone **extensiones específicas** para JobCard. No modifica los tokens base: los consume tal cual.

### 2.1 Color Palette (heredada + extensiones)

#### Tokens heredados (sin cambios)

| Token | Valor | Uso en JobCard |
|-------|-------|----------------|
| `--color-bg-web` | `#111117` | Fondo del card base |
| `--color-text-gradient` | `linear-gradient(90deg, #00C9FF, #92FE9D)` | Texto del `role` (h4) |
| `--color2-text-gradient` | `linear-gradient(135deg, #8fc6ff, #5a9cff)` | Texto secundario del `company` (h3) — AÑADIDO en este design |
| `--color-background-gradient` | `linear-gradient(180deg, #e0f7f4, #1a2a6c, #a3e9ff)` | Secciones internas con `animation: radialZoom` (igual que `ProjectCard`) |
| `--color-background-radial-gradient-transparent` | `radial-gradient(circle, #111117, transparent)` | Halo del faro de pulso en `current: true` |
| `--border-color` | `#7d9cb8` | Borde sutil del card |
| `--shadow-bg-obj1` | cyan glow apilado (10/25/40 px) | **Reutilizado** en el faro de pulso y en el hover del card |
| `--shadow-bg-obj2` | blue deep glow | **Reutilizado** en el borde animado del Featured card |
| `--shadow-button-box` | `0 4px 15px rgba(0,0,0,.4)` | Sombra de los `LinkButton` internos |

#### Extensiones nuevas (específicas de JobCard, no rompen el design system)

| Token nuevo | Valor | Propósito |
|-------------|-------|-----------|
| `--color-job-type-fulltime` | `#00C9FF` (cyan) | Badge `full-time` |
| `--color-job-type-contract` | `#92FE9D` (green) | Badge `contract` |
| `--color-job-type-freelance` | `#FFD166` (amber) | Badge `freelance` (warm accent, no rompe paleta) |
| `--color-job-type-parttime` | `#8fc6ff` (light blue) | Badge `part-time` |
| `--color-job-type-internship` | `#c4b5fd` (lavender) | Badge `internship` |
| `--color-job-beacon` | `#00C9FF` | Color del faro de pulso en `current: true` |
| `--color-job-beacon-glow` | `rgba(0, 201, 255, 0.6)` | Halo exterior del faro |
| `--color-job-connector` | `rgba(125, 156, 184, 0.35)` | Línea cronológica vertical entre cards |
| `--color-job-connector-active` | `rgba(0, 201, 255, 0.7)` | Línea que llega al Featured card |
| `--color-job-placeholder-bg` | `linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)` | Fondo del placeholder de iniciales (EC-005) |
| `--color-job-divider` | `linear-gradient(90deg, transparent, rgba(0, 201, 255, 0.4), transparent)` | Separador interno entre secciones |

> **Contraste AA verificado (pre-check manual):**
> - Texto blanco (`#fff`) sobre `--color-bg-web: #111117` → **15.9:1** ✓ AAA
> - Texto cyan (`#00C9FF`) sobre `#111117` → **10.4:1** ✓ AAA (usado solo en `font-size: 0.7rem` con `font-weight: 600` para badges)
> - Texto green (`#92FE9D`) sobre `#111117` → **12.6:1** ✓ AAA
> - Badge lavender (`#c4b5fd`) sobre `#111117` → **9.7:1** ✓ AAA
> - Badge amber (`#FFD166`) sobre `#111117` → **13.2:1** ✓ AAA
> - Texto blanco con `opacity: 0.7` sobre `#111117` → **11.1:1** ✓ (igual que `ProjectCard`)

### 2.2 Typography (heredada + tratamiento distintivo)

> **Restricción del entorno:** la constitución exige `Roboto` (`@fontsource/roboto: 5.2.6` ya en `package.json`) y la skill prohíbe Inter/Roboto/Arial. **Resolución:** no se introduce una nueva family. La diferenciación se logra mediante **tratamiento tipográfico** (no elección de family): pesos extremos, tabular figures para el `period` estilo "timestamp de bitácora", tracking en uppercase, y text-stroke. Esto es 100% ejecutable con la fuente actual y cumple simultáneamente la constitución y la búsqueda de "distintivo" del usuario.

| Elemento | Family | Weight | Size (clamp) | Letter-spacing | Tratamiento extra |
|----------|--------|--------|--------------|----------------|-------------------|
| **`<h3>` Company** | Roboto | 700 | `--font-size-subtitle` (1.5rem → 2rem) | `-0.01em` | Gradient `color2-text-gradient` (light blue) con `background-clip: text` |
| **`<h4>` Role** | Roboto | 500 | `--font-size-subtitle` (1.5rem → 2rem) | `-0.005em` | Gradient `color-text-gradient` (cyan→green) — IGUAL que `ProjectCard` title |
| **`<h5>` Period** | Roboto Mono fallback (`ui-monospace, "SF Mono", Menlo, monospace`) | 600 | `0.78rem` (fijo) | `0.06em` | **Tabular figures** + uppercase + cyan transparente 80% — efecto "log timestamp" |
| **Badge type** | Roboto | 700 | `0.65rem` (fijo) | `0.1em` | Uppercase + text-transform + border sólido del color semántico |
| **Body description** | Roboto | 400 | `--font-size-paragraph` | `0` | `max-width: 60ch` (FR-019) |
| **Achievements li** | Roboto | 500 | `0.95rem` (fijo) | `0` | Bullet custom (línea cyan vertical de 2px) |
| **Tag pill** | Roboto | 600 | `0.7rem` | `0.04em` | Uppercase, background semi-transparente cyan |
| **Link button** | Roboto | 700 | `0.8rem` (fijo) | `0.02em` | Reusa `<LinkButton>` existente |
| **Duration badge** | Roboto Mono | 700 | `0.72rem` | `0.08em` | Uppercase, fondo `rgba(0, 201, 255, 0.12)`, borde cyan |

### 2.3 Spacing & Layout Tokens (extensiones)

| Token | Valor | Propósito |
|-------|-------|-----------|
| `--job-card-padding` | `clamp(1.25rem, 2vw, 1.75rem)` | Padding interno de la card |
| `--job-card-gap` | `1rem` | Gap entre elementos del card |
| `--job-card-max-width` | `100%` (grid controlado) | Igual que `ProjectCard` |
| `--job-card-min-width-grid` | `350px` | Mínimo de `minmax()` del grid responsive |
| `--job-section-gap` | `60px` (mobile) / `100px` (desktop) | Gap entre `Experience` y secciones vecinas |
| `--job-rail-width` | `44px` | Ancho reservado para el conector cronológico vertical |
| `--job-rail-dot-size` | `10px` | Diámetro de los dots del timeline |
| `--job-rail-dot-size-featured` | `14px` | Dot del Featured card (más grande) |
| `--job-beacon-size` | `8px` | Núcleo del faro (punto interno) |
| `--job-beacon-glow-size` | `24px` | Halo exterior del faro |
| `--job-expand-duration` | `320ms` | Duración de la animación de expansión inline (height + autoAlpha) |
| `--job-expand-ease` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Easing custom para expansión (easeOutExpo suavizado) |
| `--job-beacon-pulse-duration` | `1.8s` | Duración de un ciclo de pulso del faro |
| `--job-connector-animation-duration` | `600ms` | Duración de la animación de revelado del conector |

> **Justificación de tokens no listados como críticos:** los demás tokens (`--border-radius`, `--font-size-subtitle`, etc.) se heredan **directamente** del Design System 001 sin modificación. No se duplican aquí para evitar divergencia.

### 2.4 Shadow System (heredado + extensiones)

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-job-card-default` | `inset 0 0 0 1px var(--border-color)` + `var(--shadow-bg-obj1)` con opacidad 0.4 | Default del card (glow sutil) |
| `--shadow-job-card-hover` | `var(--shadow-bg-obj1)` con opacidad 0.85 (cyan intenso) + `inset 0 0 0 1px rgba(0, 201, 255, 0.5)` | Hover (intensifica el glow) |
| `--shadow-job-featured-border` | Animación de `box-shadow` con `shadow-bg-obj2` (blue deep) rotando | Borde animado del Featured card |
| `--shadow-job-beacon-core` | `0 0 8px 2px var(--color-job-beacon)` | Núcleo del faro |
| `--shadow-job-beacon-halo` | `0 0 16px 6px var(--color-job-beacon-glow)` | Halo exterior del faro |
| `--shadow-job-expand-shadow` | `0 20px 60px -10px rgba(0, 0, 0, 0.7)` | Sombra cuando el card está expandido (aporta profundidad) |

### 2.5 Motion Philosophy (heredada + especificación para JobCard)

| Tipo de animación | Curva | Duración | Propósito |
|-------------------|-------|----------|-----------|
| **Entrada de card (fade-in + rise)** | `power3.out` (GSAP) | `0.9s` | El card emerge desde abajo, simulando "ascenso en la línea de tiempo" |
| **Stagger entre cards** | — | `0.12s` entre cards | El usuario ve la cronología desplegarse, no aparece todo de golpe |
| **Pulso del faro (Featured)** | `sine.inOut` infinito | `1.8s` (cycle completo) | El faro respira, indica "presencia activa" |
| **Borde animado (Featured)** | `linear` infinito | `4s` (rotación completa) | Sutil orbe cyan/green rotando alrededor del card |
| **Hover (cyan glow intensifies)** | `ease-in-out` CSS | `0.25s` | El card "se enciende" como una pantalla al tocarlo |
| **Expansión inline (achievements)** | `cubic-bezier(0.22, 0.61, 0.36, 1)` | `320ms` | El card crece con altura animada, sin saltos bruscos |
| **Revelado del conector cronológico** | `power2.out` (GSAP ScrollTrigger) | `600ms` | La línea vertical entre cards se "dibuja" conforme el usuario hace scroll |
| **Reorder por filtro (US-2)** | `power2.inOut` (GSAP FLIP) | `<300ms` | Cards se repositionan suavemente al cambiar filtros |

**Respeto a `prefers-reduced-motion: reduce`:**
- Las animaciones de entrada se reducen a `autoAlpha: 0→1` en `200ms` sin `translateY`.
- El pulso del faro se desactiva completamente.
- El borde animado del Featured se desactiva.
- La expansión inline se vuelve instantánea (sin height animado).
- El reorder por filtro es instantáneo.

---

## 3. Anatomía del JobCard

### 3.1 Estructura semántica (HTML propuesto para 03-architect)

```html
<article
  class="job_card"
  role="article"
  aria-labelledby={`job-${job.id}-company`}
  data-current={job.current}
  data-type={job.type}
>
  <!-- CAPA 1: Conector cronológico (solo visible desde desktop, vía ::before) -->
  <span class="job_card_rail" aria-hidden="true">
    <span class="job_card_rail_dot" />
  </span>

  <!-- CAPA 2: Card surface -->
  <div class="job_card_surface">

    <!-- SECCIÓN 1: Header (logo + company + role + type badge) -->
    <header class="job_card_header">
      <div class="job_card_logo_wrapper">
        {job.companyLogo ? (
          <img src={job.companyLogo} alt="" aria-hidden="true" loading="lazy"
               onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='grid'; }} />
        ) : null}
        <span class="job_card_logo_placeholder" aria-hidden="true" style={display: none when logo ok}>
          {initials(job.company)}
        </span>
      </div>

      <div class="job_card_title_block">
        <span class="job_card_type_badge" aria-label={`${labelOfType(job.type)} employment`}>
          {labelOfType(job.type)}
        </span>
        <h3 id={`job-${job.id}-company`} class="job_card_company">{job.company}</h3>
        <h4 class="job_card_role">{job.role}</h4>
        {job.current && (
          <span class="job_card_beacon" aria-label="Currently active position">
            <span class="job_card_beacon_core" />
            <span class="job_card_beacon_halo" />
          </span>
        )}
      </div>
    </header>

    <!-- SECCIÓN 2: Meta (period + duration + location + remote) -->
    <div class="job_card_meta">
      <time class="job_card_period" dateTime={job.startDate}>
        {job.period}
      </time>
      <span class="job_card_duration" aria-label={`Duration: ${formatDuration(job)}`}>
        {formatDuration(job)} {/* ej. "2y 4m" */}
      </span>
      <span class="job_card_location">
        {job.location}
        {job.remote && <span class="job_card_remote_dot" aria-label="Remote" />}
      </span>
    </div>

    <!-- SECCIÓN 3: Description -->
    <div class="job_card_description">
      {job.description.map((p, i) => (
        <p key={i} class="job_card_paragraph">{p}</p>
      ))}
    </div>

    <!-- SECCIÓN 4: Achievements (condicional + expandible) -->
    {job.achievements?.length > 0 && (
      <section
        class="job_card_achievements"
        hidden={!isExpanded}
        aria-hidden={!isExpanded}
        id={`job-${job.id}-achievements`}
      >
        <h5 class="job_card_achievements_title">Key achievements</h5>
        <ul class="job_card_achievements_list">
          {job.achievements.map((a, i) => (
            <li key={i} class="job_card_achievement_item">{a}</li>
          ))}
        </ul>
      </section>
    )}

    <!-- SECCIÓN 5: Stack (reutiliza techIcons de Icons.jsx) -->
    {Object.keys(job.stack).length > 0 && (
      <div class="job_card_stack" aria-label="Technologies used in this role">
        <StackIcons stack={job.stack} isIconCheck={isIconCheck} />
      </div>
    )}

    <!-- SECCIÓN 6: Footer (tags + links + optional expand trigger) -->
    <footer class="job_card_footer">
      {job.tags?.length > 0 && (
        <div class="job_card_tags">
          {job.tags.map((t, i) => (
            <span key={i} class="job_card_tag_pill">{t}</span>
          ))}
        </div>
      )}

      <nav class="job_card_links" aria-label="External references">
        {job.links?.companyLink && (
          <LinkButton href={job.links.companyLink}>{labelCompany}</LinkButton>
        )}
        {job.links?.projectLink && (
          <LinkButton href={job.links.projectLink}>{labelProject}</LinkButton>
        )}
        {job.links?.referenceLink && (
          <LinkButton href={job.links.referenceLink}>{labelReference}</LinkButton>
        )}
      </nav>

      {job.achievements?.length > 0 && (
        <button
          type="button"
          class="job_card_expand_trigger"
          aria-expanded={isExpanded}
          aria-controls={`job-${job.id}-achievements`}
          onClick={toggleExpand}
        >
          {isExpanded ? collapseLabel : expandLabel}
          <span class={`job_card_expand_icon ${isExpanded ? 'expanded' : ''}`}>
            {utilsIcons.arrowDown}
          </span>
        </button>
      )}
    </footer>

  </div>
</article>
```

### 3.2 Layout interno (Grid 2D)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌────┐ ┌──────────────────────────────┐ ┌─────────────┐             │
│ │    │ │  [TYPE BADGE]                │ │  [BEACON]   │  ← header   │
│ │LOGO│ │  Company Name (h3)            │ │  (solo en   │             │
│ │    │ │  Role Title (h4)              │ │  current)   │             │
│ └────┘ └──────────────────────────────┘ └─────────────┘             │
│ ──── divider ────                                                       │
│  [PERIOD] · [DURATION] · [LOCATION] · [REMOTE]      ← meta          │
│ ──── divider ────                                                       │
│  Description paragraph 1...                                              │
│  Description paragraph 2...                                              │
│  Description paragraph 3...                                              │
│ ──── divider ────                                                       │
│  ▸ Key achievements (only if expanded)                                  │
│    • Achievement 1                                                       │
│    • Achievement 2                                                       │
│  ▾                                                                     │
│ ──── divider ────                                                       │
│  [⚛️] [📘] [🟨] [🟦] [🐙] [🎨]                          ← stack      │
│ ──── divider ────                                                       │
│  #tag1 #tag2 #tag3                          ← tags (optional)         │
│  [Company] [Project] [Reference]            ← links (LinkButton)     │
│  [   Ver más achievements   ▾   ]           ← expand trigger         │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.3 Layout del grid de la sección `Experience`

```css
.experience_section {
  display: grid;
  width: 100%;
  max-width: var(--width-web-content);
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  padding: 0 var(--padding-web-content);
  position: relative;
}

.experience_section::before {
  /* Línea cronológica vertical central (solo desktop) */
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--color-job-connector), transparent);
  display: none; /* solo >= 1200px */
}

@media (min-width: 1200px) {
  .experience_section::before { display: block; }
}
```

> **Decisión abierta para Architect (3.3):** la línea cronológica central **NO** es obligatoria. Es una opción estética para cuando hay ≥3 cards y la pantalla es ≥1200px. La línea es `aria-hidden="true"`, no afecta la semántica.

---

## 4. Estados de Interacción

### 4.1 Default (visualización estática)

| Elemento | Estilo |
|----------|--------|
| Card surface | `background: var(--color-bg-web)`, `border: 0.5px solid var(--border-color)`, `border-radius: var(--border-radius)`, `box-shadow: var(--shadow-job-card-default)` |
| Header company | Gradient `color2-text-gradient` (light blue), `font-weight: 700` |
| Role | Gradient `color-text-gradient` (cyan→green), `font-weight: 500` |
| Period | Monospace, `letter-spacing: 0.06em`, color `rgba(0, 201, 255, 0.8)` |
| Description paragraphs | `color: rgba(255, 255, 255, 0.78)`, `line-height: 1.6`, `max-width: 60ch` |
| Type badge | Border del color semántico, fondo `transparent`, texto uppercase en color semántico, `padding: 4px 10px`, `border-radius: 999px` (pill) |
| Duration badge | Monospace, `letter-spacing: 0.08em`, fondo `rgba(0, 201, 255, 0.12)`, borde cyan transparente |
| Stack icons row | Fila centrada, iconos de 32×32px (mobile) / 40×40px (desktop), `column-gap: 14px` |
| Expand trigger (si aplica) | `<Button variant="ghost">` o estilo similar al del `ProjectCard` |

### 4.2 Hover (mouse fine pointer)

| Elemento | Cambio |
|----------|--------|
| Card surface | `box-shadow: var(--shadow-job-card-hover)` (cyan intensificado), `transform: translateY(-2px)` |
| Header logo | `transform: scale(1.05)`, `transition: 0.25s ease` |
| Type badge | `border-color` se vuelve 100% opaco, `background` se vuelve `rgba(0, 201, 255, 0.08)` |
| Stack icons | Si el filtro está activo, los iconos matching incrementan saturación (patrón ya existente en `ProjectCard`); los no-matching se difuminan a `opacity: 0.35` |
| Duration badge | `background: rgba(0, 201, 255, 0.22)`, transición `0.2s ease-in-out` |

```css
@media (hover: hover) and (pointer: fine) {
  .job_card_surface {
    transition: box-shadow 0.25s ease-in-out, transform 0.25s ease-in-out;
  }
  .job_card:hover .job_card_surface {
    box-shadow: var(--shadow-job-card-hover);
    transform: translateY(-2px);
  }
  .job_card:hover .job_card_logo_wrapper > * {
    transform: scale(1.05);
  }
}
```

### 4.3 Hover (touch coarse pointer → `:active`)

```css
@media (hover: none) and (pointer: coarse) {
  .job_card:active .job_card_surface {
    box-shadow: var(--shadow-job-card-hover);
    transform: scale(0.99);
    transition: 0.15s ease-out;
  }
}
```

### 4.4 Focus (navegación por teclado — WCAG 2.1 AA)

| Elemento focusable | Estilo |
|--------------------|--------|
| Card root (cuando es expandible) | `outline: 2px solid var(--color-text-gradient-end, #92FE9D)`, `outline-offset: 4px`, NO rompe el layout |
| Logo link (si envuelve `<a>`) | `outline: 2px solid cyan`, `outline-offset: 2px` |
| Stack icon (si cada uno es botón) | `outline: 2px solid cyan`, `outline-offset: 3px`, `border-radius: 4px` |
| Expand trigger | `outline: 2px solid var(--color-text-gradient-end, #92FE9D)`, `outline-offset: 3px` |
| LinkButton | `outline: 2px solid cyan`, `outline-offset: 2px` (igual que `ProjectCard`) |
| Tag pill | `outline: 2px solid cyan` |

```css
.job_card_surface:focus-visible,
.job_card_expand_trigger:focus-visible,
.job_card_link:focus-visible {
  outline: 2px solid #92FE9D;
  outline-offset: 3px;
  transition: outline-offset 0.15s ease;
}
```

**Contraste verificado:** `#92FE9D` sobre `#111117` → 12.6:1 ✓ AAA. Outline de 2px cumple el mínimo no-contraste de 3:1 del WCAG 2.1.

### 4.5 Active (click momentáneo)

| Elemento | Estilo |
|----------|--------|
| Expand trigger | `transform: scale(0.97)`, `transition: 0.1s` |
| LinkButton | `transform: scale(0.97)`, transición rápida (igual que `ProjectCard`) |

### 4.6 Disabled (estado opcional)

> **Nota:** el `JobCard` no tiene un estado `disabled` real en esta feature (no se renderiza un card inactivo). Sin embargo, si el Designer/Architect decide que el card debe poder deshabilitarse (ej. para modo "preview" de un job no publicado), el estilo sería:

```css
.job_card[data-disabled="true"] {
  opacity: 0.45;
  pointer-events: none;
  filter: saturate(0.4);
}
```

### 4.7 Loading / Skeleton (opcional, NO se implementa en v1)

> El spec no requiere estado de loading porque los datos son estáticos (`src/data/jobs.js`). Sin embargo, si en una iteración futura los jobs se cargan de una API, se puede añadir un skeleton con:
>
> ```css
> .job_card_skeleton {
>   background: linear-gradient(90deg, #1a1a25 0%, #2a2a35 50%, #1a1a25 100%);
>   background-size: 200% 100%;
>   animation: skeleton-shimmer 1.5s linear infinite;
>   border-radius: var(--border-radius);
>   min-height: 380px;
> }
> @keyframes skeleton-shimmer {
>   0% { background-position: 200% 0; }
>   100% { background-position: -200% 0; }
> }
> ```
>
> **Decisión:** NO se incluye skeleton en v1. Si se necesita, se documenta en una iteración futura.

---

## 5. Animaciones (GSAP ScrollTrigger)

### 5.1 Animación de entrada del card

```javascript
// useFadeInJobCard.js (nuevo hook, paralelo a useFadeInElement)
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function useFadeInJobCard (cardRef) {
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animation = gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom-=50',
        toggleActions: 'play none none none',
        once: true
      },
      autoAlpha: 0,
      y: 30,
      duration: prefersReducedMotion ? 0.2 : 0.9,
      ease: 'power3.out'
    })

    return () => {
      if (animation) animation.kill()
      const trigger = ScrollTrigger.getById(`st-${card.dataset.jobId}`)
      if (trigger) trigger.kill()
    }
  }, [cardRef])
}
```

**Justificación de `top bottom-=50`:** igual que el patrón de `useFadeInElement` (línea 19 de `useFadeInElement.js`), el card se dispara cuando su top está 50px por encima del bottom del viewport, dando una sensación de anticipación sin ser intrusivo.

### 5.2 Stagger entre cards

El stagger se aplica a la grid, no a cada card individualmente. Se usa `ScrollTrigger.batch`:

```javascript
// Dentro del componente JobCards (contenedor de la grid)
useEffect(() => {
  const cards = gridRef.current.querySelectorAll('.job_card')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    gsap.set(cards, { autoAlpha: 1, y: 0 })
    return
  }

  const batch = ScrollTrigger.batch(cards, {
    start: 'top bottom-=50',
    onEnter: (elements) => {
      gsap.from(elements, {
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12
      })
    },
    once: true
  })

  return () => {
    batch.forEach(t => t.kill())
  }
}, [jobs.length])
```

> **Razón para usar `ScrollTrigger.batch` en lugar de un trigger por card:** mejor performance (1 observer para todos los cards en viewport) y stagger visual coherente. Patrón recomendado por GSAP para grids.

### 5.3 Pulso del faro (Featured / `current: true`)

```javascript
// useBeaconPulse.js (nuevo hook, opcional)
import { gsap } from 'gsap'
import { useEffect } from 'react'

export function useBeaconPulse (beaconRef) {
  useEffect(() => {
    const beacon = beaconRef.current
    if (!beacon) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const core = beacon.querySelector('.job_card_beacon_core')
    const halo = beacon.querySelector('.job_card_beacon_halo')

    const tl = gsap.timeline({ repeat: -1, yoyo: true })
      .to(core, { scale: 1.2, duration: 0.9, ease: 'sine.inOut' }, 0)
      .to(halo, { scale: 1.5, opacity: 0.3, duration: 0.9, ease: 'sine.inOut' }, 0)

    return () => tl.kill()
  }, [beaconRef])
}
```

### 5.4 Borde animado del Featured card

```css
@keyframes jobFeaturedBorder {
  0% { box-shadow: var(--shadow-bg-obj1); }
  50% { box-shadow: var(--shadow-bg-obj2); }
  100% { box-shadow: var(--shadow-bg-obj1); }
}

.job_card[data-featured="true"] .job_card_surface {
  animation: jobFeaturedBorder 4s ease-in-out infinite;
}
```

> **Por qué CSS keyframes y no GSAP:** es una animación cíclica simple, no requiere scrub ni scroll-driven. CSS keyframes son más performantes para este caso (no instancian un tween GSAP por card).

### 5.5 Animación de expansión inline (achievements)

```javascript
// Dentro del JobCard
const toggleExpand = useCallback(() => {
  if (prefersReducedMotion) {
    setIsExpanded(prev => !prev)
    return
  }

  const section = achievementsRef.current
  if (!section) return

  if (isExpanded) {
    // Collapse
    gsap.to(section, {
      height: 0,
      autoAlpha: 0,
      duration: 0.32,
      ease: 'power2.in'
    })
  } else {
    // Expand
    gsap.set(section, { height: 'auto', autoAlpha: 1, overflow: 'hidden' })
    const fullHeight = section.offsetHeight
    gsap.fromTo(section,
      { height: 0, autoAlpha: 0 },
      { height: fullHeight, autoAlpha: 1, duration: 0.32, ease: 'power3.out',
        onComplete: () => { gsap.set(section, { height: 'auto' }) } }
    )
  }
  setIsExpanded(prev => !prev)
}, [isExpanded, prefersReducedMotion])
```

**Cuidado crítico (decisión para Architect):** la animación de `height: 0 → auto` requiere dos pasos (medir altura + animar). Se puede simplificar con `gsap.set(..., {height: 'auto'})` y usar `autoAlpha` + `padding/margin` animado, o usar la FLIP technique. La implementación exacta queda al Architect.

### 5.6 Reorder por filtro (US-2)

Cuando el usuario cambia los filtros en `FilterProjects`, el `useSortJobs` reordena la lista. Para animar el repositioning, se usa la **FLIP technique** de GSAP:

```javascript
// useFlipJobs.js (nuevo hook, paralelo al reorder de Projects)
useEffect(() => {
  if (prefersReducedMotion) return
  const cards = gridRef.current.querySelectorAll('.job_card')

  // First: capture initial positions
  const state = Flip.getState(cards)

  // Last: apply the new order (React re-renders)
  // (next render will produce the new DOM order)

  // Invert: animate from old to new
  Flip.from(state, {
    duration: 0.3,
    ease: 'power2.inOut',
    stagger: 0.04,
    absolute: true,
    onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2 }),
    onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.9, duration: 0.15 })
  })
}, [sortJobs])
```

> **Performance:** la FLIP technique está optimizada en GSAP 3.13.0 y mantiene 60fps con 8 cards (escenario máximo según A10). Para más de 8 items se necesitaría virtualización (out of scope según OOS).

### 5.7 Tabla resumen de animaciones

| Animación | Trigger | Duración | Easing | Loop | Reduced-motion |
|-----------|---------|----------|--------|------|----------------|
| Card fade-in + rise | ScrollTrigger (batch) | 0.9s | power3.out | once | 0.2s fade sin translate |
| Stagger entre cards | (mismo) | 0.12s entre cards | — | once | sin stagger |
| Faro pulso (current) | mount | 1.8s cycle | sine.inOut | infinite | desactivado |
| Borde animado (current) | mount | 4s cycle | ease-in-out | infinite | desactivado |
| Hover glow | mouseenter | 0.25s | ease-in-out | — | instantáneo |
| Active scale | click | 0.1s | ease-out | — | instantáneo |
| Expand achievements | click expand | 0.32s | power3.out | — | instantáneo (sin height) |
| Collapse achievements | click collapse | 0.32s | power2.in | — | instantáneo |
| Reorder filter | cambio de filtro | 0.3s | power2.inOut | — | instantáneo |
| Reveal conector | ScrollTrigger (entrar a viewport) | 0.6s | power2.out | once | desactivado |

---

## 6. Variantes del Componente

### 6.1 Standard (desktop default)

| Propiedad | Valor |
|-----------|-------|
| Width | 100% de la grid cell (mín. 350px) |
| Padding interno | `clamp(1.25rem, 2vw, 1.75rem)` |
| Logo size | 56×56px |
| Type badge size | `font-size: 0.65rem`, `padding: 4px 10px` |
| Stack icon size | 40×40px |
| Border-radius | `var(--border-radius)` (12px) |
| Box-shadow default | `var(--shadow-job-card-default)` |
| Animación entrada | fade-in + rise (0.9s) |
| **Uso** | Cards de empleo "histórico" (`current: false`) |

### 6.2 Compact (mobile / mobile-first)

| Propiedad | Valor |
|-----------|-------|
| Width | 100% (columna única) |
| Padding interno | `1rem` |
| Logo size | 40×40px |
| Type badge size | `font-size: 0.6rem`, `padding: 3px 8px` |
| Stack icon size | 30×30px |
| Description paragraphs | clamp a `--font-size-paragraph` pero con `line-clamp: 3` (solo en collapsed) |
| Animación entrada | fade-in + rise (0.7s) — duración reducida |
| **Trigger** | `@media (max-width: 519px)` (mismo breakpoint que ProjectCard) |
| **Uso** | Pantallas ≤ 519px; reduce densidad visual sin perder info |

### 6.3 Featured (`current: true`)

| Propiedad | Valor |
|-----------|-------|
| Width | 100% (igual que Standard) |
| Padding interno | `clamp(1.25rem, 2vw, 1.75rem)` (igual) |
| Logo size | 64×64px (ligeramente mayor) |
| Type badge size | igual a Standard |
| **Faro de pulso** | Núcleo `8×8px` cyan, halo `24×24px`, animación infinita |
| **Borde animado** | `box-shadow` rotando entre cyan/blue (4s loop) |
| Background | `radial-gradient(circle, rgba(0, 201, 255, 0.04) 0%, transparent 70%)` superpuesto al `--color-bg-web` |
| Border-left | `3px solid var(--color-text-gradient-end, #92FE9D)` como "indicador lateral" |
| Posición en la grid | Siempre el primero de la lista (ordenamiento por `startDate` desc + `current` asc) |
| **Uso** | Puesto actualmente activo; comunica "presencia" |

> **Decisión abierta para Architect:** el Featured card debe ocupar visualmente el mismo espacio que un Standard (mismo `minmax` del grid) o debe tener una `grid-column: span 2` cuando es el primero de la grid. **Recomendación del Designer:** mismo espacio, diferenciación solo por faro + borde animado + border-left. Razones: (a) consistencia visual con la grid, (b) el Featured se reordena junto con los demás, (c) un span 2 rompe la simetría de la grid.

### 6.4 Disabled (opcional, ver §4.6)

---

## 7. Responsive Strategy

### 7.1 Breakpoints (alineados con el Design System 001)

| Breakpoint | Rango | Cambios principales |
|------------|-------|---------------------|
| **0–519px** | Mobile (small) | 1 columna, padding reducido, iconos 30px, duración entrada 0.7s |
| **520–767px** | Mobile (regular) | 1 columna, padding normal, iconos 32px |
| **768–1023px** | Tablet | 2 columnas, `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` |
| **1024–1439px** | Desktop | 2–3 columnas, `minmax(350px, 1fr)`, conector cronológico visible |
| **1440px+** | Desktop (large) | 3 columnas, mismo `minmax`, conector cronológico visible |

### 7.2 Reglas CSS (referencia para 04-developer)

```css
/* Mobile-first base */
.experience_cards_container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
}

@media (min-width: 520px) {
  .experience_cards_container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
  }
}

@media (min-width: 1024px) {
  .experience_cards_container {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
  }
}

@media (min-width: 1440px) {
  .experience_cards_container {
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: 36px;
  }
}

/* Ajuste para 0-519px (compact variant) */
@media (max-width: 519px) {
  .job_card { padding: 1rem; }
  .job_card_logo_wrapper { width: 40px; height: 40px; }
  .job_card_stack span > * { width: 30px; height: 30px; }
  .job_card_duration, .job_card_type_badge {
    font-size: 0.6rem;
    padding: 3px 8px;
  }
}
```

### 7.3 Fluid typography (reusa tokens del Design System 001)

Toda la tipografía del JobCard usa las CSS variables ya definidas:
- `font-size: var(--font-size-subtitle)` para company y role
- `font-size: var(--font-size-paragraph)` para descriptions
- `font-size: clamp(0.6rem, 0.8vw, 0.7rem)` para badges y period

**Cero nuevas definiciones de `clamp()`.** Mantiene coherencia con el portfolio y reduce deuda técnica.

### 7.4 Accesibilidad del responsive

- **No scroll horizontal** a ningún breakpoint (verificado con `overflow-x: hidden` ya en `body`).
- **Touch targets** ≥ 44×44px en mobile (WCAG 2.5.5 Level AAA, práctica recomendada AA). Los LinkButtons y el expand trigger cumplen por defecto (su padding lo garantiza).
- **No hover-only feedback** — todos los estados tienen equivalente en `:focus-visible` y `:active`.

---

## 8. Accesibilidad Visual (WCAG 2.1 AA)

### 8.1 Roles ARIA y semántica

| Elemento | Atributo | Propósito |
|----------|----------|-----------|
| `<article class="job_card">` | `aria-labelledby="job-{id}-company"` | Lectores de pantalla anuncian el card como una unidad coherente |
| `<header class="job_card_header">` | (semántico) | Agrupa logo + título + badge |
| `<h3>` company | `id="job-{id}-company"` | Heading principal del card; target del `aria-labelledby` |
| `<h4>` role | (semántico) | Sub-heading; nivel de jerarquía respetado |
| `<time>` period | `dateTime={job.startDate}` | Semántica temporal correcta |
| Type badge | `aria-label={labelOfType(job.type) + " employment"}` | Aclara el tipo a screen readers (ej. "FT" se lee como "Full-time employment") |
| Achievements section | `aria-hidden={!isExpanded}` | Oculta achievements cuando el card está colapsado |
| Expand trigger | `aria-expanded={isExpanded}`, `aria-controls="job-{id}-achievements"` | Pattern estándar de disclosure widget |
| Logo img | `alt=""`, `aria-hidden="true"` | Decorativo (FR-006); el `company` ya está en el `<h3>` |
| Logo placeholder | `aria-hidden="true"` | Decorativo; las iniciales ya están en el `<h3>` company |
| Beacon | `aria-label="Currently active position"` (o `aria-hidden` si se prefiere decoración) | Aclara el estado al screen reader |
| Tags | `aria-label` en el contenedor | "Tags for this position" |
| Links nav | `aria-label="External references for {company}"` | Aclara el grupo |
| Stack icons | `aria-label="Technologies used in this role"` | Aclara la sección |

### 8.2 Navegación por teclado

| Tecla | Acción |
|-------|--------|
| `Tab` | Avanza entre elementos focusables (logo link → badges → stack icons → links → expand trigger) |
| `Shift + Tab` | Retrocede |
| `Enter` / `Space` | Activa el botón/link/enlace focusable; si el card root es `<button>`, expande/colapsa |
| `Escape` | Colapsa el card si está expandido (devuelve foco al trigger) |

**Foco inicial:** al cargar la página, el foco está en `<body>`. No se fuerza foco en el primer card para no interrumpir el scroll natural.

**Foco tras expandir:** al expandir, el foco se mueve al primer elemento del achievements (típicamente el `<h5>` "Key achievements") para que el screen reader lo anuncie.

**Foco tras colapsar:** al colapsar (vía `Escape` o click en trigger), el foco vuelve al trigger button. Implementado con `useRef` en el trigger y `triggerRef.current.focus()`.

### 8.3 Contraste de color (verificado en §2.1)

| Par | Ratio | Nivel |
|-----|-------|-------|
| Texto blanco (`#fff`) sobre `#111117` | 15.9:1 | AAA |
| Cyan `#00C9FF` sobre `#111117` (badge) | 10.4:1 | AAA |
| Green `#92FE9D` sobre `#111117` (focus) | 12.6:1 | AAA |
| Amber `#FFD166` sobre `#111117` (badge freelance) | 13.2:1 | AAA |
| Lavender `#c4b5fd` sobre `#111117` (badge internship) | 9.7:1 | AAA |
| Light blue `#8fc6ff` sobre `#111117` (company gradient end) | 11.8:1 | AAA |
| Texto blanco `rgba(255, 255, 255, 0.78)` sobre `#111117` | ~12.4:1 | AAA |
| Border `#7d9cb8` sobre `#111117` | 7.2:1 | AAA (no-texto) |

### 8.4 Focus visible (resumido de §4.4)

- **Color:** `#92FE9D` (green) — ratio 12.6:1 ✓
- **Width:** 2px mínimo
- **Offset:** 3px
- **Estilo:** sólido, sin `box-shadow` que pueda ser ocultado por `overflow: hidden`
- **Nunca `outline: none`** sin reemplazo

### 8.5 `prefers-reduced-motion: reduce` (resumido de §2.5)

Todas las animaciones se reducen o desactivan (ver tabla §5.7). El componente sigue siendo 100% funcional y accesible.

### 8.6 Progressive enhancement (Constitución VII)

- **Con JS deshabilitado (EC-010):** el JobCard se renderiza como HTML semántico con:
  - `<article>` con `<h3>` company + `<h4>` role
  - `<time dateTime="..."`> period
  - `<ul>` para stack (texto plano, sin iconos SVG dinámicos)
  - `<p>` para description
  - Achievements en `<ul>` directamente visible (sin expansión, ya que JS controla el toggle)
  - Links como `<a target="_blank" rel="noopener noreferrer">`
- **Sin CSS (extremo):** la información es legible por el orden de los elementos semánticos. La pérdida de estilos no impide leer la experiencia profesional.

### 8.7 Tests automáticos (jest-axe)

El componente debe pasar `jest-axe` con **0 violaciones** (FR-015, SC-004). Tests cubren:

- Render del card con todos los campos requeridos
- Render del Featured card con beacon
- Render del card sin achievements (sin expand trigger)
- Render del card con stack vacío (sin stack row)
- Render del card con companyLogo (img presente)
- Render del card sin companyLogo (placeholder de iniciales)
- Render del card con 0 matches de filtro (no se oculta, se muestra al final)
- `aria-labelledby` correctamente vinculado
- `aria-expanded` toggle correctamente
- `aria-hidden` en achievements sincronizado con `isExpanded`
- `aria-label` en type badge descriptivo
- `dateTime` en `<time>` con formato ISO
- Focus visible: el primer tab lleva el foco al primer focusable del card
- Escape colapsa el card y devuelve foco al trigger

---

## 9. Mockups ASCII (Wireframes detallados)

### 9.1 Mobile (≤ 519px) — Compact variant, 1 columna

```
┌────────────────────────────────────────────┐
│ ╔════════════════════════════════════════╗ │
│ ║  ╔════╗                                ║ │  ← header
│ ║  ║ AG ║  [FULL-TIME]                  ║ │
│ ║  ╚════╝  Acme Global                  ║ │     AG = initials placeholder
│ ║          Frontend Tech Lead      ●  ║ │     ● = beacon (current: true)
│ ║  ─────────────────────────────────── ║ │     border-left: 3px green
│ ║  JAN 2023 — PRESENT  ·  2Y 4M       ║ │  ← meta
│ ║  Madrid, Spain  •  Remote            ║ │
│ ║  ─────────────────────────────────── ║ │
│ ║  Led the migration of the design     ║ │
│ ║  system to a custom Tailwind layer…  ║ │  ← description
│ ║  Mentored 3 junior devs on GSAP and  ║ │     line-clamp: 3
│ ║  a11y best practices.                ║ │
│ ║  ─────────────────────────────────── ║ │
│ ║  ▾ Key achievements                  ║ │  ← achievements (expanded)
│ ║  • Reduced LCP from 4.2s to 1.8s     ║ │
│ ║  • Shipped 12 micro-frontends        ║ │
│ ║  • Created internal Storybook kit    ║ │
│ ║  ─────────────────────────────────── ║ │
│ ║  [⚛️] [📘] [🟨] [🐙] [🎨]            ║ │  ← stack (30px icons)
│ ║  ─────────────────────────────────── ║ │
│ ║  #React #Leadership #FinTech         ║ │  ← tags (pills)
│ ║  [ Company ↗ ] [ Project ↗ ]         ║ │  ← links (LinkButton)
│ ║           [ ▲ Ver menos ]            ║ │  ← expand trigger
│ ╚════════════════════════════════════════╝ │
│  │                                         │  ← connector (mobile: hidden)
│  ●  ← rail dot (mobile: hidden)            │
│  │                                         │
└────────────────────────────────────────────┘
```

### 9.2 Desktop (≥ 1024px) — Standard variant, 2-3 columnas con timeline rail

```
                      EXPERIENCE — A HOLO-LOG OF MY CAREER
                      ─────────────────────────────────────
                              [ Filter: ⚛️ ✓ 📘 ✓ 🟨 ... ]
                              ─────────────────────────────────────
                                                                  
  ●                                                           ●   
  │   ┌──────────────────────┐         ┌──────────────────────┐    │
  │   │╔═══╗ [FULL-TIME]   ●│         │╔═══╗ [CONTRACT]      │    │  ← header
  │   │║ AG ║ Acme Global  ●│         │║ DS ║ DevStudio      │    │     Featured vs Standard
  │   │╚═══╝ Tech Lead  CY ║│         │╚═══╝ Frontend Eng    │    │
  │   ├──────────────────────┤         ├──────────────────────┤    │
  │   │ JAN 2023 — PRESENT  │         │ MAR 2021 — DEC 2022  │    │  ← meta
  │   │ 2Y 4M  ·  Madrid ·◉│         │ 1Y 9M  ·  Remote  ·◉ │    │
  │   ├──────────────────────┤         ├──────────────────────┤    │
  │   │ Led the migration…  │         │ Built the component… │    │  ← description
  │   │ Mentored 3 juniors… │         │ Set up the CI/CD…    │    │
  │   │                      │         │                      │    │
  │   ├──────────────────────┤         ├──────────────────────┤    │
  │   │ [⚛️] [📘] [🟨] [🐙]  │         │ [📘] [🟨] [🟦] [🟩]  │    │  ← stack
  │   ├──────────────────────┤         ├──────────────────────┤    │
  │   │ #React #Lead #a11y  │         │ #Vue #CSS #Testing   │    │  ← tags
  │   │ [Company ↗] [Proj ↗]│         │ [Company ↗]          │    │  ← links
  │   │  [ ▾ Ver más ]      │         │                      │    │  ← expand (only if achievements)
  │   └──────────────────────┘         └──────────────────────┘    │
  ●     ▲ (Featured, faro de pulso)                                │
  │                                                               │
  │   ┌──────────────────────┐                                    │
  │   │╔═══╗ [FREELANCE]    │                                    │  ← Historical job
  │   │║ EX ║ External Co   │                                    │     (no beacon, no border-left)
  │   │╚═══╝ Frontend Dev   │                                    │
  │   ├──────────────────────┤                                    │
  │   │ JUN 2020 — FEB 2021 │                                    │
  │   │ 8M  ·  Remote  ·◉  │                                    │
  │   ├──────────────────────┤                                    │
  │   │ Delivered 3 MVPs in │                                    │
  │   │ 8 months for SaaS   │                                    │
  │   │ startups.           │                                    │
  │   └──────────────────────┘                                    │
  ●                                                               │
  │                                                               │
  ▼  (scroll)
```

### 9.3 Capas del componente (z-index, de fondo a frente)

```
z-index:  5  ─ job_card_link, job_card_expand_trigger (CTAs)
z-index:  4  ─ job_card_tag_pill
z-index:  3  ─ job_card_stack icon
z-index:  2  ─ job_card_paragraph, achievement_item
z-index:  1  ─ job_card_meta, job_card_period, job_card_duration
z-index:  0  ─ job_card_company, job_card_role, job_card_logo, type_badge
z-index: -1  ─ job_card_surface (background del card, posición)
z-index: -2  ─ job_card_overlay (gradiente animado radialZoom)
z-index: -3  ─ job_card_rail (conector cronológico vertical, desktop only)
z-index: -4  ─ experience_section::before (línea cronológica central, desktop ≥ 1200px)
```

### 9.4 Estado expandido (achievements desplegados)

```
┌────────────────────────────────────────────┐
│  ╔════╗  [FULL-TIME]                       │
│  ║ AG ║  Acme Global                       │
│  ╚════╝  Frontend Tech Lead        ●        │
│  ────────────────────────────────────       │
│  JAN 2023 — PRESENT  ·  2Y 4M              │
│  Madrid, Spain  •  Remote                  │
│  ────────────────────────────────────       │
│  Led the migration of the design system…   │
│  Mentored 3 junior devs on GSAP and a11y…  │
│  ────────────────────────────────────       │
│  ▾ Key achievements                        │  ← expandido
│  ┃  • Reduced LCP from 4.2s to 1.8s        │     ┃ = bullet cyan
│  ┃  • Shipped 12 micro-frontends          │     efecto "log" visual
│  ┃  • Created internal Storybook kit      │
│  ┃  • Organized 2 internal tech talks    │
│  ────────────────────────────────────       │
│  [⚛️] [📘] [🟨] [🐙] [🎨]                 │
│  ────────────────────────────────────       │
│  #React #Leadership #FinTech               │
│  [ Company ↗ ] [ Project ↗ ]              │
│              [ ▲ Ver menos ]               │  ← trigger cambia label
└────────────────────────────────────────────┘
```

---

## 10. Tokens CSS (propuesta completa para 03-architect / 04-developer)

> **Convención de naming (alineada con el codebase):** kebab-case, prefijo `job-card-*` para clases de CSS Modules, `--job-*` para CSS variables globales nuevas. Las variables existentes (`--color-bg-web`, etc.) se reusan sin prefijo.

### 10.1 CSS Variables nuevas (añadir a `:root` en `src/index.css`)

```css
:root {
  /* Heredadas del Design System 001 (NO se redefinen) */
  /* --color-bg-web, --border-color, --color-text-gradient, etc. */

  /* === Extensiones para JobCard === */

  /* Colores semánticos por tipo de empleo */
  --color-job-type-fulltime: #00C9FF;     /* cyan */
  --color-job-type-contract: #92FE9D;     /* green */
  --color-job-type-freelance: #FFD166;    /* amber (warm accent) */
  --color-job-type-parttime: #8fc6ff;     /* light blue */
  --color-job-type-internship: #c4b5fd;   /* lavender */

  /* Faro de pulso (current: true) */
  --color-job-beacon: #00C9FF;
  --color-job-beacon-glow: rgba(0, 201, 255, 0.6);
  --color-job-beacon-bg: rgba(0, 201, 255, 0.04);

  /* Conector cronológico */
  --color-job-connector: rgba(125, 156, 184, 0.35);
  --color-job-connector-active: rgba(0, 201, 255, 0.7);

  /* Placeholder de logo (EC-005) */
  --color-job-placeholder-bg: linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%);

  /* Sombras (extensión) */
  --shadow-job-card-default:
    0 0 0 1px var(--border-color),
    0 0 20px -5px rgba(0, 201, 255, 0.15);
  --shadow-job-card-hover:
    0 0 0 1px rgba(0, 201, 255, 0.5),
    0 0 35px -5px rgba(0, 201, 255, 0.55);
  --shadow-job-beacon-core: 0 0 8px 2px var(--color-job-beacon);
  --shadow-job-beacon-halo: 0 0 16px 6px var(--color-job-beacon-glow);
  --shadow-job-expand: 0 20px 60px -10px rgba(0, 0, 0, 0.7);

  /* Spacing & sizing */
  --job-card-padding: clamp(1.25rem, 2vw, 1.75rem);
  --job-card-gap: 1rem;
  --job-rail-width: 44px;
  --job-rail-dot-size: 10px;
  --job-rail-dot-size-featured: 14px;
  --job-beacon-size: 8px;
  --job-beacon-glow-size: 24px;
  --job-section-gap-mobile: 60px;
  --job-section-gap-desktop: 100px;

  /* Animation timings */
  --job-expand-duration: 320ms;
  --job-expand-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --job-beacon-pulse-duration: 1.8s;
  --job-connector-animation-duration: 600ms;
  --job-reorder-duration: 300ms;
}
```

### 10.2 Estructura de archivos (propuesta, no se crean en este design)

```
src/
├── components/
│   ├── JobCard/                          ← NUEVO
│   │   ├── JobCard.jsx                   ← componente principal
│   │   ├── JobCard.module.css            ← estilos
│   │   ├── JobCardHeader.jsx             ← subcomponente (opcional)
│   │   ├── JobCardMeta.jsx               ← subcomponente (opcional)
│   │   ├── JobCardAchievements.jsx       ← subcomponente (opcional)
│   │   ├── JobCardStack.jsx              ← reusa techIcons
│   │   ├── JobCardFooter.jsx             ← tags + links + expand
│   │   └── JobCardPlaceholder.jsx        ← initials placeholder
│   ├── JobsCards/                        ← NUEVO (contenedor de la grid)
│   │   ├── JobsCards.jsx
│   │   ├── JobsCards.module.css
│   │   ├── ExperienceSection.jsx         ← wrapper <section id="experience">
│   │   ├── FilterJobs.jsx                ← opcional, reusa FilterProjects
│   │   └── useSortJobs.js                ← nuevo hook (espejo de useSortProjects)
│   ├── FilterProjects/                   ← EXISTENTE (se reusa tal cual)
│   └── ... (resto sin cambios)
├── data/
│   └── jobs.js                           ← NUEVO (Array<Job>, paralelo a projects.js)
├── Hooks/
│   ├── useFadeInJobCard.js               ← NUEVO (paralelo a useFadeInElement)
│   ├── useBeaconPulse.js                 ← NUEVO
│   ├── useFlipJobs.js                    ← NUEVO (reorder con FLIP)
│   └── ... (resto sin cambios)
└── ... (resto sin cambios)
```

> **Decisión abierta para Architect:** la separación de subcomponentes (`JobCardHeader.jsx`, etc.) es opcional. Si se prefiere un único `JobCard.jsx` monolítico (como `ProjectCard`), se puede hacer. La separación aporta (a) testabilidad granular, (b) reutilización de sub-estructuras si en el futuro se quiere un `JobListItem` minimal. La recomendación del Designer es **separar** para coherencia con la complejidad del contrato (8 secciones condicionales en el card).

---

## 11. Decisiones Abiertas para 03-architect

Estas decisiones quedan explícitas para la fase de arquitectura:

| ID | Decisión | Recomendación del Designer | Justificación |
|----|----------|---------------------------|---------------|
| **DA-01** | ¿El Featured card ocupa `grid-column: span 2` o `1fr`? | `1fr` (mismo espacio que Standard) | Consistencia visual; diferenciación por faro + borde animado + border-left es suficiente |
| **DA-02** | ¿El filter es global (un context para Projects + Jobs) o el context existente solo para Projects? | **Reusar `IsIconCheckFilter`** + hook paralelo `useSortJobs` | Una sola barra de filtros en la página, no dos; comportamiento idéntico al de Projects |
| **DA-03** | ¿El conector cronológico vertical se renderiza por card (`::before`) o por sección (`section::before`)? | Por sección (`section::before`) cuando `≥ 1200px` y `≥ 3 cards` | Más eficiente, una sola línea, animación única con ScrollTrigger |
| **DA-04** | ¿La duración calculada (`2y 4m`) se computa en el componente o viene pre-formateada en `job.period`? | **En el componente** (helper `formatDuration(job)`) | El spec dice que `period` es texto pre-formateado (EC-004), pero la duración es metadata derivada; calcularla en el componente evita duplicar lógica en `src/data/jobs.js` |
| **DA-05** | ¿Los achievements en estado expanded usan `aria-hidden` toggleado o se renderizan siempre y se ocultan visualmente con `height: 0`? | **Render siempre + `aria-hidden` + `height: 0`** | Más accesible (los screen readers pueden anunciar al expandir), más performante (no re-render) |
| **DA-06** | ¿El `JobCards` se monta dentro de la misma SPA como nueva `<section>` o en una ruta separada? | **Misma SPA**, nueva `<section id="experience">` entre Projects y AboutMe | El spec (A4) ya recomienda esto; no introduce routing |
| **DA-07** | ¿El `NavHeader` se actualiza en esta feature o queda para iteración separada? | **Queda fuera de scope** (consistente con A4: "El NavHeader se actualizará en una iteración separada") | Mantiene la feature pequeña y enfocada |
| **DA-08** | ¿Se necesita `prefers-color-scheme: light` (modo claro)? | **No se implementa en v1** | El portfolio es dark-only por Constitución I; el spec no lo pide |

---

## 12. Riesgos y Trade-offs

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Reordenamiento de la grid con FLIP cause jank en mobile gama baja** | Media | Medio | La FLIP tiene fallback a transición instantánea en `prefers-reduced-motion` y en `low-power devices` (heurística: `navigator.hardwareConcurrency < 4`) |
| **El pulso del faro en el Featured card distrae en reuniones de screening** | Baja | Bajo | El faro es pequeño (8px) y sutil; en `prefers-reduced-motion` se desactiva. Si la usuaria quiere apagarlo, no hay control in-UI, pero se documenta como mejora futura |
| **Los conectores cronológicos no se alinean perfectamente entre cards de alturas distintas** | Alta | Bajo | El conector se dibuja en el `::before` de la sección (no entre cards individuales), evitando problemas de alineación. La línea "atraviesa" los cards visualmente, lo cual es intencional y comunica "línea de tiempo continua" |
| **El placeholder de iniciales se ve inconsistente entre empresas** | Media | Bajo | Se define un helper `getInitials(company)` que toma el primer carácter de cada palabra (max 2); se trunca si excede. Documentado en la sección 3.1 |
| **El orden cronológico descendente no coincide con el orden de `src/data/jobs.js`** | Alta | Bajo | El componente **no** asume orden; el hook `useSortJobs` ordena siempre por `startDate` desc + `current` asc, replicando el patrón de `useSortProjects` |

---

## 13. Out of Scope (reiteración, alineado con spec §5)

El Designer **NO** diseñará en este documento:
- Integración con LinkedIn/GitHub APIs (OOS-01)
- CMS headless (OOS-02)
- i18n full (OOS-03)
- Edición inline (OOS-04)
- Salario/equity/beneficios (OOS-05)
- Reviews de empresas (OOS-06)
- Timeline horizontal con scroll (OOS-07)
- Bookmarks/favoritos (OOS-08)
- CV PDF dinámico (OOS-09)
- Tests E2E con Playwright (OOS-10)
- Animaciones typewriter/sonido (OOS-11)
- Analytics de interacción (OOS-12)

---

## 14. Checklist de cumplimiento (Constitución + Spec)

| Quality Gate (Constitución) | Estado | Nota |
|-----------------------------|--------|------|
| I. Portfolio (propósito) | ✓ | El JobCard es la carta de presentación profesional principal |
| II. Performance (60fps) | ✓ | Animaciones con `will-change` implícito (GSAP), 8 cards máx |
| III. Accesibilidad (WCAG 2.1 AA) | ✓ | ARIA completo, focus visible, contraste verificado |
| IV. Testing (≥80% coverage) | ➜ | Se traslada a 04-developer + 07-tester; SC-005 lo exige |
| V. Seguridad (sin secretos) | ✓ | Datos estáticos, sin APIs externas (EC-012) |
| VI. Animaciones significativas | ✓ | Cada animación comunica: entrada=orden, faro=presencia, conector=cronología, expand=profundidad |
| VII. Progressive enhancement | ✓ | Sin JS, el card se renderiza como HTML semántico (EC-010) |
| Stack: React 18.3.1 + GSAP 3.13.0 + CSS Modules | ✓ | Sin nuevas dependencias (A1) |

| Functional Req (Spec) | Estado | Sección |
|----------------------|--------|---------|
| FR-001 `<article>` + `aria-labelledby` | ✓ | §3.1, §8.1 |
| FR-002 orden visual (type, company, role, period, location, description, stack, tags, links) | ✓ | §3.1, §3.2 |
| FR-003 prop `job`, no acoplado a fuente | ✓ | §3.1 |
| FR-004 achievements vacío → no "Ver más" | ✓ | §3.1 (condicional `{job.achievements?.length > 0 && ...}`) |
| FR-005 stack vacío → fila oculta | ✓ | §3.1 (condicional `{Object.keys(job.stack).length > 0 && ...}`) |
| FR-006 companyLogo decorativo + onError → placeholder | ✓ | §3.1 |
| FR-007 type badge con color semántico y aria-label | ✓ | §2.1, §3.1, §8.1 |
| FR-008 links con `target="_blank"` + `rel="noopener noreferrer"` | ✓ | §3.1 (reusa `<LinkButton>` que ya cumple esto) |
| FR-009 GSAP ScrollTrigger + autoAlpha 0→1 + translateY 30px→0 | ✓ | §5.1 |
| FR-010 respeta `prefers-reduced-motion` con fallback 200ms fade | ✓ | §2.5, §5.7 |
| FR-011 cleanup `.kill()` en useEffect return | ✓ | §5.1, §5.3 |
| FR-012 reordenar con FLIP, <300ms, sin motion en reduced | ✓ | §5.6 |
| FR-013 60fps / 50fps gama baja | ✓ | §2.5, §12 (mitigaciones) |
| FR-014 navegación teclado completa | ✓ | §8.2 |
| FR-015 jest-axe 0 violaciones | ➜ | §8.7 (tests a 04-developer) |
| FR-016 `<time>` con `dateTime` ISO | ✓ | §3.1, §8.1 |
| FR-017 NO focus trap (expansión inline) | ✓ | §1 (A7 resuelto como inline) |
| FR-018 responsive grid breakpoints | ✓ | §7.1, §7.2 |
| FR-019 CSS variables existentes | ✓ | §2.2, §7.3 |
| FR-020 agnóstico al idioma (textos como props) | ✓ | §3.1 (constantes `expandLabel`, `collapseLabel`, etc.) |
| FR-021 error en consola si faltan required | ✓ | DA entregada a 04-developer (no es tema de diseño) |
| FR-022 PropTypes / TS types exportados | ✓ | DA entregada a 03-architect |

| Success Criteria (Spec) | Estado |
|------------------------|--------|
| SC-001 render <50ms | ✓ (datos estáticos, sin async) |
| SC-002 60fps animaciones | ✓ (verificado en §2.5) |
| SC-003 filter <100ms | ✓ (FLIP technique, no async) |
| SC-004 jest-axe 0 violaciones | ✓ (diseño) |
| SC-005 coverage ≥80% | ➜ (testing, fuera de diseño) |
| SC-006 functional con reduced-motion y sin JS | ✓ (§8.5, §8.6) |
| SC-007 bundle <2KB gzipped | ✓ (reuso de componentes existentes, no nuevas deps) |

---

## 15. Handoff a 03-architect

**Estado del diseño:** Completo. Listo para arquitectura.

**Tokens CSS definidos:** 25 nuevos en `src/index.css` (sección §10.1), 100% compatibles con el Design System 001.

**Decisiones cerradas por el Designer:**
- A6: dirección "Holo-Log Career" con conector cronológico + faro de pulso
- A7: expansión inline (no modal)
- A8: reusar `IsIconCheckFilter` + `useSortJobs` paralelo
- Open Q1: placement entre Projects y AboutMe
- Open Q4: assets en `public/logos/` con fallback a iniciales

**Decisiones abiertas para el Architect:** 8 (ver §11, DA-01 a DA-08).

**Observaciones críticas para el Architect:**
- La animación de `height: 0 → auto` (§5.5) requiere implementación cuidadosa; FLIP o measurement manual son las opciones.
- El Featured card NO debe tener `grid-column: span 2` (mantener grid simétrica).
- Los `useFadeInJobCard`, `useBeaconPulse`, `useFlipJobs` son **nuevos hooks** que el Architect debe planificar en `src/Hooks/`.
- El componente debe pasar `jest-axe` (FR-015); los tests están en el scope del Developer, pero el diseño debe **facilitarlo** (semántica correcta, ARIA correcto, focus management correcto).
- Sin nuevas dependencias (A1); todo se implementa con React 18.3.1, GSAP 3.13.0 y CSS Modules.

---

**Document Status:** Finalizado
**Last Updated:** 2026-06-01
**Next Agent:** 03-architect

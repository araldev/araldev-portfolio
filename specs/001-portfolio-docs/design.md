# Portfolio Design Specification

**Project:** araldev-portfolio
**Feature Branch:** 001-portfolio-docs
**Document Version:** 1.0.0
**Created:** 2026-06-01

---

## 1. Concept & Vision

El portfolio de Arturo Alba García (Araldev) es una experiencia web inmersiva y cinematográfica que combina animaciones scroll-triggered con GSAP y transiciones fluidas mediante Lenis. La estética fusiona un **futurismo minimalista** con acentos de luz neón cyan/verde sobre un fondo oscuro profundo, evocando la sensación de un entorno digital premium y tecnológicamente sofisticado.

El diseño prioriza:
- **Impacto visual inmediato** mediante animaciones de entrada dramáticas
- **Navegación fluida** con smooth scroll y elementos que aparecen/desaparecen orgánicamente
- **Identidad de marca personal** consistente con gradientes cyan-verde y branding visual propio
- **Responsive-first** con experiencia mobile equivalente a desktop

---

## 2. Design Language

### 2.1 Color Palette

| Role | Color | Usage |
|------|-------|-------|
| **Primary Background** | `#111117` | Fondo principal del sitio |
| **Cyan Accent** | `#00C9FF` | Gradientes de texto, efectos glow, acentos primarios |
| **Green Accent** | `#92FE9D` | Gradientes de texto, estados hover, acentos secundarios |
| **Blue Secondary** | `#5a9cff` | Subtítulos, gradientes alternos |
| **Blue Deep** | `#004e92` | Botones hover, fondos con gradiente |
| **Border Color** | `#7d9cb8` | Bordes sutiles en componentes |
| **Surface Blur** | `#5c5c5c50` | Overlays con blur (`backdrop-filter: blur(20px)`) |

### 2.2 Typography

**Font Stack:**
```css
font-family: Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
```

**Scale (Fluid with `clamp()`):**

| Element | CSS Variable | Min | Preferred | Max |
|---------|--------------|-----|-----------|-----|
| **Title** | `--font-size-title` | 2rem | `5vw + 1rem` | 4rem |
| **Subtitle** | `--font-size-subtitle` | 1.5rem | `2.5vw + 0.5rem` | 2rem |
| **Paragraph** | `--font-size-paragraph` | 1rem | `1.2vw + 0.5rem` | 1.25rem |
| **Button** | `--font-size-button` | 1rem | `1vw + 0.5rem` | 1.125rem |
| **Nav** | `--font-size-nav` | 1rem | `0.8vw` | 1.5rem |

**Weight System:**
- Title: `700` (Bold)
- Subtitle: `500` (Medium)
- Paragraph: `400` (Regular)
- Button: `700` (Bold)
- Nav: `700` (Bold)

### 2.3 Gradient Definitions

```css
/* Text Gradients */
--color-text-gradient: linear-gradient(90deg, #00C9FF, #92FE9D);
--color2-text-gradient: linear-gradient(135deg, #8fc6ff 0%, #5a9cff 100%);

/* Button Gradients */
--color-text-button-gradient: linear-gradient(90deg, #92FE9D 20%, #00C9FF 50%);
--color-text-button-hover-gradient: linear-gradient(135deg, #004e92 0%, #000428 100%);
--color-bg-button-gradient: linear-gradient(135deg, #004e92 0%, #000428 100%);
--color-bg-button-hover-gradient: linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%);

/* Background Gradients */
--color-background-gradient: linear-gradient(180deg, #e0f7f4 0%, #1a2a6c 50%, #a3e9ff 100%);
--color-background-radial-gradient-transparent: radial-gradient(circle, #111117 0%, rgba(17, 17, 23, 0) 100%);
```

### 2.4 Shadow System

```css
/* Button Shadow */
--shadow-button-box: 0 4px 15px rgba(0, 0, 0, .4);

/* Glow Effects (Cyan) */
--shadow-bg-obj1:
  0 0 10px 10px rgba(0, 201, 255, 0.7),
  0 0 25px 15px rgba(0, 201, 255, 0.5),
  0 0 40px 20px rgba(0, 201, 255, 0.4);

/* Glow Effects (Blue) */
--shadow-bg-obj2:
  0 0 10px 10px rgba(0, 78, 146, 0.7),
  0 0 25px 15px rgba(0, 78, 146, 0.5),
  0 0 40px 20px rgba(0, 78, 146, 0.4);
```

### 2.5 Spacing & Layout Tokens

```css
--width-web-content: 1200px;
--padding-nav: 0px 60px;
--padding-web-content: 60px 0px;
--border-radius: 12px;
--button-border-radius: 10px;
--button-padding: clamp(0.6rem, 1vw, 0.75rem) clamp(1rem, 2vw, 2rem);
--paragraph-max-width: 60ch;
```

### 2.6 Motion Philosophy

- **Entrada dramática**: Animaciones de título con SVG mask reveal al hacer scroll
- **Revelación progresiva**: Elementos aparecen con fade-in desde diferentes direcciones (up, down, left, right)
- **Micro-interacciones**: Hover effects en botones, iconos sociales con scale, navegación con glow
- **Fluidez**: Lenis para smooth scroll, transiciones CSS de 200-300ms
- **GSAP ScrollTrigger**: Animaciones basadas en posición de scroll con scrub para sincronización perfecta

---

## 3. Layout & Structure

### 3.1 Page Architecture

```
[AnimatedTitle Overlay - Full viewport, pinned during scroll]
    │
    ├── SVG Mask Animation (scroll-triggered reveal)
    ├── Hero Content (fades out on scroll)
    ├── Profile Image (parallax-like scaling)
    └── "Scroll down" indicator with bounce animation

[Main Content - after scroll animation completes]
    ├── NavHeader (fixed, appears on scroll-up)
    ├── HeroSection
    ├── ProjectsCards (with FilterProjects)
    ├── AboutMeSection
    ├── ContactSection
    └── Footer

[NavToTop - Fixed, appears after threshold]
```

### 3.2 Section Specifications

#### **AnimatedTitle Section**
- **Height:** 100svh (100% small viewport height)
- **Behavior:** Pinned during scroll animation (1.5x viewport height)
- **Elements:**
  - Profile image with blur-to-clear entrance animation
  - SVG mask overlay that reveals gradient text based on scroll
  - "Scroll down" indicator with infinite bounce animation

#### **HeroSection**
- **Layout:** Full viewport height, centered content left-aligned
- **Content:**
  - H1: "Arturo Alba García" (gradient text cyan→green)
  - H2: "Frontend Developer" (gradient text blue)
  - Paragraph: Brief description
  - Social icons row (LinkedIn, Gmail, GitHub, Discord)
  - Download CV button with animated hover

#### **ProjectsSection**
- **Grid:** `grid-template-columns: repeat(auto-fit, minmax(425px, 575px))`
- **Card Design:** Hexagonal clip-path with gradient backgrounds
- **Filter Bar:** Horizontal row of tech icons (JS, React, CSS, TS, etc.)

#### **AboutMeSection**
- **Grid:** 3-column asymmetric layout (avatar, brand, text)
- **Responsive breakpoints:**
  - 1450px: 2 columns
  - 1000px: 1 column stacked

#### **ContactSection**
- **Layout:** Centered form with stacked inputs
- **Fields:** Name, Email, Subject, Message
- **Integrations:** reCAPTCHA invisible + EmailJS

#### **Footer**
- **Layout:** 2-column grid (contact info + navigation links)
- **Brand:** Centered logo at bottom

### 3.3 Responsive Breakpoints

| Breakpoint | Target | Key Changes |
|------------|--------|-------------|
| **1600px** | Large desktop | Image positioned at 70% |
| **1300px** | Desktop | Image positioned at 75% |
| **1050px** | Desktop | Image positioned at 78% |
| **900px** | Tablet/Mobile | Nav overlay transforms, image at 80% |
| **850px** | Mobile | Hamburger menu enabled, overlay visible |
| **768px** | Mobile | Modal full-width, stacked layouts |
| **519px** | Small mobile | Card grid 350px columns |
| **500px** | Small mobile | Image repositioned, smaller mask |
| **470px** | Small mobile | Footer grid adjustments |

---

## 4. Component Inventory

### 4.1 Button Component

**States:**
- **Default:** Gradient text (cyan→green), dark gradient background
- **Hover:** Text gradient inverts to dark blue, background reveals cyan→green
- **Active:** Scale down slightly (0.95)
- **Disabled:** Gray gradient background, `cursor: not-allowed`, `pointer-events: none`

**Variants:**
- Primary (gradient text with animated fill)
- Download CV (special styling with `::before` and `::after` pseudo-elements)

### 4.2 LinkButton Component

**Purpose:** External links with optional icon
**Attributes:** Always uses `target="_blank"` and `rel="noopener noreferrer"`
**States:** Same hover behavior as Button

### 4.3 Social Icons

**Icons:** LinkedIn, GitHub, Gmail, Discord
**Behavior:** Scale 1.2x on hover, 40x40px default size
**States:**
- Default: SVG stroke/fill as designed
- Hover: Scale transform with smooth transition

### 4.4 Tech Icons (Filter)

**Available:** JS, React, CSS, Tailwind, HTML, TS, Git, GitHub, GSAP, Storybook, Vite, npm
**States:**
- Unchecked: Normal opacity
- Checked: Full color saturation with CSS class matching icon key
- Hover: Subtle scale (1.1x)

### 4.5 NavHeader Component

**Structure:**
- Logo (brand image, 173x60px)
- Desktop: Horizontal nav links with gradient text
- Mobile: Hamburger icon (3 strokes → X animation)

**States:**
- Hidden: `opacity: 0`, `transform: translate(-50%, -100%)`
- Visible: `opacity: 1`, `transform: translate(-50%, 0%)`
- Scrolled-down: Hides (triggered by scroll direction detection)
- Scrolled-up: Shows (GSAP ScrollTrigger)

**Mobile Menu:**
- Full-height overlay with blur backdrop
- Slide-in navigation from right
- Body scroll locked when open

### 4.6 ProjectCard Component

**Structure:**
- Image container with clip-path (hexagonal top)
- Text container with gradient background
- Tech icons row
- Links container with action buttons

**States:**
- Default: Subtle outer glow shadow
- Hover: Glow inset shrinks, reveal effect
- Tech icons: Dimmed when not matching filter, full color when matching

### 4.7 ProjectModal Component

**Behavior:**
- Portal rendered to `document.body`
- Pauses Lenis scroll on open
- Resumes Lenis on close
- Closes with Escape key or X button

**Animation (GSAP Timeline):**
1. Overlay fades in (0.3s)
2. Modal scales up from 0.92 (0.5s)
3. Hero section slides up (0.6s)
4. Close button rotates in (0.4s)
5. Detail sections reveal on scroll (IntersectionObserver)

**States:**
- Opening: Scale + fade + slide animation
- Open: Full content visible
- Scrolling: Detail sections animate on intersection
- Closing: Reverse animation or instant dismiss

### 4.8 NavToTop Component

**Visibility:** Appears when scroll exceeds threshold
**Position:** Fixed bottom-right (15px, 30px)
**Animation:** SVG circle progress indicator synced to scroll position
**States:**
- Hidden: `opacity: 0`, `transform: translateY(80px)`
- Visible: `opacity: 1`, `transform: translateY(0px)`

### 4.9 FilterProjects Component

**Structure:** Form with legend, horizontal flex of icon labels
**Interaction:** Toggle checkboxes (hidden inputs with styled labels)
**Behavior:** Updates context, triggers project re-sort

### 4.10 AnimatedTitle Component

**Layers (z-index order):**
1. Hero content (children)
2. Hero image container
3. Fade overlay (cyan gradient)
4. SVG overlay with mask
5. Title container (fixed, for mask reference)
6. Overlay copy (motivational quotes)

**Animation Sequence (ScrollTrigger):**
1. Image fades in with blur-to-clear (1s)
2. Image scales down as scroll progresses
3. SVG mask scales from 350 to 1
4. Fade overlay opacity increases after 25% progress
5. Quote text reveals between 60-85% progress

---

## 5. Interaction Patterns

### 5.1 Scroll Animations (GSAP ScrollTrigger)

**Hero Title Reveal:**
- **Trigger:** Scroll over hero section
- **Start:** `top top`
- **End:** `+={window.innerHeight * 1.5}`
- **Pin:** true, `pinSpacing: true`
- **Scrub:** 1 (smooth interpolation)

**NavHeader Show/Hide:**
- **Trigger:** Scroll direction change
- **Behavior:** Hides on scroll down, shows on scroll up
- **Implementation:** `useAnimatedNavHeader` hook

**FadeInElement:**
- **Trigger:** Element enters viewport (`top bottom`)
- **Animation:** `autoAlpha: 0→1`, translate from direction
- **Direction options:** up, down, left, right

**FadeInText:**
- **Trigger:** Same as FadeInElement
- **Animation:** Character-by-character reveal with gradient

### 5.2 Modal Interactions

**Open Modal:**
1. User clicks "Mostrar más"
2. Lenis stops (`lenis.stop()`)
3. Body overflow hidden
4. Modal renders via portal
5. GSAP timeline animation plays
6. Escape key listener added

**Close Modal:**
1. User clicks X or presses Escape
2. Event listeners removed
3. Body overflow restored
4. Lenis resumes (`lenis.start()`)
5. State cleared

**Detail Sections:**
- IntersectionObserver with 0.15 threshold
- GSAP animation on intersection
- Unobserve after animation to prevent re-trigger

### 5.3 Filter System

**User Flow:**
1. User clicks tech icon
2. Checkbox toggles (visual + state)
3. `IsIconCheckFilter` context updates
4. `useSortProjects` re-calculates order
5. Projects re-render with new sort

**Sort Logic:**
- Projects with more matching techs appear first
- 0 matches = placed at end

### 5.4 Form Submission

**Flow:**
1. User fills form fields (all required)
2. User clicks Send
3. reCAPTCHA executes invisibly
4. Token captured
5. EmailJS sends with form data + token
6. Success/error message displayed
7. Form resets on success

**Error Handling:**
- CAPTCHA incomplete: "Please complete the CAPTCHA"
- EmailJS failure: Display API error message
- Network failure: Display generic error

### 5.5 Micro-interactions

**Button Hover:**
- Background slides in from left (translateX -102% → 0%)
- Text gradient inverts
- Duration: 300ms ease-in-out

**Social Icon Hover:**
- Scale 1.2x
- Duration: 200ms ease-in-out

**Nav Link Hover:**
- Scale 1.2x
- Duration: 200ms ease-in-out
- Parent li gets cyan outline and inner glow

**Project Card Hover:**
- Inner glow shadow shrinks (inset animation)
- Duration: 200ms ease-in-out

**Footer Link Hover:**
- Color white
- TranslateX -10px
- Duration: 200ms ease-in-out

---

## 6. Responsive Strategy

### 6.1 Mobile-First Approach

The portfolio uses CSS Grid and Flexbox with mobile-first breakpoints. All layouts start stacked and expand to multi-column at appropriate breakpoints.

### 6.2 Critical Breakpoints

| Range | Device Priority | Layout Strategy |
|-------|-----------------|-----------------|
| 0-519px | Mobile | Single column, 350px cards |
| 520-850px | Mobile/Tablet | Hamburger menu, adjusted spacing |
| 851-1050px | Tablet/Desktop | Full nav, 2-column grids |
| 1051px+ | Desktop | Full experience |

### 6.3 Mobile Navigation

- **Hamburger Menu:** 46x46px fixed button (top: 15px, right: 30px)
- **Overlay:** Full-screen blur backdrop
- **Menu Panel:** 50% width (min 280px), slides from right
- **Scroll Lock:** `body:has(.checkbox:checked)` prevents background scroll

### 6.4 Touch vs Pointer Media Queries

```css
/* Fine pointer (mouse) */
@media (hover: hover) and (pointer: fine) {
  &:hover { /* hover effects */ }
}

/* Coarse pointer (touch) */
@media (hover: none) and (pointer: coarse) {
  &:active { /* active effects */ }
}
```

This ensures appropriate feedback on both touch and mouse devices.

### 6.5 Image Adaptation

- **Profile Image:** Repositioned via CSS transforms at breakpoints
- **Project Images:** `object-position` adjustment at small breakpoints
- **Mask Gradients:** Adjust coverage at mobile to reveal more/less

---

## 7. Accessibility

### 7.1 ARIA Attributes

| Component | ARIA | Purpose |
|-----------|------|---------|
| ProjectModal | `role="dialog"`, `aria-modal="true"` | Modal dialog announcement |
| ProjectModal | `aria-label="Detalles de {project.title}"` | Modal identification |
| Close Button | `aria-label="Cerrar"` | Close action description |
| NavHeader | Implicit nav role | Navigation landmark |
| FilterProjects | `legend` element | Form group description |

### 7.2 Keyboard Navigation

| Key | Component | Action |
|-----|-----------|--------|
| Escape | ProjectModal | Close modal |
| Tab | All interactive | Standard focus order |
| Enter/Space | Checkbox filters | Toggle filter |

### 7.3 Focus Management

- **Modal:** Focus trapped within modal content
- **Close Button:** Visible focus ring on `:focus`
- **Links:** Clear focus states via CSS

### 7.4 Color Contrast

- **Primary Text:** White (`#fff`) on dark background (`#111117`) - ratio 15.9:1 ✓
- **Secondary Text:** Light gray (`#ddd`) - ratio 11.5:1 ✓
- **Gradient Text:** Semi-transparent over dark - passes AA for large text
- **Border Color:** `#7d9cb8` on dark - ratio 7.2:1 ✓

### 7.5 Semantic HTML

- **Headings:** Proper hierarchy (h1 → h2 → h3)
- **Sections:** `<section>` with `id` for navigation
- **Navigation:** `<nav>` with `<ul>` links
- **Articles:** `<article>` for project cards
- **Labels:** Proper `<label>` associations with inputs

### 7.6 External Links Security

All external links use `rel="noopener noreferrer"`:
```jsx
<a href="..." target="_blank" rel="noopener noreferrer">
```

### 7.7 Reduced Motion

The design relies heavily on animations, but graceful degradation is possible:
- Animations enhance experience but content is accessible without JS
- CSS transitions provide fallback for basic hover states
- GSAP animations are progressive enhancement

---

## 8. Design Assets

### 8.1 Brand Assets

| Asset | File | Dimensions | Usage |
|-------|------|------------|-------|
| Avatar | `yo-sin-fondo-M.webp` | - | Profile image in Hero/About |
| Brand Logo | `brand-araldev.webp` | - | Footer, large format |
| Brand Thumbnail | `brand-araldev-miniatura.webp` | 173x60px | NavHeader logo |

### 8.2 Project Data Structure

```javascript
Project {
  id: string,
  imgSrc: string,
  title: string,
  description: string[],
  tech: { [key]: ReactNode }, // JSX icons
  links: {
    npmLink?: string,
    storybookLink?: string,
    demoLink?: string,
    codeLink?: string
  },
  details: Detail[]
}

Detail {
  id: string,
  imgIndex: number,
  featureTag?: string,
  title: string,
  text: string
}
```

### 8.3 Icon Library

Custom SVG icons in `src/components/Icons/Icons.jsx`:
- Social: LinkedIn, GitHub, Gmail, Discord, Demo
- Tech: JavaScript, React, CSS, Tailwind, HTML, TypeScript, Git, GitHub, GSAP, Storybook, Vite, npm
- Utils: ArrowUp, ArrowDown

---

## 9. Technical Implementation Notes

### 9.1 CSS Modules

All components use CSS Modules for scoped styling:
- `*.module.css` files co-located with components
- CSS custom properties defined in `src/index.css`
- No style collisions between components

### 9.2 GSAP Integration

```javascript
// ScrollTrigger registration (required)
gsap.registerPlugin(ScrollTrigger)

// Cleanup pattern in useEffect
return () => {
  if (trigger) trigger.kill()
  if (animation) animation.kill()
}
```

### 9.3 Lenis Configuration

```javascript
// Global smooth scroll
import Lenis from 'lenis'
// Paused when modal open: lenis.stop()
// Resumed when modal close: lenis.start()
```

### 9.4 EmailJS Integration

```javascript
// Environment variables required
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
VITE_RECAPTCHA_INVISIBLE_SITE_KEY
```

### 9.5 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 6.3.5 | Build tool |
| GSAP | 3.13.0 | Animations |
| Lenis | 1.3.3 | Smooth scroll |
| react-google-recaptcha | ^3.x | Invisible CAPTCHA |
| emailjs-com | ^4.x | Email sending |

---

## 10. File Structure

```
src/
├── components/
│   ├── AboutMe/
│   │   ├── AboutMeSection.jsx
│   │   └── AboutMeSection.module.css
│   ├── AnimatedTitle/
│   │   ├── AnimatedTitle.jsx
│   │   ├── AnimatedTitle.module.css
│   │   └── titles.js
│   ├── Backgrounds/
│   │   ├── BackgroundHero.jsx
│   │   ├── BackgroundHero.module.css
│   │   ├── BackgroundHeroCanvas.jsx
│   │   └── BackgroundHeroCanvas.module.css
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.module.css
│   ├── Contact/
│   │   ├── ContactSection.jsx
│   │   └── ContactSection.module.css
│   ├── FilterProjects/
│   │   ├── FilterProjects.jsx
│   │   └── FilterProjects.module.css
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   └── Footer.module.css
│   ├── HeroSection/
│   │   ├── HeroSection.jsx
│   │   └── HeroSection.module.css
│   ├── Icons/
│   │   └── Icons.jsx
│   ├── LinkButton/
│   │   ├── LinkButton.jsx
│   │   └── LinkButton.module.css
│   ├── NavHeader/
│   │   ├── NavHeader.jsx
│   │   └── NavHeader.module.css
│   ├── NavToTop/
│   │   ├── NavToTop.jsx
│   │   └── NavToTop.module.css
│   ├── ProjectModal/
│   │   ├── ProjectModal.jsx
│   │   └── ProjectModal.module.css
│   └── ProjectsCards/
│       ├── ProjectsCards.jsx
│       └── ProjectsCards.module.css
├── contexts/
│   └── IsIconCheckFilter.jsx
├── data/
│   ├── icons.js
│   ├── iconsVariables.js
│   └── projects.js
├── Hooks/
│   ├── useAnimatedNavHeader.js
│   ├── useAnimatedNavToTop.js
│   ├── useAnimatedTitle.js
│   ├── useFadeInElement.js
│   ├── useFadeInText.js
│   ├── useIsIconCheckFilter.js
│   ├── useNavPaths.js
│   ├── useNavToTopPath.js
│   ├── usePreloadImg.js
│   ├── useSendEmailJs.js
│   └── useSortProjects.js
├── assets/
│   ├── yo-sin-fondo-M.webp
│   ├── brand-araldev.webp
│   └── brand-araldev-miniatura.webp
├── App.jsx
├── index.css
└── index.jsx
```

---

**Document Status:** Finalizado
**Last Updated:** 2026-06-01

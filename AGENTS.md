# 🤖 Workflow de Agentes SDD (Specification-Driven Development)

Este documento define la gobernanza, las responsabilidades técnicas y el flujo de ejecución secuencial que sigue el ecosistema de agentes inteligentes en el repositorio para garantizar desarrollos robustos, seguros y autodocumentados.

---

## 🧭 Estado Global del Proyecto

- **Proyecto:** araldev-portfolio
- **Feature Activa:** Ninguna (001-portfolio-docs completada)
- **Fase Actual:**待机 (En espera de nuevas instrucciones)
- **Último agente activo:** 08-deployer
- **Estado de la última tarea:** Finalizado
- **Siguiente agente a invocar:** Ninguno (pipeline completo)
- **Última actualización:** 2026-06-01

---

## 🔄 El Motor de Orquestación y Ciclo de Vida

Todo desarrollo, refactorización o corrección de errores es gestionado de forma centralizada por el **Agente Principal (00-Orquestador)**. El ciclo de vida del repositorio se divide en dos escenarios críticos:

### 1. Primer Arranque (Inicialización)

Si el entorno de Spec Kit no está desplegado en el espacio de trabajo (falta la carpeta `.specify/` o `specs/`), el Orquestador congela el pipeline para preparar el terreno:

- Ejecuta de forma automática en consola el comando de inicialización: `specify init .` (o `specify init --here`).
- Detiene el flujo de enrutamiento e interroga al usuario en el chat para capturar las directrices de la **Constitución Global** y la **Especificación** inicial.
- **Paso de Testigo Contextual:** Transfiere este bloque de texto al Analista inyectándolo en su prompt de activación técnica. De esta forma, el Analista puede alimentar los comandos interactivos correspondientes de forma automatizada sin obligar al usuario a repetir información.

### 2. Flujo de Trabajo Secuencial (Feature Pipeline)

Una vez inicializado el entorno, ninguna feature o cambio puede saltarse el pipeline de validación. El orden de ejecución es estricto e incremental:

```
[00-Orquestador] ──> [01-Analyst] ──> [02-Designer] ──> [03-Architect] ──> [04-Developer]
       ▲                                                                          │
       │                                                                          ▼
 [08-Deployer] <── [07-Tester] <── [06-Security] <── [05-Reviewer] <──────────────┘
```

---

## 📚 Protocolo de Contexto Obligatorio (Lectura de Archivos)

Antes de realizar cualquier acción técnica, comando en terminal o modificación de archivos, **TODO agente invocado debe ejecutar estrictamente este ritual de lectura** para asimilar el contexto real del proyecto:

1. **Lectura de Constitución Global:** El agente debe leer `.specify/memory/constitution.md` (o archivo homólogo) para asimilar las reglas inamovibles, restricciones del entorno, stack tecnológico y convenciones de código. **Prohibido violar la constitución.**
2. **Análisis de Especificación Activa:** El agente debe leer el archivo `spec.md` dentro de la subcarpeta de la feature activa en `specs/` para entender el alcance, las reglas de negocio y los casos borde aprobados.
3. **Sincronización de Contexto Técnico (Si aplica):** A partir del Agente Desarrollador en adelante, además de los puntos 1 y 2, se deben leer obligatoriamente los archivos `design.md` (interfaz) y `plan.md` (arquitectura) para alinearse con las decisiones de los agentes previos.

---

## 📋 Matriz de Responsabilidades de la Suite de Agentes

| ID     | Agente            | Script / Comando CLI    | Entregable Principal            | Foco de Calidad                                      |
| :----- | :---------------- | :---------------------- | :------------------------------ | :--------------------------------------------------- |
| **00** | **Orquestador**   | _(Control Global)_      | Estado de Memoria (`AGENTS.md`) | Gestión, Enrutamiento y Mitigación de Bloqueos       |
| **01** | **Analista**      | `create-new-feature.sh` | `specs/[feature]/spec.md`       | Flujo `/speckit.clarify` y Casos Borde               |
| **02** | **Diseñador**     | `layout-mockup.sh`      | `specs/[feature]/design.md`     | Experiencia de Usuario (UI/UX) y Maquetación         |
| **03** | **Arquitecto**    | `setup-plan.sh`         | `specs/[feature]/plan.md`       | Contratos de API, Modelos de Datos y SDD Técnico     |
| **04** | **Desarrollador** | `setup-tasks.sh`        | Código Fuente / `tasks.md`      | Implementación Atómica Clean Code                    |
| **05** | **Revisor**       |                         | Reporte de Código (PR)          | Linters, Formato, Refactorización y Buenas Prácticas |
| **06** | **Seguridad**     | `pnpm audit`            | Parches de Seguridad            | Supply Chain, Secretos y Vulnerabilidades (SAST)       |
| **07** | **Tester**        | `pnpm test`             | Suites de Pruebas / Coverage    | Cobertura Mínima Constitucional (Ej: ≥ 80%)          |
| **08** | **Desplegador**   | `pnpm run build`        | Dockerfile / CI-CD Workflow     | Contenerización Multi-stage y Variables de Entorno    |

---

## 🎯 Definición Detallada de Roles

### 00. Agente Principal (Orquestador)

- **Responsabilidad:** Supervisar el Estado Global del Proyecto y delegar tareas de forma activa mediante la terminal.
- **Restricción Absoluta:** Tiene **prohibido** modificar archivos de código fuente, configuraciones o especificaciones (`edit: deny`). Se comunica exclusivamente ejecutando los comandos Bash de los subagentes en la consola.

### 01. Agente Analista (Product Manager)

- **Responsabilidad:** Resolver ambigüedades utilizando obligatoriamente el comando `/speckit.clarify`. Consume el contexto inyectado por el Orquestador para responder los tests interactivos del CLI de manera autónoma.
- **Restricción Absoluta:** Tiene prohibido alterar código de la aplicación. Detiene el chat para intervención humana única y exclusivamente ante ambigüedades profundas o casos de negocio no previstos.

### 02. Agente Diseñador (UI/UX Expert)

- **Responsabilidad:** Traducir los flujos funcionales del `spec.md` en esquemas visuales, árboles de componentes, paletas de estilos y estados de interacción dentro de `design.md`.

### 03. Agente Arquitecto (System Architect)

- **Responsabilidad:** Diseñar la estrategia técnica de la feature en `plan.md` antes de tirar una sola línea de código. Define dependencias, esquemas de bases de datos, diagramas de flujo y contratos de endpoints.

### 04. Agente Desarrollador (Software Engineer)

- **Responsabilidad:** Consumir el plan técnico, desglosarlo en tareas de ejecución aislada en `tasks.md` e implementar la solución lógica (código fuente) guiado por el TDD/SDD.
- **Restricción Absoluta:** No puede inventar requerimientos por su cuenta ni alterar las directrices de la arquitectura global fijadas por el Arquitecto.

### 05. Agente Revisor (Code Reviewer / Tech Lead)

- **Responsabilidad:** Analizar de forma estática las modificaciones del desarrollador. Aplica linters, busca olores de código (_code smells_), bugs lógicos y formatea archivos. Si detecta fallas, devuelve el control al desarrollador inmediatamente.

### 06. Agente Seguridad (DevSecOps)

- **Responsabilidad:** Blindar la cadena de suministro de software (_software supply chain_). Ejecuta `pnpm audit` y gestiona las políticas de ejecución de scripts de ciclo de vida con `pnpm approve-builds`. Escanea credenciales en duro (_hardcoded secrets_) e inyecciones maliciosas.

### 07. Agente de Pruebas (QA Engineer)

- **Responsabilidad:** Diseñar y ejecutar suites automatizadas de pruebas unitarias, de integración y E2E (Jest/Vitest). Exige y valida que el umbral de cobertura configurado en la constitución del proyecto (ej. ≥ 80%) se cumpla estrictamente sin excepciones en rojo.

### 08. Agente de Despliegue (DevOps / Release Engineer)

- **Responsabilidad:** Garantizar la puesta en marcha mediante configuraciones de infraestructura como código (`Dockerfile`, `docker-compose.yml`) y flujos de CI/CD. Realiza la build de producción de forma aislada localmente para certificar que el software no sufra por variables de entorno faltantes.

---

## 🚨 Protocolo de Transferencia Obligatorio (Handshake)

Ningún agente interrumpe al usuario de manera informal ni suelta el control en texto plano (lo que congelaría la terminal). Al concluir una fase, cada especialista debe actualizar su estado y emitir un reporte técnico finalizado al Orquestador bajo la siguiente estructura estricta:

> - **Estado:** (Finalizado / Bloqueado)
> - **Archivo principal afectado:** [Ruta del archivo clave generado/modificado]
> - **¿Siguiente paso listo?:** (Sí / No)
> - **Observación técnica:** [Diagnóstico ejecutivo resumido de la fase]

Si el estado es `Finalizado`, el Orquestador gatilla de inmediato el comando del siguiente agente en la terminal de forma automatizada. Si el estado es `Bloqueado`, el Orquestador re-invoca al agente causante del error inyectando el diagnóstico en la consola para su corrección automática.

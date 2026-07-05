# BookLibre

> Plataforma peer-to-peer de préstamo de libros físicos con gamificación, persistencia políglota y panel analítico en tiempo real.

![Kotlin](https://img.shields.io/badge/Kotlin-1.9.25-7F52FF?style=flat&logo=kotlin&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.1-6DB33F?style=flat&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-DGS_9.2-E10098?style=flat&logo=graphql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## Objetivo Académico

BookLibre es el proyecto final integrador de la materia **Programación con Herramientas de Modernas (PHM)** de la [Universidad Nacional de San Martín (UNSAM)](https://www.unsam.edu.ar/), cursada durante el primer cuatrimestre de 2026. El proyecto fue construido de forma incremental y didactica para aplicar en la práctica cada tecnología de persistencia vista en la materia:

---
## Demo

https://github.com/user-attachments/assets/f1361d0d-b9c1-4d68-a1bc-73ec9c22b7ac

La demo recorre el flujo completo de la aplicación desde tres perspectivas:

**Lector** — Se explora el catálogo con los filtros combinados del Home (género, rango de páginas, fechas de disponibilidad, ISBN). Al entrar al detalle de un libro se reserva en un rango de fechas; una vez confirmada la reserva, esas fechas quedan bloqueadas en el calendario y no pueden volver a seleccionarse, y los bibliokarmas del usuario se actualiza. Desde la página de perfil del lector se muestra la gestión de libros propios: filtrado, eliminación y edición. También se navega por las distintas vistas del perfil y se realiza un cambio de datos personales.

**Reseña** — Se califica un libro devuelto con una puntuación y comentario. Inmediatamente después se ingresa al detalle del libro y se verifica que la nueva reseña aparece publicada, la puntuación del libro se actualiza, mostrando el ciclo completo: reserva → devolución → calificación → visibilidad en el catálogo.

**Administrador** — Se ingresa con el usuario admin al panel de control y se navega por las métricas del dashboard. En la sección de **Actividad Reciente** se observa que las reservas realizadas durante la demo figuran en el feed en tiempo real, conectando las tres capas de persistencia (Redis, MongoDB y PostgreSQL) en una sola pantalla.

---

## Funcionalidades Principales

- **Autenticación JWT** con access token + refresh token y jerarquía de roles (`READER`, `PUBLISHER`, `COMBINED`, `ADMIN`)
- **Catálogo de libros** paginado con filtros combinables: título, género literario, rango de páginas (slider), rango de fechas de disponibilidad, ISBN, nombre del dueño; ordenable por título, autor, dueño o popularidad (clicks)
- **Sistema de reservas** con validación de solapamiento de fechas, restricciones de negocio por tipo de usuario y bloqueo visual del calendario en el detalle del libro
- **BiblioKarmas**: sistema de gamificación que premia las lecturas con puntos calculados dinámicamente según el tipo de libro y el perfil del lector (patrón Template Method)
- **Panel de control analítico** (solo Admin) con 5 métricas en tiempo real servidas por GraphQL: tasa de conversión, estado del catálogo, análisis de calificaciones, actividad reciente y leaderboard de lectores
- **Click tracking** en Redis (sorted set) para calcular popularidad y servir la primera página del catálogo directamente desde caché, sin tocar MongoDB
- **Caché de libros** en Redis (JSON con TTL) que se actualiza en cada búsqueda en MongoDB, reduciendo latencia en las consultas más frecuentes
- **Schema stitching con OpenLibrary**: el resolver GraphQL enriquece los datos de un libro por ISBN con metadata externa en tiempo real
- **Gestión completa de libros**: publicación, edición y baja lógica (bloqueada si el libro está prestado actualmente)
- **Reseñas y calificaciones** habilitadas únicamente después de confirmar la devolución del libro

---

## Arquitectura General

BookLibre implementa **persistencia políglota**: cada tipo de dato se almacena en la tecnología más adecuada para su naturaleza y patrón de acceso.

```
┌──────────────────────────────────────────────────────────────────┐
│                        Cliente (Browser)                         │
│               React 19 + TypeScript + Vite + Tailwind            │
└─────────────────────────┬────────────────────────────────────────┘
                          │  REST (Axios) + GraphQL (fetch)
┌─────────────────────────▼────────────────────────────────────────┐
│                     Spring Boot 3 (Kotlin)                       │
│                                                                  │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐   │
│  │   REST API   │  │  GraphQL API  │  │  JWT Security Filter │   │
│  │ (Controllers)│  │ (Netflix DGS) │  │                      │   │
│  └──────┬───────┘  └──────┬────────┘  └──────────────────────┘   │
│         └─────────────────┤                                      │
│                    ┌──────▼──────────────────────────────────┐   │
│                    │             Services                    │   │
│                    │  Book · Reservation · User · Auth       │   │
│                    │  BookCache · ClickRanking · OpenLibrary |   │
│                    └──┬─────────────────┬──────────────┬─────┘   │
└───────────────────────┼─────────────────┼──────────────┼─────────┘
                        │                 │              │
             ┌──────────▼──┐   ┌──────────▼──┐   ┌──────▼───────┐
             │ PostgreSQL  │   │   MongoDB   │   │   Redis 7    │
             │             │   │             │   │              │
             │ - Usuarios  │   │ - Catálogo  │   │ Sorted set   │
             │ - Reservas  │   │   de libros │   │ (click rank) │
             │ - Reseñas   │   │   (polímorfo│   │ JSON cache   │
             │ - Autores   │   │ - Clicks    │   │ (libros/TTL) │
             └─────────────┘   └─────────────┘   └──────────────┘
```

**Decisiones de diseño:**

- Los **libros** viven en MongoDB por su naturaleza semiestructurada y su polimorfismo (3 subtipos concretos con comportamiento distinto)
- Las **reservas y usuarios** viven en PostgreSQL para garantizar integridad referencial y consistencia transaccional
- **Redis** actúa como capa de caché: el sorted set `bookClicks` permite servir la primera página del Home sin una sola consulta a MongoDB; el JSON cache por libro reduce la latencia de búsquedas repetidas
- El **panel de admin** agrega datos de las tres fuentes mediante resolvers GraphQL independientes, con schema stitching hacia OpenLibrary para enriquecer libros por ISBN

---

## Stack Tecnológico

### Backend

| Tecnología | Versión | Rol |
|------------|---------|-----|
| Kotlin | 1.9.25 | Lenguaje principal |
| Spring Boot | 3.3.1 | Framework web y DI |
| Spring Data JPA / Hibernate | — | Persistencia relacional (PostgreSQL) |
| Spring Data MongoDB | — | Persistencia documental |
| Spring Security | — | Autenticación y control de acceso |
| Netflix DGS | 9.2.2 | Servidor GraphQL |
| JJWT | 0.12.6 | Generación y validación de JWT |
| PostgreSQL | 18 | Base de datos relacional |
| MongoDB | Atlas | Base de datos documental |
| Redis | 7 | Caché (JSON) y ranking (sorted set) |
| Kotest + MockK | 5.8.0 | Framework de tests |
| JaCoCo | — | Cobertura de código |
| Gradle (Kotlin DSL) | — | Build tool |
| Docker + Docker Compose | — | Entorno de desarrollo local |

### Frontend

| Tecnología | Versión | Rol |
|------------|---------|-----|
| React | 19 | UI framework |
| TypeScript | 5.9 | Tipado estático |
| Vite | 7 | Bundler y dev server |
| Tailwind CSS | v4 | Estilos utilitarios |
| React Router | v7 | Routing con guardias por rol |
| Axios | — | Cliente HTTP |
| Headless UI | — | Componentes accesibles base |
| Motion | — | Animaciones |
| Vitest + Testing Library | — | Testing de componentes |

---

## Backend — Aspectos Destacados

### Sistema de BiblioKarmas (Gamificación)

Al confirmar una reserva, el sistema calcula y acredita BiblioKarmas al lector según el tipo de libro usando el patrón **Template Method**:

| Tipo de libro | Fórmula |
|---------------|---------|
| `Common` | `páginas × 5` si el lector tiene < 1000 karmas, sino `páginas × 2` |
| `WithADedication` | `200 + 10 × cantidad total de reservas del libro` |
| `Collectable` | `ceil(karmas actuales del lector / 5) + páginas` |

Esto genera una economía dinámica donde libros populares y coleccionables valen más, y lectores con pocos karmas reciben un bono para incentivar su crecimiento.

### Persistencia Políglota

**MongoDB** almacena el catálogo con un modelo polimórfico. El campo `bookType` actúa como discriminador para deserializar al subtipo correcto. El modelo embebe las últimas dos reseñas y los rangos de fechas reservadas para evitar joins en la vista de detalle.

**PostgreSQL** garantiza integridad en las relaciones críticas del negocio. Incluye componentes de base de datos definidos explícitamente:
- **Funciones**: libros reservados por un usuario en el año en curso; usuarios con más de N reservas
- **Trigger**: auditoría automática de cambios en calificaciones (valor anterior → nuevo, timestamp)
- **Vista**: usuarios con más de 2 reservas en estado RETURNED
- **Constraint**: `bibliokarmas NOT NULL DEFAULT 0`

**Redis** opera en dos modos simultáneos:
1. **Sorted set** `bookClicks`: cada click al detalle de un libro incrementa su score. La primera página del Home consulta los top-10 IDs del sorted set, busca los libros en caché JSON y hace fallback a MongoDB solo ante un miss, eliminando la mayoría de las consultas en la ruta más caliente.
2. **JSON cache** por `bookId` con TTL: se actualiza en cada búsqueda servida desde MongoDB, amortizando el costo de queries complejas.

### API GraphQL (Netflix DGS)

El panel de control expone 5 métricas a través de un schema GraphQL, cada una con su propia fuente de datos:

```graphql
type Query {
  conversionRate: [BookConversion!]!         # Top-5 por clicks (Redis) × reservas (Postgres)
  catalogHealth: CatalogHealth!              # 4 buckets mutuamente excluyentes del catálogo
  calificactionAnalisis: [RatingAnalysis!]!  # Rating promedio por tipo de libro (MongoDB)
  recentActivity: [RecentActivityItem!]!     # Feed unificado: registros + reservas recientes
  book(isbn: String!): BookGql               # Schema stitching con OpenLibrary API
}
```

El resolver `book(isbn)` realiza **schema stitching**: enriquece los datos almacenados en MongoDB con metadata de la API pública de OpenLibrary y hace fallback al `imageSrc` local si la respuesta externa falla.

### Seguridad

- Filtro JWT stateless aplicado a todos los endpoints protegidos
- Access token: 15 minutos de vida
- Refresh token: 30 minutos, almacenado en PostgreSQL y rotado en cada uso
- Jerarquía de roles: `ADMIN` > `COMBINED` > `PUBLISHER` / `READER`
- Los endpoints del panel de administración requieren rol `ADMIN` explícitamente

---

## Frontend — Aspectos Destacados

### Routing y control de acceso por rol

El enrutamiento está centralizado en `AppRouter.tsx` y protegido mediante wrappers de layout que verifican el rol del usuario antes de renderizar la ruta. Si el token expira, `AuthContext` lo detecta y redirige al login automáticamente.

| Layout guard | Roles permitidos | Rutas protegidas |
|---|---|---|
| `PrivateLayer` | Cualquier usuario autenticado | Profile, LoanDetails, BookDetail (acciones) |
| `PublisherLayer` | `PUBLISHER`, `COMBINED`, `ADMIN` | EditBook, CreateBook |
| `AdminLayer` | `ADMIN` | ControlPanel (dashboard) |

### Gestión de estado

- **`AuthContext`**: mantiene el JWT decodificado en memoria, expone el usuario actual y las funciones de login/logout. Persiste el access token en `localStorage` y renueva el refresh token de forma transparente.
- **`UserProfileContext`**: mantiene el perfil completo del usuario activo (incluyendo BiblioKarmas actualizados) y lo sincroniza tras cada reserva o edición de perfil.

### Páginas principales

| Página | Descripción |
|--------|-------------|
| **Home** | Catálogo paginado con filtros combinables (género, páginas, fechas, ISBN, dueño) y orden por popularidad o alfabético. Primera página servida desde Redis. |
| **BookDetail** | Detalle completo del libro, calendario con fechas bloqueadas, preview de BiblioKarmas a ganar y formulario de reserva. |
| **Profile** | Perfil del usuario con sus libros publicados (tabs: disponibles / prestados / devueltos), paginado y ordenable. |
| **LoanDetails** | Vista dual: libros que reservé vs. libros que presté. Habilita la calificación del libro una vez devuelto. |
| **EditBook / CreateBook** | Formulario de alta y edición de libros con validaciones por tipo (`Common`, `WithADedication`, `Collectable`). |
| **ControlPanel** | Dashboard de administración con 4 gráficos alimentados por las queries GraphQL en tiempo real. |

### Consumo de GraphQL

El servicio `graphqlService.ts` construye y envía las queries GraphQL al endpoint `/graphql` del backend via `fetch`. Cada métrica del dashboard tiene su propia query tipada en TypeScript, lo que garantiza que los datos del panel siempre coinciden con el schema del servidor.

---

## Configuración y Ejecución Local

### Prerrequisitos

- JDK 21+
- Docker + Docker Compose
- Node.js 20+ y pnpm

### Backend

```bash
# 1. Levantar las bases de datos (Postgres, pgAdmin, MongoDB, Redis, RedisInsight)
cd backend
docker-compose up -d
```

| Servicio | URL local |
|----------|-----------|
| API REST | `http://localhost:8080` |
| pgAdmin | `http://localhost:5050` |
| RedisInsight | `http://localhost:5540` |

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
# Disponible en http://localhost:5173
```

---

## Deploy

La aplicación está desplegada en **Render** con la siguiente topología:

| Componente | Servicio |
|------------|----------|
| Backend (Spring Boot) | Render Web Service (Docker) |
| Base de datos relacional | Render Postgres |
| Caché y ranking | Render Key Value (Redis) |
| Catálogo de libros | MongoDB Atlas |

---
## 👩‍💻 Proyecto desarrollado en equipo
- Catalina Correa
- Nicolas Cernadas
- Dana Cossettini Reyes
- Maximiliano Andres Bianchimano
- Fernanda Perez

---

## 📫 Contacto

**Dana Cossettini Reyes** - 
Estudiante avanzada de Programación Informática - 
📧 dana2004c.r@gmail.com

**Institución:** Universidad Nacional de San Martín (UNSAM) · **Año:** 2026

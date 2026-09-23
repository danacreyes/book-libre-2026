# BookLibre

> A peer-to-peer platform for lending physical books, with gamification, polyglot persistence and a real-time analytics dashboard

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

## Academic Purpose
 
BookLibre is the final integrative project for the course **Programming with Modern Tools (PHM)** at the [National University of San Martín (UNSAM)](https://www.unsam.edu.ar/), taken during the first semester of 2026. The project was built step by step, with a focus on learning, in order to apply in practice each persistence technology covered in the course:

---
## Demo

https://github.com/user-attachments/assets/f1361d0d-b9c1-4d68-a1bc-73ec9c22b7ac

The demo goes through the complete flow of the application from three perspectives:
 
**Reader** — The user browses the catalog using the combined filters on the Home page (genre, page range, availability dates, ISBN). On a book's detail page, the user reserves it for a range of dates. Once the reservation is confirmed, those dates are blocked in the calendar and can no longer be selected, and the user's BiblioKarmas are updated. From the reader's profile page, the demo shows how to manage their own books: filtering, deleting and editing. It also navigates through the different profile views and updates some personal data.

**Review** — A returned book is rated with a score and a comment. Right after that, the demo opens the book's detail page and checks that the new review has been published and that the book's rating has been updated. This shows the full cycle: reservation → return → rating → visibility in the catalog.
 
**Administrator** — The admin user logs in to the control panel and explores the dashboard metrics. In the **Recent Activity** section, the reservations made during the demo appear in the real-time feed, which connects the three persistence layers (Redis, MongoDB and PostgreSQL) on a single screen.

---
 
## Main Features
 
- **JWT authentication** with access token + refresh token and a role hierarchy (`READER`, `PUBLISHER`, `COMBINED`, `ADMIN`)
- **Paginated book catalog** with combinable filters: title, literary genre, page range (slider), availability date range, ISBN and owner name; it can be sorted by title, author, owner or popularity (clicks)
- **Reservation system** with date-overlap validation, business rules based on user type, and visual blocking of dates in the calendar on the book detail page
- **BiblioKarmas**: a gamification system that rewards reading with points, calculated dynamically according to the type of book and the reader's profile (Template Method pattern)
- **Analytics control panel** (Admin only) with 5 real-time metrics served through GraphQL: conversion rate, catalog status, rating analysis, recent activity and reader leaderboard
- **Click tracking** in Redis (sorted set) to calculate popularity and to serve the first page of the catalog directly from the cache, without querying MongoDB
- **Book cache** in Redis (JSON with TTL), updated on every MongoDB search to reduce latency in the most frequent queries
- **Schema stitching with OpenLibrary**: the GraphQL resolver enriches a book's data by ISBN with external metadata in real time
- **Complete book management**: publishing, editing and soft deletion (blocked if the book is currently on loan)
- **Reviews and ratings**, available only after the return of the book has been confirmed

---

## General Architecture
 
BookLibre implements **polyglot persistence**: each type of data is stored in the technology that best fits its nature and access pattern.

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
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
             │ - Users     │   │ - Book      │   │ Sorted set   │
             │ - Reserv.   │   │   catalog   │   │ (click rank) │
             │ - Reviews   │   │   (polymor- │   │ JSON cache   │
             │ - Authors   │   │   phic)     │   │ (books/TTL)  │
             │             │   │ - Clicks    │   │              │
             └─────────────┘   └─────────────┘   └──────────────┘
```

**Design decisions:**
 
- **Books** are stored in MongoDB because of their semi-structured nature and their polymorphism (3 concrete subtypes with different behavior).
- **Reservations and users** are stored in PostgreSQL to guarantee referential integrity and transactional consistency.
- **Redis** works as a cache layer: the `bookClicks` sorted set makes it possible to serve the first page of the Home without a single query to MongoDB, and the per-book JSON cache reduces the latency of repeated searches.
- The **admin panel** aggregates data from the three sources through independent GraphQL resolvers, with schema stitching to OpenLibrary to enrich books by ISBN.

---

## Tech Stack
 
### Backend
 
| Technology | Version | Role |
|------------|---------|------|
| Kotlin | 1.9.25 | Main language |
| Spring Boot | 3.3.1 | Web framework and DI |
| Spring Data JPA / Hibernate | — | Relational persistence (PostgreSQL) |
| Spring Data MongoDB | — | Document persistence |
| Spring Security | — | Authentication and access control |
| Netflix DGS | 9.2.2 | GraphQL server |
| JJWT | 0.12.6 | JWT generation and validation |
| PostgreSQL | 18 | Relational database |
| MongoDB | Atlas | Document database |
| Redis | 7 | Cache (JSON) and ranking (sorted set) |
| Kotest + MockK | 5.8.0 | Testing framework |
| JaCoCo | — | Code coverage |
| Gradle (Kotlin DSL) | — | Build tool |
| Docker + Docker Compose | — | Local development environment |

### Frontend

| Technology | Version | Role |
|------------|---------|------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Static typing |
| Vite | 7 | Bundler and dev server |
| Tailwind CSS | v4 | Utility-first styling |
| React Router | v7 | Routing with role-based guards |
| Axios | — | HTTP client |
| Headless UI | — | Accessible base components |
| Motion | — | Animations |
| Vitest + Testing Library | — | Component testing |

---

## Backend — Highlights
 
### BiblioKarmas System (Gamification)
 
When a reservation is confirmed, the system calculates and credits BiblioKarmas to the reader according to the type of book, using the **Template Method** pattern:
 
| Book type | Formula |
|-----------|---------|
| `Common` | `pages × 5` if the reader has fewer than 1000 karmas, otherwise `pages × 2` |
| `WithADedication` | `200 + 10 × total number of reservations of the book` |
| `Collectable` | `ceil(reader's current karmas / 5) + pages` |
 
This creates a dynamic economy in which popular and collectable books are worth more, and readers with few karmas get a bonus that encourages them to keep growing.

### Polyglot Persistence
 
**MongoDB** stores the catalog using a polymorphic model. The `bookType` field acts as a discriminator to deserialize each document into the correct subtype. The model embeds the last two reviews and the reserved date ranges, which avoids joins in the detail view.
 
**PostgreSQL** guarantees integrity in the critical business relationships. It includes explicitly defined database components:
- **Functions**: books reserved by a user in the current year; users with more than N reservations
- **Trigger**: automatic auditing of changes in ratings (previous value → new value, timestamp)
- **View**: users with more than 2 reservations in `RETURNED` status
- **Constraint**: `bibliokarmas NOT NULL DEFAULT 0`
**Redis** works in two modes at the same time:
1. **Sorted set** `bookClicks`: every click on a book's detail page increases its score. The first page of the Home gets the top-10 IDs from the sorted set, looks up the books in the JSON cache and falls back to MongoDB only on a cache miss, which removes most queries from the hottest path.
2. **JSON cache** per `bookId` with TTL: it is updated on every search served from MongoDB, which spreads out the cost of complex queries.
### GraphQL API (Netflix DGS)
 
The control panel exposes 5 metrics through a GraphQL schema, each one with its own data source:
 
```graphql
type Query {
  conversionRate: [BookConversion!]!         # Top 5 by clicks (Redis) × reservations (Postgres)
  catalogHealth: CatalogHealth!              # 4 mutually exclusive catalog buckets
  calificactionAnalisis: [RatingAnalysis!]!  # Average rating by book type (MongoDB)
  recentActivity: [RecentActivityItem!]!     # Unified feed: recent sign-ups + reservations
  book(isbn: String!): BookGql               # Schema stitching with the OpenLibrary API
}
```
 
The `book(isbn)` resolver performs **schema stitching**: it enriches the data stored in MongoDB with metadata from the public OpenLibrary API, and falls back to the local `imageSrc` if the external response fails.
 
### Security
 
- Stateless JWT filter applied to all protected endpoints
- Access token: 15-minute lifetime
- Refresh token: 30-minute lifetime, stored in PostgreSQL and rotated on every use
- Role hierarchy: `ADMIN` > `COMBINED` > `PUBLISHER` / `READER`
- The admin panel endpoints explicitly require the `ADMIN` role
---
 
## Frontend — Highlights
 
### Routing and Role-Based Access Control
 
Routing is centralized in `AppRouter.tsx` and protected by layout wrappers that check the user's role before rendering a route. If the token expires, `AuthContext` detects it and automatically redirects the user to the login page.
 
| Layout guard | Allowed roles | Protected routes |
|---|---|---|
| `PrivateLayer` | Any authenticated user | Profile, LoanDetails, BookDetail (actions) |
| `PublisherLayer` | `PUBLISHER`, `COMBINED`, `ADMIN` | EditBook, CreateBook |
| `AdminLayer` | `ADMIN` | ControlPanel (dashboard) |
 
### State Management
 
- **`AuthContext`**: keeps the decoded JWT in memory and exposes the current user and the login/logout functions. It saves the access token in `localStorage` and renews the refresh token transparently.
- **`UserProfileContext`**: keeps the full profile of the active user (including up-to-date BiblioKarmas) and synchronizes it after every reservation or profile edit.
### Main Pages
 
| Page | Description |
|------|-------------|
| **Home** | Paginated catalog with combinable filters (genre, pages, dates, ISBN, owner) and sorting by popularity or alphabetical order. The first page is served from Redis. |
| **BookDetail** | Full book details, a calendar with blocked dates, a preview of the BiblioKarmas the user would earn, and the reservation form. |
| **Profile** | The user's profile with their published books (tabs: available / on loan / returned), paginated and sortable. |
| **LoanDetails** | Dual view: books I reserved vs. books I lent. It enables rating a book once it has been returned. |
| **EditBook / CreateBook** | Form for creating and editing books, with validations by type (`Common`, `WithADedication`, `Collectable`). |
| **ControlPanel** | Admin dashboard with 4 charts powered by real-time GraphQL queries. |
 
### GraphQL Consumption
 
The `graphqlService.ts` service builds the GraphQL queries and sends them to the backend's `/graphql` endpoint using `fetch`. Each dashboard metric has its own query typed in TypeScript, which ensures that the panel's data always matches the server schema.
 
---
 
## Local Setup and Execution
 
### Prerequisites
 
- JDK 21+
- Docker + Docker Compose
- Node.js 20+ and pnpm
### Backend
 
```bash
# 1. Start the databases (Postgres, pgAdmin, MongoDB, Redis, RedisInsight)
cd backend
docker-compose up -d
```
 
| Service | Local URL |
|----------|-----------|
| REST API | `http://localhost:8080` |
| pgAdmin | `http://localhost:5050` |
| RedisInsight | `http://localhost:5540` |
 
### Frontend
 
```bash
cd frontend
pnpm install
pnpm dev
# Available at http://localhost:5173
```
 
---
 
## Deployment
 
The application is deployed on **Render** with the following setup:
 
| Component | Service |
|------------|----------|
| Backend (Spring Boot) | Render Web Service (Docker) |
| Relational database | Render Postgres |
| Cache and ranking | Render Key Value (Redis) |
| Book catalog | MongoDB Atlas |
 
---
## 👩‍💻 Team Project
- Catalina Correa
- Nicolas Cernadas
- Dana Cossettini Reyes
- Maximiliano Andres Bianchimano
- Fernanda Perez
---
 
## 📫 Contact
 
**Dana Cossettini Reyes** -
📧 dana2004c.r@gmail.com
 
**Institution:** National University of San Martín (UNSAM) · **Year:** 2026
 

# ITELECT4 Veterinary Clinic Management System

A veterinary clinic management web application built with **React**, **TypeScript**, **Vite**, **TailwindCSS**, **TanStack Query**, **Zustand**, **React Hook Form**, **Zod**, and **Shadcn UI**.

---

## 🚀 Module 3 / Graded Task 3 (GT3) Completed Features

### Part 1: Routing & Protected Navigation
- **React Router v8** setup with multi-page navigation.
- Shared `<Layout />` layout with `<Outlet />` and persistent navigation.
- Dynamic route parameters (`/pets/:id`, `/vets/:id`).
- Role & login route guard via `<ProtectedRoute />` checking Zustand auth state.

### Part 2: State Management & HTTP Caching
- **Zustand Stores**:
  - `authStore` with `persist` middleware for preserving logged-in user state in `localStorage`.
  - `uiStore` for global search and client-side UI filter state.
- **TanStack Query (React Query)**:
  - Cached data fetching (`useQuery`) for pets, vets, and appointments.
  - Asynchronous mutation handling (`useMutation`) with query invalidation (`invalidateQueries`) on successful appointments creation.
- **REST API Backend**:
  - `json-server` running on port 3001 serving relational entities (`vets`, `pets`, `appointments`).

### Part 3: Advanced Forms, Zod Validation, & Shadcn UI
- **React Hook Form (`useForm`)**:
  - High-performance uncontrolled form handling with zero unnecessary re-renders.
  - Wired with `@hookform/resolvers/zod`.
  - Field-level validation feedback triggered `onBlur`.
  - Automatic form reset via `reset()` inside TanStack Query's `onSuccess`.
- **Zod Schema Validation (`src/schemas/appointmentSchema.ts`)**:
  - Validations for positive integer IDs, non-empty appointment notes (minimum 3 characters, max 200), and valid status enum.
  - Custom `.refine()` logic ensuring appointment notes do not consist solely of whitespace.
  - Derived static TypeScript form type generated via `z.infer<typeof appointmentSchema>`.
  - Gated submit handler (`handleSubmit`) ensuring invalid requests never leave the browser.
- **Shadcn UI Design System**:
  - `@/` module alias configured across `tsconfig.json`, `tsconfig.app.json`, and `vite.config.ts`.
  - Reusable components owned in `src/components/ui/` (`Button`, `Input`, `Label`) styled with CVA (`class-variance-authority`) and `tailwind-merge` (`cn`).
  - Seamless dark mode support using CSS theme tokens and `text-foreground`.
  - Integrated across `AppointmentsPage` and `LoginPage`.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Mock JSON Server (Terminal 1)
```bash
npm run api
```
Runs json-server on `http://localhost:3001`.

### 3. Start Development Server (Terminal 2)
```bash
npm run dev
```
Opens Vite dev server on `http://localhost:5173`.

### 4. Build and Type Check
```bash
npm run build
```
Ensures zero TypeScript and bundler errors.

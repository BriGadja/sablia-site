# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sablia is a modern business automation consulting website built with a React frontend and Express backend, using TypeScript throughout. The application features lead generation forms, ROI calculator, and service presentations.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Wouter (routing)
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **UI Components**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS + Tailwind Animate
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion + TSParticles

## Essential Commands

```bash
# Development
npm run dev              # Start development server (port 5000)

# Build & Production
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes to database

# Type Checking
npm run check           # Run TypeScript type checking
```

## Project Architecture

### Path Aliases
- `@/` → `client/src/`
- `@db` → `db/`
- `@db/*` → `db/*`

### Server Architecture
The Express server (port 5000) serves both API and client:
- Development: Vite dev server integration via `server/vite.ts`
- Production: Static file serving from `dist/public`
- API routes registered via `server/routes.ts`
- Request logging middleware for `/api` endpoints

### Client Architecture  
- **Routing**: Wouter-based SPA with pages in `client/src/pages/`
- **Components**: Reusable UI components in `client/src/components/`
- **State**: React Query for server state management
- **Forms**: React Hook Form with Zod schemas for validation
- **Toasts**: Persistent toast system using custom hooks

### Database
- Drizzle ORM with PostgreSQL
- Schema defined in `db/schema.ts`
- Connection via `DATABASE_URL` environment variable
- Migrations stored in `migrations/`

## Key Integrations

- **Voiceflow**: Chatbot integration for customer support
- **Calendly**: Appointment scheduling system
- **TSParticles**: Background animations

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

## Development Notes

- Server always runs on port 5000
- Client routing uses Wouter (not React Router)
- UI components follow shadcn/ui patterns with Radix UI primitives
- Form validation uses Zod schemas with React Hook Form
- All TypeScript with strict mode enabled
- ESM modules throughout (type: "module" in package.json)
# Overview

This is a modern full-stack web application for Sablia, an AI and automation consulting service. The application features a business automation consultancy website with ROI calculation tools, lead generation forms, and service presentations. The project is built as a monorepo with a React frontend, Express backend, and PostgreSQL database, focusing on showcasing automation solutions and converting visitors into leads.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 using TypeScript and modern tooling:
- **Framework**: React with Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system and Radix UI components
- **State Management**: React Query for server state management
- **Animations**: Framer Motion for smooth page transitions and micro-interactions
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **UI Components**: Comprehensive component library using Radix UI primitives with custom styling

## Backend Architecture
The backend follows a minimal Express.js API pattern:
- **Framework**: Express.js with TypeScript for type safety
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Hot reload with tsx for rapid development
- **Production Build**: ESBuild for fast bundling and deployment
- **Error Handling**: Centralized error handling middleware with structured responses

## Data Storage Solutions
Database architecture uses modern PostgreSQL with type-safe ORM:
- **Database**: PostgreSQL for reliable relational data storage
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Connection**: Serverless-compatible connection pooling with WebSocket support
- **Schema**: Strongly typed schema definitions with Zod integration for validation
- **Migrations**: Version-controlled database migrations in dedicated migrations folder

## Design System
The application implements a professional dark-themed design system:
- **Theme**: Professional dark mode with configurable color scheme
- **Typography**: Modern font stack with responsive sizing
- **Components**: Reusable component library with consistent styling patterns
- **Responsive**: Mobile-first responsive design with Tailwind breakpoints
- **Accessibility**: WCAG-compliant components with proper ARIA attributes

## Core Features
- **ROI Calculator**: Interactive tool for calculating automation return on investment
- **Lead Generation**: Multi-step form for capturing qualified prospects
- **Service Presentation**: Animated sections showcasing automation services
- **Interactive Elements**: FAQ accordions, service carousels, and animated CTAs

# External Dependencies

## Database Infrastructure
- **PostgreSQL**: Primary database with environment-based connection via DATABASE_URL
- **Neon/Supabase Compatible**: Serverless PostgreSQL hosting support

## Third-Party Integrations
- **Voiceflow Chatbot**: Embedded customer support chatbot with project ID configuration
- **Calendly**: Appointment scheduling integration for lead conversion
- **Particles.js**: Background particle animations for visual enhancement

## Development Tools
- **TSParticles**: Lightweight particle system for background animations
- **Lucide React**: Consistent icon library for UI elements
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Type-safe CSS class composition

## Build and Deployment
- **Vite**: Frontend build tool with React plugin and theme support
- **ESBuild**: Backend bundling for production deployment
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **TypeScript**: Full-stack type safety with path mapping and strict configuration

## UI and Animation Libraries
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Framer Motion**: Production-ready motion library for React
- **Embla Carousel**: Touch-friendly carousel component for service showcases
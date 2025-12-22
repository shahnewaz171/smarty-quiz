# Smarty Quiz - Client

Frontend application for Smarty Quiz built with React 19, TypeScript, and Vite.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router v7** - Client-side routing
- **TanStack Query** - Server state management
- **Material-UI** - Component library
- **Tailwind CSS** - Utility-first styling
- **React Hook Form + Zod** - Form handling and validation
- **Better Auth** - Authentication

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev  # Start dev server (port 5173)
```

### Build

```bash
pnpm build    # Production build
pnpm preview  # Preview build
```

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── form/          # Form components (Input, etc.)
│   │   ├── icons/         # Icon components
│   │   ├── loader/        # Loading states
│   │   └── ui/            # UI primitives (Button, Modal, etc.)
│   │
│   ├── features/          # Feature modules
│   │   ├── admin/         # Admin dashboard
│   │   ├── api/           # API client functions
│   │   ├── authentication/# Login, Register, etc.
│   │   ├── quiz/          # Quiz taking features
│   │   └── shared/        # Shared feature components
│   │
│   ├── layouts/           # Page layouts
│   │   ├── admin/         # Admin layout
│   │   └── user/          # User layout
│   │
│   ├── lib/               # Third-party library configs
│   │   ├── auth/          # Better Auth setup
│   │   ├── fetch/         # Fetch client
│   │   ├── router/        # React Router config
│   │   └── tanstack-query/# Query client config
│   │
│   ├── pages/             # Route pages
│   │   ├── admin/         # Admin pages
│   │   └── quiz/          # User quiz pages
│   │
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Context/state management
│   ├── types/             # TypeScript types
│   └── utils/             # Helper utilities
│
├── public/                # Static assets
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies
```

## API Integration

The client communicates with the backend API via:

- **Base URL**: Configured via `VITE_API_BASE_URL` (default: proxied to `http://localhost:4001`)
- **Fetch Client**: Located at [src/lib/fetch/client.ts](src/lib/fetch/client.ts)
- **API Functions**: Located in [src/features/api/](src/features/api/)

### Key API Modules

- `admin.ts` - Admin endpoints
- `quiz.ts` - Quiz endpoints

## Styling

The project uses a combination of:

- **Material-UI** - Pre-built components with theming
- **Tailwind CSS** - Utility classes for custom styling
- **Emotion** - CSS-in-JS (via MUI)

Configuration:

- Tailwind: [tailwind.config.ts](tailwind.config.ts)
- Theme: [src/lib/theme/index.ts](src/lib/theme/index.ts)

## Authentication

Authentication is handled by Better Auth:

- **Client Setup**: [src/lib/auth/better-auth/client.ts](src/lib/auth/better-auth/client.ts)
- **Auth Components**: [src/features/authentication/](src/features/authentication/)
- **Session Management**: Automatic with Better Auth React hooks

## Routing

Routes are configured using React Router v7:

- **Router Setup**: [src/lib/router/index.tsx](src/lib/router/index.tsx)
- **Lazy Routes**: [src/lib/router/lazy-routes.ts](src/lib/router/lazy-routes.ts)

### Main Routes

- `/` - Home
- `/login` - Login page
- `/register` - Register page
- `/quizzes` - Quiz list
- `/quiz/:id` - Take quiz
- `/admin/*` - Admin routes (protected)

## Deployment

Builds to `dist/` directory. Supports deployment to Vercel.

## Dependencies

### Core

- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router` - Routing

### State & Data

- `@tanstack/react-query` - Server state management
- `better-auth` - Authentication

### UI & Styling

- `@mui/material` - Material UI components
- `@mui/x-charts` - Charts library
- `tailwindcss` - Utility CSS framework

### Forms

- `react-hook-form` - Form handling
- `zod` - Schema validation

### Dev Tools

- `vite` - Build tool
- `typescript` - Type checking
- `eslint` - Linting
- `prettier` - Code formatting

## License

MIT

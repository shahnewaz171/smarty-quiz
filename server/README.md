# Smarty Quiz - Server

Backend API for Smarty Quiz built with Express, PostgreSQL, and TypeScript.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Better Auth** - Authentication system
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
pnpm install
```

### Database Setup

```bash
creatdb smarty_quizz
cp .env.example .env
# Configure .env with your database credentials
pnpm db:push
```

### Commands

```bash
pnpm dev       # Development server
pnpm build     # Build for production
pnpm start     # Production server
pnpm db:push   # Push schema to database
pnpm db:studio # Database GUI
```

## Project Structure

```
server/
├── src/
│   ├── db/                    # Database
│   │   ├── schema.ts          # Database schema
│   │   ├── relations.ts       # Table relations
│   │   ├── index.ts           # DB client
│   │   └── migrations/        # SQL migrations
│   │
│   ├── routes/                # API routes
│   │   ├── admin.ts           # Admin endpoints
│   │   ├── quiz.ts            # Quiz endpoints
│   │   └── oauth.ts           # OAuth endpoints
│   │
│   ├── middleware/            # Express middleware
│   │   └── auth.ts            # Auth middleware
│   │
│   ├── services/              # Business logic
│   │   └── email.ts           # Email service
│   │
│   ├── types/                 # TypeScript types
│   │   ├── express.d.ts       # Express type extensions
│   │   └── index.ts           # Shared types
│   │
│   ├── utils/                 # Utilities
│   │   └── env.ts             # Environment config
│   │
│   ├── auth.ts                # Better Auth config
│   └── index.ts               # Server entry point
│
├── drizzle.config.ts          # Drizzle configuration
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

## Database

### Schema

The database uses the following main tables:

- **users** - User accounts and authentication
- **session** - User sessions
- **account** - OAuth accounts
- **verification** - Email verification tokens
- **quiz** - Quiz metadata
- **question** - Quiz questions and answers
- **quiz_attempt** - User quiz attempts and scores

Schema is defined in [src/db/schema.ts](src/db/schema.ts)

## API Endpoints

### Authentication (`/api/auth/*`)

Handled by Better Auth:

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Quizzes (`/api/quizzes`)

**Protected routes (requires authentication)**

- `GET /api/quizzes` - List published quizzes
  - Query params: `category`, `difficulty`, `isPublished`
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes/:id/submit` - Submit quiz answers
  - Body: `{ answers: { questionId: string, answer: string }[] }`
- `GET /api/quizzes/attempts/user/:userId` - Get user's quiz history
- `GET /api/quizzes/attempt/:attemptId` - Get specific attempt details

### Admin (`/api/admin`)

**Protected routes (requires admin role)**

#### Statistics

- `GET /api/admin/statistics` - Dashboard overview
  - Returns: total users, quizzes, attempts, avg score
- `GET /api/admin/statistics/users` - User statistics
  - Returns: user growth, activity trends
- `GET /api/admin/statistics/quizzes` - Quiz statistics
  - Returns: quiz performance, completion rates

#### Quiz Management

- `GET /api/admin/quizzes` - List all quizzes (including unpublished)
  - Query params: `category`, `difficulty`, `isPublished`
- `POST /api/admin/quizzes` - Create new quiz
  - Body: Quiz object with questions
- `PUT /api/admin/quizzes/:id` - Update quiz
  - Body: Updated quiz object
- `DELETE /api/admin/quizzes/:id` - Delete quiz
- `PATCH /api/admin/quizzes/:id/publish` - Toggle publish status
  - Body: `{ isPublished: boolean }`

#### User Management

- `GET /api/admin/users` - List all users
  - Query params: `role`, `search`

### OAuth (`/api/oauth`)

Development endpoints for OAuth setup:

- `GET /api/oauth/gmail/authorize` - Gmail OAuth flow
- `GET /api/oauth/callback` - OAuth callback handler

## Authentication

Authentication is powered by Better Auth with the following features:

- **Email/Password** - Standard authentication
- **Session Management** - Secure session handling
- **Password Reset** - Email-based password recovery
- **Role-Based Access** - User and Admin roles

Configuration: [src/auth.ts](src/auth.ts)

### Middleware

- `requireAuth` - Ensures user is authenticated
- `requireAdmin` - Ensures user has admin role

Located in [src/middleware/auth.ts](src/middleware/auth.ts)

## Email Service

Optional email functionality for password reset. Configure via environment variables or see `EMAIL_SETUP.md`.

## Configuration

### Environment Variables

All environment variables are validated and typed via [src/utils/env.ts](src/utils/env.ts)

Required variables:

- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database connection
- `BETTER_AUTH_SECRET` - Auth secret (min 32 chars)
- `BETTER_AUTH_URL` - Server URL
- `PORT` - Server port (default: 4001)
- `CLIENT_APP_URL` - Frontend URL (for CORS)

Optional variables:

- `EMAIL_FROM`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` - Email config
- `NODE_ENV` - Environment (development/production)

## Dependencies

**Core:** Express, TypeScript, PostgreSQL, Drizzle ORM, Better Auth

See [package.json](package.json) for complete list.

## Deployment

### Heroku

1. Create a Heroku app and add PostgreSQL addon
2. Set environment variables in Heroku dashboard
3. Deploy:
   ```bash
   git push heroku master
   ```
4. Run migrations:
   ```bash
   heroku run pnpm db:push
   ```

## License

MIT

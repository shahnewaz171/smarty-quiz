# Smarty Quiz

A full-stack quiz application built with React and Express. Users can take quizzes, and admins can create and manage them.

## Architecture

The project has two separate parts:

- **Client** (React + Vite) - runs on port `5173`
- **Server** (Express + PostgreSQL) - runs on port `4001`
- Each part has its own dependencies

## Getting Started

### What You Need

- Node.js 18 or higher
- pnpm package manager
- PostgreSQL 14 or higher

### 1. Install Client

```bash
pnpm install
```

### 2. Setup Server

```bash
cd server
pnpm install
cp .env.example .env
```

Edit `server/.env` with your database credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/smarty_quizz
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:4001
PORT=4001
```

### 3. Create Database

```bash
creatdb smarty_quizz
cd server
pnpm db:push
```

### 4. Run the App

**Terminal 1 - Server:**

```bash
cd server
pnpm dev
```

**Terminal 2 - Client:**

```bash
pnpm dev
```

### 5. Access Application

- Frontend: http://localhost:5173
- API: http://localhost:4001
- Health Check: http://localhost:4001/health

## Tech Stack

### Client

- React 19 with TypeScript
- Vite for fast development
- TanStack Query for data fetching
- React Router for navigation
- Material-UI + Tailwind CSS for styling
- React Hook Form + Zod for forms

### Server

- Express with TypeScript
- PostgreSQL database
- Drizzle ORM
- Better Auth for authentication

## Project Structure

```
smarty-quiz/
├── src/                    # Client app
│   ├── components/         # Reusable components
│   ├── features/          # Feature modules
│   ├── layouts/           # Page layouts
│   ├── lib/               # Libraries and configs
│   ├── pages/             # Route pages
│   └── types/             # TypeScript types
│
├── server/                # Backend API
│   ├── src/
│   │   ├── db/           # Database config and schema
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth middleware
│   │   ├── services/     # Email and other services
│   │   ├── auth.ts       # Auth configuration
│   │   └── index.ts      # Server entry
│   └── package.json      # Server dependencies
│
└── package.json           # Client dependencies
```

## Commands

### Client (root folder)

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Check code
pnpm format       # Format code
```

### Server (server folder)

```bash
pnpm dev          # Start server
pnpm build        # Build TypeScript
pnpm start        # Run production
pnpm db:push      # Update database
pnpm db:studio    # Open database GUI
```

## Database

The app uses these main tables:

- `user` - User accounts
- `session` - Login sessions
- `quiz` - Quiz details
- `question` - Quiz questions
- `quiz_attempt` - User quiz results

## API Endpoints

### Authentication

- `POST /api/auth/sign-up` - Register
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Current session

### Quizzes

- `GET /api/quizzes` - List quizzes
- `GET /api/quizzes/:id` - Quiz details
- `POST /api/quizzes/:id/submit` - Submit answers
- `GET /api/quizzes/attempts/user/:userId` - User attempts
- `GET /api/quizzes/attempt/:attemptId` - Attempt details

### Admin

- `GET /api/admin/statistics` - Dashboard stats
- `GET /api/admin/statistics/users` - User stats
- `GET /api/admin/statistics/quizzes` - Quiz stats
- `GET /api/admin/quizzes` - All quizzes
- `POST /api/admin/quizzes` - Create quiz
- `PUT /api/admin/quizzes/:id` - Update quiz
- `DELETE /api/admin/quizzes/:id` - Delete quiz
- `PATCH /api/admin/quizzes/:id/publish` - Publish/unpublish
- `GET /api/admin/users` - All users

## Development

### Database GUI

View your database:

```bash
cd server
pnpm db:studio
```

### Update Database Schema

1. Edit `server/src/db/schema.ts`
2. Run `cd server && pnpm db:push`

### Environment Variables

**Server** (`server/.env`):

```env
PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=quiz_builder

BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:4001
CLIENT_APP_URL=http://localhost:5173

PORT=4001
NODE_ENV=development
```

**Client** (`.env` - optional):

```env
VITE_API_BASE_URL=http://localhost:4001
```

## Features

- User authentication with sessions
- Role-based access (user/admin)
- Create and manage quizzes
- Take quizzes with timer
- View results and history
- Admin dashboard with statistics
- Type-safe API and database

## Deployment

### Client

1. Build: `pnpm build`
2. Deploy the `dist/` folder
3. Set `VITE_API_BASE_URL` env variable

### Server

1. Deploy the `server/` directory
2. Set environment variables
3. Run database migration: `pnpm db:push`

## License

MIT

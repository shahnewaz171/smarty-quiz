# Smarty Quiz

A modern full-stack quiz application with role-based access control. Users can take quizzes and track their progress, while admins can create and manage quiz content.

## Project Structure

```
smarty-quiz/
├── client/          # React frontend (Port: 5173)
├── server/          # Express backend (Port: 4001)
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL 14+

### Setup

1. **Database**
   ```bash
   createdb smarty_quizz
   ```

2. **Server**
   ```bash
   cd server
   pnpm install
   cp .env.example .env
   # Edit .env with your credentials
   pnpm db:push
   pnpm dev
   ```

3. **Client**
   ```bash
   cd client
   pnpm install
   pnpm dev
   ```

4. **Access**
   - Frontend: http://localhost:5173
   - API: http://localhost:4001

## Tech Stack

**Client:** React 19, TypeScript, Vite, Material-UI, Tailwind CSS, React Router, TanStack Query

**Server:** Express, TypeScript, PostgreSQL, Drizzle ORM, Better Auth

## Features

- User authentication & authorization
- Quiz creation & management (Admin)
- Timed quiz taking
- Results & history tracking
- Admin dashboard with statistics

## Documentation

- **[Client Documentation](client/README.md)** - Frontend details
- **[Server Documentation](server/README.md)** - API & backend details
- **[Setup Guide](SERVER_SETUP.md)** - Detailed setup instructions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Author

**Shahnewaz**

- GitHub: [@shahnewaz171](https://github.com/shahnewaz171)

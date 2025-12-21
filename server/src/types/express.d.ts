import { Session, User } from 'better-auth';

declare global {
  namespace Express {
    interface Request {
      user?: User & { role?: string[] | string };
      session?: Session & { user: User };
    }
  }
}

export {};

import { Request, Response, NextFunction } from 'express';
import { auth } from '../auth';

type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type SessionUser = NonNullable<SessionResult>['user'];
type SessionData = NonNullable<SessionResult>['session'];

interface AuthRequest extends Omit<Request, 'user' | 'session'> {
  user?: SessionUser;
  session?: SessionData;
}

// authentication middleware
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const authReq = req as AuthRequest;
    authReq.user = session.user;
    authReq.session = session.session;

    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid session' });
  }
}

// admin role check
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }

    const authReq = req as AuthRequest;
    authReq.user = session.user;
    authReq.session = session.session;

    const user = authReq.user as Record<string, unknown>;
    const userRole = user?.role as string[] | string | undefined;

    if (!userRole) {
      return res.status(403).json({ error: 'Forbidden - No role assigned' });
    }

    const roles = Array.isArray(userRole) ? userRole : [userRole];

    if (!roles.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    return next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(403).json({ error: 'Forbidden - Authorization failed' });
  }
}

import type { Request, Response, NextFunction } from 'express';
import type { AppContext, AuthContextTenant } from '@/libs/context/index.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const requireTenantAuth = async (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction,
): Promise<void> => {
  const context = (req as Request & { context?: AppContext }).context;

  if (!context?.auth?.isAuthenticated) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (context.auth.tenantResolved) {
    next();
    return;
  }

  const { firebaseUid, isImpersonating } = context.auth;

  try {
    const user = await context.repositories.users.getByFirebaseUid(firebaseUid);

    if (!user || user.deletedAt) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const baseAuth = {
      isAuthenticated: true as const,
      tenantResolved: true as const,
      firebaseUid,
      dbUserId: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    const enrichedAuth: AuthContextTenant = isImpersonating
      ? { ...baseAuth, isImpersonating: true as const, impersonatorUserId: context.auth.impersonatorUserId }
      : { ...baseAuth, isImpersonating: false as const };

    (req as Request & { context: AppContext }).context = {
      ...context,
      auth: enrichedAuth,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ message: error.message });
      return;
    }
    next(error);
  }
};

import type { Request, Response, NextFunction } from 'express';
import type { AppContext } from '@/libs/context/index.js';

export const requireAuth = (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction,
): void => {
  const context = (req as Request & { context?: AppContext }).context;
  if (!context?.auth?.isAuthenticated) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  next();
};

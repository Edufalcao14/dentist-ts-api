import type { Request, Response, NextFunction } from 'express';

const serializeBigInt = (value: unknown): unknown => {
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map(serializeBigInt);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, serializeBigInt(v)]),
    );
  }
  return value;
};

export const bigIntSerializer = (_req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    return originalJson(serializeBigInt(body));
  };
  next();
};

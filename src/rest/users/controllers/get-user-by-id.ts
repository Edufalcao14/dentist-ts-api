import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { UserDto } from '../dtos/user.dto.js';
import { toDto } from '../mappers/user.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initGetUserByIdController = (usecases: Usecases) => {
  return async (
    req: Request<{ id: string }> & { context: Context },
    res: Response<UserDto | { message: string }>,
  ) => {
    try {
      const user = await usecases.user.getById(req.context, BigInt(req.params.id));
      res.json(toDto(user));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};

import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { UserDto } from '../dtos/user.dto.js';
import { toDto } from '../mappers/user.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initGetAllUsersController = (usecases: Usecases) => {
  return async (
    req: Request & { context: Context },
    res: Response<UserDto[] | { message: string }>,
  ) => {
    try {
      const users = await usecases.user.getAll(req.context);
      res.json(users.map(toDto));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};

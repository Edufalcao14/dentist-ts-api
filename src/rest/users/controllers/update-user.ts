import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { UserDto } from '../dtos/user.dto.js';
import type { UpdateUserDto } from '../dtos/update-user.dto.js';
import { toDto } from '../mappers/user.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initUpdateUserController = (usecases: Usecases) => {
  return async (
    req: Request<{ id: string }, UserDto, UpdateUserDto> & { context: Context },
    res: Response<UserDto | { message: string }>,
  ) => {
    try {
      const user = await usecases.user.update(req.context, {
        id: BigInt(req.params.id),
        role: req.body.role,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone ?? undefined,
        birthdate: req.body.birthdate ? new Date(req.body.birthdate) : undefined,
        cpf: req.body.cpf ?? undefined,
      });
      res.json(toDto(user));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};

import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { UserDto } from '../dtos/user.dto.js';
import type { CreateUserDto } from '../dtos/create-user.dto.js';
import { toDto } from '../mappers/user.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initCreateUserController = (usecases: Usecases) => {
  return async (
    req: Request<Record<string, string>, UserDto, CreateUserDto> & { context: Context },
    res: Response<UserDto | { message: string }>,
  ) => {
    try {
      if (!req.context.auth.isAuthenticated || !req.context.auth.tenantResolved) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const user = await usecases.user.create(req.context, {
        tenantId: req.context.auth.tenantId,
        firebaseUid: '',
        role: req.body.role,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        birthdate: req.body.birthdate ? new Date(req.body.birthdate) : undefined,
        cpf: req.body.cpf,
      });
      res.status(201).json(toDto(user));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};

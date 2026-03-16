import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext as Context } from '@/libs/context/index.js';
import type { TenantDto } from '../dtos/tenant.dto.js';
import type { CreateTenantDto } from '../dtos/create-tenant.dto.js';
import { toDto } from '../mappers/tenant.mapper.js';
import { BusinessError } from '@/entities/errors/business-error.js';

export const initCreateTenantController = (usecases: Usecases) => {
  return async (
    req: Request<Record<string, string>, TenantDto, CreateTenantDto> & { context: Context },
    res: Response<TenantDto | { message: string }>,
  ) => {
    try {
      const tenant = await usecases.tenant.create(req.context, req.body);
      res.status(201).json(toDto(tenant));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = error instanceof BusinessError ? error.status : 500;
      res.status(status).json({ message });
    }
  };
};

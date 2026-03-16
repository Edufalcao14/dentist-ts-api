import type { AppContext, AuthContext, Gateways } from './index.js';
import type { Repositories } from '@/repositories/index.js';
import { config } from '@/libs/config/index.js';
import { initLogger } from '@/libs/loggers/index.js';
import { initRepositories } from '@/repositories/index.js';
import { prisma } from '@/repositories/database/prisma.js';
import { initGateways } from '@/libs/gateway/index.js';

export interface BaseContext {
  config: AppContext['config'];
  logger: AppContext['logger'];
  gateways: Gateways;
  repositories: Repositories;
}

export const createBaseContext = async (): Promise<BaseContext> => {
  const logger = await initLogger(config);
  const gateways = initGateways(config, logger);
  const repositories = initRepositories(prisma);

  return {
    config,
    logger,
    gateways,
    repositories,
  };
};

export const createRequestContext = (
  baseContext: BaseContext,
  auth?: Partial<AuthContext>
): AppContext => {
  let authContext: AuthContext;

  if (auth?.isAuthenticated && (auth as { firebaseUid?: string }).firebaseUid) {
    const partial = auth as { firebaseUid: string; isImpersonating?: boolean; impersonatorUserId?: string };
    if (partial.isImpersonating && partial.impersonatorUserId) {
      authContext = {
        isAuthenticated: true,
        tenantResolved: false,
        firebaseUid: partial.firebaseUid,
        isImpersonating: true,
        impersonatorUserId: partial.impersonatorUserId,
      };
    } else {
      authContext = {
        isAuthenticated: true,
        tenantResolved: false,
        firebaseUid: partial.firebaseUid,
        isImpersonating: false,
      };
    }
  } else {
    authContext = {
      isAuthenticated: false,
    };
  }

  return {
    ...baseContext,
    auth: authContext,
    repositories: baseContext.repositories,
  };
};

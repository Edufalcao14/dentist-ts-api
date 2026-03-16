import type { Config } from '@/libs/config/index.js';
import type { Logger } from '@/libs/loggers/index.js';
import type { Repositories } from '@/repositories/index.js';
import type { Gateways } from '@/libs/gateway/index.js';

export type { Gateways } from '@/libs/gateway/index.js';

export type AppContext = {
  config: Config;
  logger: Logger;
  repositories: Repositories;
  gateways: Gateways;
  auth: AuthContext;
};

type AuthContextUnauthenticated = {
  isAuthenticated: false;
};

// Set by auth.middleware — Firebase JWT verified, uid extracted
type AuthContextFirebase = {
  isAuthenticated: true;
  tenantResolved: false;
  firebaseUid: string;
} & (AuthContextImpersonating | AuthContextNotImpersonating);

// Set by requireTenantAuth middleware — DB user resolved, tenant context enriched
export type AuthContextTenant = {
  isAuthenticated: true;
  tenantResolved: true;
  firebaseUid: string;
  dbUserId: bigint;
  tenantId: bigint;
  role: string;
} & (AuthContextImpersonating | AuthContextNotImpersonating);

type AuthContextImpersonating = {
  isImpersonating: true;
  impersonatorUserId: string;
};

type AuthContextNotImpersonating = {
  isImpersonating: false;
};

export type AuthContext =
  | AuthContextUnauthenticated
  | AuthContextFirebase
  | AuthContextTenant;

// Re-export create-context functions
export { createBaseContext, createRequestContext } from './create-context.js';
export type { BaseContext } from './create-context.js';

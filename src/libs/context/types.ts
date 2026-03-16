// Re-export types for backward compatibility during migration
export type { AppContext, AuthContext, Gateways } from './index.js';
export type { Config } from '@/libs/config/index.js';
export type { Logger } from '@/libs/loggers/index.js';

// Export AppContext as Context for backward compatibility
export type { AppContext as Context } from './index.js';

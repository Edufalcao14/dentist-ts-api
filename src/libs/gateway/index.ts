import type { Config } from '@/libs/config/index.js';
import type { Logger } from '@/libs/loggers/index.js';
import { initIAMGateway } from './iam/iam-gateway.js';
import { initCloudinaryGateway } from './media/cloudinary.gateway.js';

export const initGateways = (config: Config, logger: Logger) => {
  return {
    iam: initIAMGateway(config, logger),
    media: initCloudinaryGateway(config),
  };
};

export type Gateways = ReturnType<typeof initGateways>;

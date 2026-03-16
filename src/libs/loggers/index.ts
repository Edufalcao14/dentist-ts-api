import type { Config } from '@/libs/config/index.js';


export interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

export const initLogger = async (config: Config): Promise<Logger> => {
  // For now, use a simple console logger
  // Can be extended later to use bunyan or other logging libraries
  if (config.env === 'prod') {
    // When running in production, you can integrate with cloud logging here
    // For example: Google Cloud Logging, AWS CloudWatch, etc.
    return {
      info: (message: string, ...args: unknown[]) => {
        console.log(`[INFO] ${message}`, ...args);
      },
      error: (message: string, ...args: unknown[]) => {
        console.error(`[ERROR] ${message}`, ...args);
      },
      warn: (message: string, ...args: unknown[]) => {
        console.warn(`[WARN] ${message}`, ...args);
      },
      debug: (message: string, ...args: unknown[]) => {
        console.debug(`[DEBUG] ${message}`, ...args);
      },
    };
  }

  // Development logger
  return {
    info: (message: string, ...args: unknown[]) => {
      console.log(`[INFO] ${message}`, ...args);
    },
    error: (message: string, ...args: unknown[]) => {
      console.error(`[ERROR] ${message}`, ...args);
    },
    warn: (message: string, ...args: unknown[]) => {
      console.warn(`[WARN] ${message}`, ...args);
    },
    debug: (message: string, ...args: unknown[]) => {
      console.debug(`[DEBUG] ${message}`, ...args);
    },
  };
};

export type InitLogger = Awaited<ReturnType<typeof initLogger>>;


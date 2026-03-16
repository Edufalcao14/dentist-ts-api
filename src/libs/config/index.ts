import * as dotenv from 'dotenv';

dotenv.config();

export type AppEnv = 'prod' | 'dev' | 'qa';

function normalizeEnv(value: string | undefined): AppEnv {
  const v = (value ?? '').toLowerCase();
  if (v === 'prod' || v === 'production') return 'prod';
  if (v === 'dev' || v === 'development') return 'dev';
  if (v === 'qa') return 'qa';
  return 'dev';
}

const rawEnv = process.env.APP_ENV ?? process.env.NODE_ENV;
const env = normalizeEnv(rawEnv);

export const config = {
  env,
  isProduction: env === 'prod',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  corsAllowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
    : [] as string[],
  apiRateLimitMax: process.env.API_RATE_LIMIT_MAX
    ? parseInt(process.env.API_RATE_LIMIT_MAX, 10)
    : 100,
  database: {
    url: process.env.DATABASE_URL,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    credentials: {
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
      privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(
        /\\n/g,
        '\n',
      ),
    },
    client: {
      apiKey: process.env.FIREBASE_CLIENT_API_KEY ?? '',
      authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? '',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
      appId: process.env.FIREBASE_APP_ID ?? '',
    },
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
} as const;

export type Config = typeof config;


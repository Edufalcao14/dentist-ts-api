import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { createBaseContext } from '@/libs/context/index.js';
import { createRestRoutes } from '@/rest/routes.js';
import { generateOpenApiDocument } from '@/openapi/openapi.js';
import { config } from '@/libs/config/index.js';

const app = express();
const PORT = config.port;

app.use(helmet());

const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (config.isProduction) {
        const allowed = config.corsAllowedOrigins.includes(origin);
        callback(null, allowed);
      } else {
        const localhostOk = localhostOriginPattern.test(origin);
        const inWhitelist = config.corsAllowedOrigins.length > 0 && config.corsAllowedOrigins.includes(origin);
        callback(null, localhostOk || inWhitelist);
      }
    },
    credentials: true,
  }),
);

// JSON body size limit (reduced for security; increase on specific routes if needed for large payloads)
app.use(express.json({ limit: '1mb' }));

// Global API rate limit - 100 requests per 15 minutes per IP (configurable via API_RATE_LIMIT_MAX)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.apiRateLimitMax,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Initialize app
(async () => {
  // Create base context (shared across requests)
  const baseContext = await createBaseContext();

  // REST API Routes with context middleware (rate-limited)
  const restRouter = createRestRoutes(baseContext);
  app.use('/api', apiLimiter, restRouter);

  // OpenAPI Documentation (non-production only)
  if (!config.isProduction) {
    const openApiDocument = generateOpenApiDocument();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
    app.get('/openapi.json', (req, res) => {
      res.json(openApiDocument);
    });
  }

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server started on http://0.0.0.0:${PORT}`);
    if (!config.isProduction) {
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`📄 OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
    }
  });
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  process.exit(0);
});
# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

################################################################################

# Base stage for all subsequent stages, with Node.js and working directory set up.

FROM node:${NODE_VERSION}-alpine AS base

# Prisma requires OpenSSL on Alpine (3.17+ uses OpenSSL 3.x)
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

################################################################################

# Dependencies stage for installing production dependencies.

# This stage is only relevant for preparing the production build.

FROM base as deps

# Install production dependencies only.

COPY package.json package-lock.json ./

# --ignore-scripts: skip "prepare" (husky) - not needed in Docker, husky is devDep
RUN npm ci --omit=dev --ignore-scripts

################################################################################

# Build stage for compiling the application.

FROM base as build

# Install all dependencies (including dev) for the build process.

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Generate Prisma Client before building

RUN npx prisma generate

RUN npm run build

# Copy OpenAPI YAML to dist (not compiled by tsc, but needed at runtime)
COPY src/docs ./dist/docs

################################################################################

# Development stage for setting up a local development environment.

FROM base as development

# Install all dependencies (including dev).

# This ensures that development dependencies are available for this stage.

COPY package.json package-lock.json ./

RUN npm install

# Copy all source files into the image.

COPY . .

# Generate Prisma Client at build time (engines baked in, no runtime write needed)
RUN npx prisma generate

# Copy and set up entrypoint script

COPY docker-entrypoint.sh /usr/local/bin/

# Convert Windows line endings to Unix and make executable
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the port for the development server.

EXPOSE 3001

# Use entrypoint to run migrations before starting the app

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Command to start the development server.

CMD ["npm", "run", "dev"]

################################################################################

# Final stage for running the application with minimal runtime dependencies.

FROM base as final

ENV NODE_ENV=production

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Install Prisma CLI for migrations (needed even in production)
RUN npm install -g prisma

# Copy all files FIRST (as root), then fix ownership
COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

# Copy pre-generated Prisma client and engine binaries from build stage
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Ensure node user can write to node_modules (needed for prisma generate at startup)
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3001

# Use entrypoint to run migrations before starting the app

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["npm", "start"]

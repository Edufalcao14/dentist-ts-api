# Backend API

This project follows the onion architecture pattern with a REST API.

## Prerequisites

- Docker and Docker Compose
- (Optional) Node.js (v18 or higher) and npm if running locally

## Getting Started with Docker (Recommended)

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure your settings if needed. Default values work for local development.

### 2. Start the Entire Application

Start both the database and application using Docker Compose:

```bash
npm run docker:up
```

Or directly:

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database container
- Build and start the application container
- Automatically generate Prisma Client
- Run database migrations
- Start the development server with hot reload

The application will be available at `http://localhost:3001` (or the PORT specified in `.env`).

### 3. View Logs

```bash
# View all logs
npm run docker:logs

# View only app logs
npm run docker:logs:app

# View only database logs
npm run docker:logs:db
```

### 4. Stop the Application

```bash
npm run docker:down
```

## Local Development (Without Docker)

If you prefer to run locally:

### 1. Start Database Only

```bash
npm run docker:up
# This will only start the postgres service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Database Migrations

```bash
npm run prisma:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

## Docker Commands

- `npm run docker:up` - Start all services (database + app)
- `npm run docker:down` - Stop all services
- `npm run docker:build` - Rebuild the application container
- `npm run docker:logs` - View all logs
- `npm run docker:logs:app` - View application logs only
- `npm run docker:logs:db` - View database logs only
- `npm run docker:restart` - Restart all services

## Project Structure

```
src/
├── entities/          # Business entities
├── repositories/      # Database access layer
│   └── database/      # Database connection
├── usecases/          # Business logic
├── rest/              # REST API layer
│   ├── controllers/   # Request handlers
│   ├── dtos/          # Data Transfer Objects
│   ├── mappers/       # Entity to DTO mappers
│   └── routes.ts      # Route definitions
└── libs/              # Shared libraries
    └── context/       # Application context

```

## API Documentation

Once the server is running, you can access:

- Swagger UI: `http://localhost:3001/api-docs`
- OpenAPI JSON: `http://localhost:3001/openapi.json`

## Database

The database is managed using Prisma:

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Generated Client: `generated/prisma/`

# Backend-starter
# dentist-ts-api
# dentist-ts-api

# Architecture Documentation

This document describes the architecture of this **backend starter**: a generic API template built with **Onion Architecture**.

**Audience:** Developers using this starter to build a new backend—whether to learn the structure, add features, or adapt it to a specific domain. The guide explains all layers, their responsibilities, and how they interact.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Layer Structure](#layer-structure)
3. [Domain Layer (Core)](#domain-layer-core)
4. [Repository Layer (Infrastructure)](#repository-layer-infrastructure)
5. [Use Case Layer (Application)](#use-case-layer-application)
6. [REST Layer (Infrastructure - Presentation)](#rest-layer-infrastructure---presentation)
7. [Data Flow](#data-flow)
8. [Adding New Features](#adding-new-features)
9. [Key Patterns](#key-patterns)
10. [Best Practices](#best-practices)
11. [Summary](#summary)
12. [Appendix: Common Mistakes to Avoid](#appendix-common-mistakes-to-avoid)

---

## Architecture Overview

This backend starter follows the **Onion Architecture** pattern (also known as Ports and Adapters or Hexagonal Architecture) with clear separation of concerns organized in concentric circles, where dependencies flow inward toward the domain core:

```
┌───────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Presentation Layer (REST)                  │  │
│  │         (Controllers, Routes, DTOs, Mappers)            │  │
│  └─────────────────────────┬───────────────────────────────┘  │
│                            │                                  │
│  ┌─────────────────────────▼───────────────────────────────┐  │
│  │            Application Layer (Use Cases)                │  │
│  │              (Business Logic, Orchestration)            │  │
│  │                                                          │  │
│  │      ┌───────────────────────────────────────┐          │  │
│  │      │      Domain Layer (Entities)          │          │  │
│  │      │    (Pure business objects/models)     │◀─────────┼──┼─── Core
│  │      └───────────────────────────────────────┘          │  │
│  │                                                          │  │
│  └─────────────────────────┬───────────────────────────────┘  │
│                            │                                  │
│  ┌─────────────────────────▼───────────────────────────────┐  │
│  │        Data Access Layer (Repositories)                 │  │
│  │      (Database Operations, Prisma, Mappers)             │  │
│  └─────────────────────────┬───────────────────────────────┘  │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                   ┌─────────▼────────┐
                   │     Database     │
                   │    (PostgreSQL)  │
                   └──────────────────┘
```

### Key Principles

- **Domain-centric design**: The domain layer (entities) is at the center with zero external dependencies
- **Dependency Inversion**: All dependencies point inward—outer layers depend on inner layers, never the reverse
- **Separation of Concerns**: Each layer has a distinct responsibility and is isolated from others
- **Testability**: Each layer can be tested independently by mocking dependencies
- **Flexibility**: Infrastructure details (database, framework, UI) can be changed without affecting the core domain
- **Scalability**: Easy to add new features by following established patterns

---

## Layer Structure

In Onion Architecture, layers are organized in concentric circles with the domain at the center:

### Onion Layers (Inner to Outer)

1. **Domain Layer (Core)**: Pure business entities with no external dependencies
2. **Application Layer**: Use cases that orchestrate business workflows
3. **Infrastructure Layer**: All external concerns (database, web framework, external APIs)
   - Data Access (Repositories)
   - Presentation (REST API)
   - External Services (Future: email, storage, etc.)

### Directory Structure

```
src/
├── entities/              # 🔵 DOMAIN LAYER (Core)
│   └── {entity-name}/     # Pure business entities - NO dependencies
│       └── {entity-name}.ts
│
├── usecases/             # 🟢 APPLICATION LAYER
│   ├── {entity-name}/    # Business logic orchestration
│   │   ├── {operation}-{entity}.ts   # Individual use case functions
│   │   └── index.ts                  # Use case aggregator
│   └── index.ts          # Root use case aggregator
│
├── repositories/          # 🔴 INFRASTRUCTURE LAYER - Data Access
│   ├── database/         # Database connection (Prisma)
│   │   ├── prisma.ts
│   │   └── index.ts
│   ├── {entity-name}/    # Entity-specific repositories
│   │   ├── {operation}.ts    # Individual repository functions
│   │   ├── index.ts          # Repository aggregator
│   │   └── mappers/          # Database model ↔ Entity mappers
│   │       └── {entity-name}.mapper.ts
│   └── index.ts          # Root repository aggregator
│
├── rest/                 # 🔴 INFRASTRUCTURE LAYER - Presentation
│   ├── routes.ts         # Root route configuration
│   └── {entity-name}/    # Entity-specific REST routes
│       ├── routes.ts              # Route definitions
│       ├── controllers/           # Request handlers
│       │   └── {entity-name}.controller.ts  # All controller methods
│       ├── dtos/                  # Data Transfer Objects (request/response)
│       │   ├── {entity-name}.dto.ts
│       │   ├── create-{entity-name}.dto.ts
│       │   └── error.dto.ts
│       └── mappers/               # Entity ↔ DTO mappers
│           └── {entity-name}.mapper.ts
│
├── libs/                 # 🔴 INFRASTRUCTURE LAYER - Shared utilities
│   ├── config/          # Application configuration
│   ├── context/         # Application context (dependency injection)
│   ├── loggers/         # Logging utilities
│   └── types/           # Shared TypeScript types
│
└── index.ts             # Composition root - wires everything together
```

### Dependency Rules

```
Infrastructure Layer (repositories, rest, libs)
         ↓ depends on
Application Layer (usecases)
         ↓ depends on
Domain Layer (entities)
         ↑
    NO UPWARD DEPENDENCIES!
```

- **✅ Allowed**: Outer layers importing from inner layers
- **❌ Forbidden**: Inner layers importing from outer layers
- **✅ Allowed**: Infrastructure layer implementing interfaces defined in domain/application
- **❌ Forbidden**: Domain layer knowing about databases, HTTP, frameworks

---

## Domain Layer (Core)

### Purpose

The **Domain Layer** is the heart of the Onion Architecture and contains:
- **Business Entities**: Core business objects and their properties
- **Business Rules**: Domain-specific validation and behavior (currently minimal, room for growth)
- **Domain Interfaces**: Contracts that outer layers must implement (future improvement)
- **Domain Errors**: Business rule violation exceptions (future improvement)

### Key Characteristics

- **Zero External Dependencies**: No imports from frameworks, libraries, or infrastructure
- **Framework-Agnostic**: Pure TypeScript/JavaScript
- **Technology-Independent**: No knowledge of databases, HTTP, or external services
- **Stable**: Changes here should be rare and driven only by business requirements

### Structure

#### Domain Entities (`entities/{entity-name}/`)

**Example (User entity):**
```typescript
// src/entities/user/user.ts
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}
```

**Key Points:**
- Pure TypeScript interfaces or classes
- Represent core business concepts
- No dependencies on any framework or library
- No knowledge of how they are persisted or presented

**Future Enhancement (Rich Domain Models):**
```typescript
// Example of a richer domain model with behavior
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly createdAt: Date
  ) {}

  static create(email: string): User {
    if (!this.isValidEmail(email)) {
      throw new InvalidEmailError(email);
    }
    return new User(crypto.randomUUID(), email, new Date());
  }

  private static isValidEmail(email: string): boolean {
    return email.includes('@') && email.length > 3;
  }

  canBeDeleted(): boolean {
    // Business rule example
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.createdAt < thirtyDaysAgo;
  }
}
```

---

## Repository Layer (Infrastructure)

### Purpose

The **Repository Layer** is part of the **Infrastructure Layer** and is responsible for:
- **Data Access**: Interacting with the database
- **Data Mapping**: Converting between database models (Prisma) and domain entities
- **Data Persistence**: Create, Read, Update, Delete operations
- **Query Abstraction**: Hiding database implementation details from upper layers
- **Infrastructure Concern**: This is an adapter that implements data access for the use cases

### Important Notes

In true Onion Architecture:
- **Repository interfaces** should be defined in the domain/application layer (future improvement)
- **Repository implementations** live in the infrastructure layer (current implementation)
- This enables **Dependency Inversion Principle**: application layer depends on abstractions, not concrete implementations
- Currently, repositories are concrete functions passed via context—this works but could be improved with explicit interfaces

### Structure

#### 1. Database Connection (`repositories/database/`)

**Files:**
- `prisma.ts`: Prisma client instance
- `index.ts`: Database connection exports

**Responsibility:** Manages the database connection and Prisma client initialization.

#### 2. Entity Repositories (`repositories/{entity-name}/`)

**Example Structure for `users` entity:**

```
repositories/users/
├── create.ts              # Create user repository function
├── get-all.ts             # Get all users repository function
├── get-by-id.ts           # Get user by ID repository function
├── update.ts              # Update user repository function (example)
├── delete.ts              # Delete user repository function (example)
├── index.ts               # Aggregates all user repositories
└── mappers/
    └── user.mapper.ts     # Maps Prisma models ↔ Entities
```

#### 3. Individual Repository Functions (`{operation}.ts`)

**Pattern:**
```typescript
import type { PrismaClient } from '@prisma/client';
import type { Entity } from '../../entities/{entity}/{entity}.js';
import { toEntity } from './mappers/{entity}.mapper.js';

export interface OperationData {
  // Define input data structure
}

export const initOperationRepository = (prisma: PrismaClient) => {
  return async (data: OperationData): Promise<Entity> => {
    // Database operation using Prisma
    const model = await prisma.{entity}.{operation}({
      // Prisma query
    });

    // Convert to domain entity
    return toEntity(model);
  };
};
```

**Key Points:**
- Takes `PrismaClient` as parameter (dependency injection)
- Returns an initialized function
- Uses mappers to convert Prisma models to domain entities
- Focuses solely on data access, no business logic

#### 4. Repository Aggregator (`index.ts`)

**Pattern:**
```typescript
import type { PrismaClient } from '@prisma/client';
import { initOperation1Repository } from './operation1.js';
import { initOperation2Repository } from './operation2.js';

export const initEntityRepositories = (prisma: PrismaClient) => {
  return {
    operation1: initOperation1Repository(prisma),
    operation2: initOperation2Repository(prisma),
  };
};

export type EntityRepositories = ReturnType<typeof initEntityRepositories>;
```

#### 5. Mappers (`mappers/{entity-name}.mapper.ts`)

**Purpose:** Convert between database models (Prisma) and domain entities.

**Pattern:**
```typescript
import type { Entity } from '../../../entities/{entity}/{entity}.js';
import type { Model } from '@prisma/client';

// Database Model → Entity
export const toEntity = (model: Model): Entity => {
  return {
    id: model.id,
    // Map other fields, handling type conversions
    createdAt: model.createdAt, // Date is preserved
  };
};

// Entity → Database Model (if needed)
export const toModel = (entity: Entity): Omit<Model, 'id'> => {
  return {
    // Map entity fields to model structure
  };
};
```

#### 6. Root Repository Aggregator (`repositories/index.ts`)

**Pattern:**
```typescript
import type { PrismaClient } from '@prisma/client';
import { initEntity1Repositories } from './entity1/index.js';
import { initEntity2Repositories } from './entity2/index.js';

export const initRepositories = (prisma: PrismaClient) => {
  return {
    entity1: initEntity1Repositories(prisma),
    entity2: initEntity2Repositories(prisma),
  };
};

export type Repositories = ReturnType<typeof initRepositories>;
```

**Responsibility:** Aggregates all entity repositories and provides a single entry point.

---

## Use Case Layer (Application)

### Purpose

The **Use Case Layer** (Application Layer) is responsible for:
- **Business Logic**: Implementing domain rules and workflows
- **Validation**: Input validation and business rule enforcement  
- **Orchestration**: Coordinating between repositories and other services
- **Transaction Management**: Ensuring data consistency
- **Use Case Workflows**: Domain-specific logic for your features
- **Dependency on Domain Only**: Use cases depend only on domain entities and receive infrastructure via dependency injection

### Key Characteristics in Onion Architecture

- **Application Core**: This layer orchestrates the domain to fulfill specific use cases
- **Framework-Independent**: No knowledge of HTTP, databases, or UI
- **Depends Inward**: Only imports from the domain layer
- **Receives Dependencies**: Gets infrastructure (repositories, gateways) via context (dependency injection)
- **Testable**: Can be tested by mocking the context dependencies

### Structure

#### 1. Entity Use Cases (`usecases/{entity-name}/`)

**Example Structure for `users` entity:**

```
usecases/users/
├── create-user.ts         # Create user use case
├── get-all-users.ts       # Get all users use case
├── get-user-by-id.ts      # Get user by ID use case
├── update-user.ts         # Update user use case (example)
├── delete-user.ts         # Delete user use case (example)
└── index.ts               # Aggregates all user use cases
```

#### 2. Individual Use Case Functions (`{operation}-{entity}.ts`)

**Pattern:**
```typescript
import type { AppContext } from '../../libs/context/index.js';
import type { Entity } from '../../entities/{entity}/{entity}.js';

export interface OperationInput {
  // Define input structure
}

export const operationEntity = async (
  context: AppContext,
  input: OperationInput
): Promise<Entity | Entity[]> => {
  // 1. Input validation
  if (!input.field) {
    throw new Error('Field is required');
  }

  // 2. Business logic validation
  if (/* business rule violation */) {
    throw new Error('Business rule violation');
  }

  // 3. Call repository through context
  const entity = await context.repositories.{entity}.operation({
    // Map input to repository data format
  });

  // 4. Additional business logic processing
  // ...

  // 5. Return result
  return entity;
};
```

**Key Points:**
- Receives `AppContext` for accessing repositories, logger, config, etc.
- Defines input interface for type safety
- Contains all business logic and validation
- Uses repositories through `context.repositories`
- Can call multiple repositories if needed
- No knowledge of HTTP/Express

#### 3. Use Case Aggregator (`index.ts`)

**Pattern:**
```typescript
import { operation1Entity } from './operation1-entity.js';
import { operation2Entity } from './operation2-entity.js';

export const initEntityUsecases = () => {
  return {
    operation1: operation1Entity,
    operation2: operation2Entity,
  };
};

export type EntityUsecases = ReturnType<typeof initEntityUsecases>;
```

#### 4. Root Use Case Aggregator (`usecases/index.ts`)

**Pattern:**
```typescript
import { initEntity1Usecases } from './entity1/index.js';
import { initEntity2Usecases } from './entity2/index.js';

export const initUsecases = () => {
  return {
    entity1: initEntity1Usecases(),
    entity2: initEntity2Usecases(),
  };
};

export type Usecases = ReturnType<typeof initUsecases>;
```

---

## REST Layer (Infrastructure - Presentation)

### Purpose

The **REST Layer** is part of the **Infrastructure Layer** and is responsible for:
- **HTTP Handling**: Processing HTTP requests and responses
- **Request Parsing**: Extracting data from request body, params, query
- **Response Formatting**: Converting results to HTTP responses
- **Status Codes**: Setting appropriate HTTP status codes
- **DTOs**: Defining request/response data structures
- **Route Configuration**: Mapping URLs to controllers
- **Infrastructure Adapter**: Translates between HTTP world and application use cases

### Key Characteristics in Onion Architecture

- **Outer Layer**: This is an infrastructure concern, not part of the application core
- **Adapts External Requests**: Converts HTTP requests into use case inputs
- **Depends Inward**: Only depends on use cases and domain entities (via DTOs)
- **Replaceable**: Could be swapped with GraphQL, gRPC, CLI, etc., without changing core logic
- **Framework-Specific**: This layer is allowed to use Express and HTTP-specific code

### Structure

#### 1. Root Routes (`rest/routes.ts`)

**Purpose:** Configures the main Express router with authentication middleware and mounts entity routes.

**Pattern:**
```typescript
import { Router } from 'express';
import type { BaseContext } from '../libs/context/index.js';
import { createAuthMiddleware } from './middlewares/auth.middleware.js';
import { initEntityRoutes } from './{entity}/routes.js';
import { initUsecases } from '../usecases/index.js';

export const createRestRoutes = (baseContext: BaseContext): Router => {
  const router = Router();
  const usecases = initUsecases();

  // Apply authentication middleware (extracts and validates JWT tokens)
  router.use(createAuthMiddleware(baseContext));

  // Mount entity routes
  router.use('/{entity}', initEntityRoutes(usecases));

  return router;
};
```

#### 2. Authentication Middleware (`rest/middlewares/auth.middleware.ts`)

**Purpose:** Extracts JWT tokens from Authorization headers, validates them with Firebase, and creates authenticated request contexts.

**Pattern:**
```typescript
import type { Request, Response, NextFunction } from 'express';
import type { BaseContext } from '@/libs/context/index.js';
import type { AuthContext } from '@/libs/context/index.js';
import { createRequestContext } from '@/libs/context/index.js';

export const createAuthMiddleware = (baseContext: BaseContext) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    let authContext: Partial<AuthContext>;

    if (token) {
      try {
        // Validate token with Firebase via IAM gateway
        authContext = await baseContext.gateways.iam.getAuthAndValidateToken(token);
        // Returns: { isAuthenticated: true, userId: "firebase-uid", isImpersonating: false }
      } catch (error) {
        // Token validation failed (invalid, expired, revoked)
        baseContext.logger.warn('Token validation failed', { error });
        authContext = { isAuthenticated: false };
      }
    } else {
      // No token provided - public endpoint
      authContext = { isAuthenticated: false };
    }

    // Create request context with authentication info
    const context = createRequestContext(baseContext, authContext);
    (req as any).context = context;
    
    next();
  };
};
```

**Key Points:**
- **Token Extraction**: Reads `Authorization: Bearer <token>` header
- **Validation**: Calls `getAuthAndValidateToken()` from IAM gateway (Firebase Admin SDK)
- **Error Handling**: Gracefully handles invalid/expired tokens by setting `isAuthenticated: false`
- **Public Endpoints**: Allows requests without tokens (use cases enforce authorization)
- **Context Creation**: Attaches `AppContext` with proper auth state to every request

**Authentication Flow:**
```
1. Client includes: Authorization: Bearer <jwt-token>
2. Middleware extracts token from header
3. IAM Gateway validates token with Firebase Admin SDK
4. On success: context.auth = { isAuthenticated: true, userId: "firebase-uid" }
5. On failure: context.auth = { isAuthenticated: false }
6. Use cases check context.auth.isAuthenticated for protected operations
```

#### 3. Entity Routes (`rest/{entity-name}/routes.ts`)

**Purpose:** Defines HTTP routes for a specific entity and maps them to controllers.

**Pattern:**
```typescript
import { Router } from 'express';
import { initEntityControllers } from './controllers/{entity-name}.controller.ts';
import type { Usecases } from '../../usecases/index.js';

export const initEntityRoutes = (usecases: Usecases) => {
  const controllers = initEntityControllers(usecases);

  const router = Router();

  router.get('/', controllers.getAll as any);
  router.get('/:id', controllers.getById as any);
  router.post('/', controllers.create as any);
  router.put('/:id', controllers.update as any);
  router.delete('/:id', controllers.delete as any);

  return router;
};
```

#### 3. Controllers (`rest/{entity-name}/controllers/`)

**Example Structure:**
```
controllers/
└── {entity-name}.controller.ts  # All controller methods in one file
```

**Controller Pattern:**
```typescript
import type { Request, Response } from 'express';
import type { Usecases } from '../../../usecases/index.js';
import type { AppContext } from '../../../libs/context/index.js';
import type { EntityDto } from '../dtos/{entity}.dto.js';
import type { CreateEntityDto } from '../dtos/create-{entity}.dto.js';
import { toDto } from '../mappers/{entity}.mapper.js';

export const initEntityControllers = (usecases: Usecases) => {
  const create = async (
    req: Request<any, EntityDto, CreateEntityDto> & { context: AppContext },
    res: Response<EntityDto>,
  ) => {
    try {
      // 1. Call use case with context
      const entity = await usecases.{entity}.create(req.context, {
        // Map DTO to use case input
        field: req.body.field,
      });

      // 2. Convert entity to DTO
      const entityDto = toDto(entity);

      // 3. Send response
      res.status(201).json(entityDto);
    } catch (error) {
      // Error handling
      res.status(400).json({
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const getAll = async (
    req: Request<any, EntityDto[]> & { context: AppContext },
    res: Response<EntityDto[]>,
  ) => {
    const entities = await usecases.{entity}.getAll(req.context);
    const entitiesDto = entities.map(toDto);
    res.json(entitiesDto);
  };

  const getById = async (
    req: Request<{ id: string }, EntityDto> & { context: AppContext },
    res: Response<EntityDto>,
  ) => {
    const entity = await usecases.{entity}.getById(req.context, {
      id: req.params.id || '',
    });

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' } as any);
    }

    const entityDto = toDto(entity);
    res.json(entityDto);
  };

  // ... other controller methods

  return {
    create,
    getAll,
    getById,
    // ... other methods
  };
};

export type EntityControllers = ReturnType<typeof initEntityControllers>;
```

**Key Points:**
- All controller methods are defined in a single file: `{entity-name}.controller.ts`
- Receives Express `Request` and `Response` objects
- Context is attached to request: `req.context`
- Calls use cases through `usecases` parameter
- Maps DTOs to use case inputs
- Converts entities to DTOs using mappers
- Sets appropriate HTTP status codes
- Handles errors and formats error responses
- Returns an object with all controller methods

#### 4. DTOs (Data Transfer Objects) (`rest/{entity-name}/dtos/`)

**Purpose:** Define the structure of data exchanged between client and server.

**Files:**
- `{entity-name}.dto.ts`: Response DTO (output)
- `create-{entity-name}.dto.ts`: Create request DTO (input)
- `update-{entity-name}.dto.ts`: Update request DTO (input, optional)
- `error.dto.ts`: Error response DTO

**Pattern:**
```typescript
import { z } from 'zod';

// Request DTO (using Zod for validation)
export const CreateEntityDtoSchema = z.object({
  field: z.string().min(1),
});

export type CreateEntityDto = z.infer<typeof CreateEntityDtoSchema>;

// Response DTO
export const EntityDtoSchema = z.object({
  id: z.string().uuid(),
  field: z.string(),
  createdAt: z.string().datetime(),
});

export type EntityDto = z.infer<typeof EntityDtoSchema>;
```

**Key Points:**
- Use Zod schemas for validation and type inference
- DTOs may differ from domain entities (e.g., Date → string)
- DTOs represent the API contract
- Keep DTOs separate from domain entities

#### 5. DTO Mappers (`rest/{entity-name}/mappers/{entity-name}.mapper.ts`)

**Purpose:** Convert between domain entities and DTOs.

**Pattern:**
```typescript
import type { Entity } from '../../../entities/{entity}/{entity}.js';
import type { EntityDto } from '../dtos/{entity}.dto.js';

// Entity → DTO
export const toDto = (entity: Entity): EntityDto => {
  return {
    id: entity.id,
    field: entity.field,
    createdAt: entity.createdAt.toISOString(), // Date → string
  };
};

// DTO → Entity (if needed for updates)
export const toEntity = (dto: CreateEntityDto): Omit<Entity, 'id' | 'createdAt'> => {
  return {
    field: dto.field,
  };
};
```

**Key Points:**
- Handles type conversions (Date → string, etc.)
- Separates API representation from domain model
- Can transform data structure if needed

---

## Data Flow

### Request Flow (Onion Architecture)

```
1. HTTP Request (External World)
   └─ Includes Authorization: Bearer <token> header (if authenticated)
   ↓
2. Express Router (Infrastructure - REST)
   └─ rest/routes.ts
   ↓
3. Authentication Middleware (Infrastructure)
   └─ rest/middlewares/auth.middleware.ts
   └─ Extracts JWT token from Authorization header
   └─ Validates token with Firebase Admin SDK
   └─ Creates AppContext with auth state (isAuthenticated, userId)
   └─ Injects repositories and gateways into context
   ↓
4. Entity Routes (Infrastructure - REST)
   └─ rest/{entity}/routes.ts
   ↓
5. Controller (Infrastructure - REST)
   └─ rest/{entity}/controllers/{entity}.controller.ts
   └─ Extracts data from HTTP request
   └─ Maps DTO → Use Case Input
   ↓
6. Use Case (Application Layer) ◄─── BOUNDARY: Infrastructure → Application
   └─ usecases/{entity}/{operation}-{entity}.ts
   └─ Checks context.auth.isAuthenticated for protected operations
   └─ Validates input
   └─ Applies business logic
   └─ Calls repository through context
   ↓
7. Repository (Infrastructure - Data Access) ◄─── BOUNDARY: Application → Infrastructure
   └─ repositories/{entity}/{operation}.ts
   └─ Accesses database via Prisma
   └─ Maps database model → Domain Entity
   ↓
8. Domain Entity (Domain Layer) ◄─── BOUNDARY: Infrastructure → Domain
   └─ entities/{entity}/{entity}.ts
   └─ Pure business object
   ↓
9. Database (External - PostgreSQL)
```

### Response Flow (Outward through layers)

```
1. Database returns raw data
   ↓
2. Repository (Infrastructure)
   └─ Maps Prisma Model → Domain Entity
   └─ Returns Entity
   ↓
3. Use Case (Application)
   └─ Receives Entity
   └─ May apply additional business logic
   └─ Returns Entity
   ↓
4. Controller (Infrastructure - REST)
   └─ Receives Entity
   └─ Maps Entity → DTO (for HTTP response)
   └─ Sets HTTP status code
   ↓
5. HTTP Response sent to client
```

### Key Observations

- **Inward Dependencies**: Each layer only depends on layers closer to the center
- **Boundary Crossings**: Data crosses boundaries via mapping (Entity ↔ DTO, Model ↔ Entity)
- **Isolation**: The domain layer never knows about HTTP, databases, or frameworks
- **Testability**: Each layer can be tested by mocking the layer below it

### Example: Create User Flow

```
POST /api/users
{
  "email": "user@example.com"
}
   ↓
Controller (create-user.controller.ts)
   ↓
Use Case (create-user.ts)
  - Validates email format
  - Checks business rules
   ↓
Repository (create.ts)
  - Inserts into database
  - Maps Prisma model → User entity
   ↓
Database
   ↓
Repository returns User entity
   ↓
Use Case returns User entity
   ↓
Controller maps User entity → UserDto
   ↓
HTTP 201 Response
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Adding New Features

### Step-by-Step Guide

#### 1. Define Domain Entity

**File:** `src/entities/{entity-name}/{entity-name}.ts`

```typescript
export interface EntityName {
  id: string;
  // ... other properties
  createdAt: Date;
}
```

#### 2. Create Repository Layer

**a) Create repository files:**
- `src/repositories/{entity-name}/{operation}.ts` (for each operation)

**b) Create mapper:**
- `src/repositories/{entity-name}/mappers/{entity-name}.mapper.ts`

**c) Create aggregator:**
- `src/repositories/{entity-name}/index.ts`

**d) Update root repository:**
- Add to `src/repositories/index.ts`

#### 3. Create Use Case Layer

**a) Create use case files:**
- `src/usecases/{entity-name}/{operation}-{entity}.ts`

**b) Create aggregator:**
- `src/usecases/{entity-name}/index.ts`

**c) Update root use cases:**
- Add to `src/usecases/index.ts`

#### 4. Create REST Layer

**a) Create DTOs:**
- `src/rest/{entity-name}/dtos/{entity-name}.dto.ts`
- `src/rest/{entity-name}/dtos/create-{entity-name}.dto.ts`

**b) Create DTO mapper:**
- `src/rest/{entity-name}/mappers/{entity-name}.mapper.ts`

**c) Create controllers:**
- `src/rest/{entity-name}/controllers/{entity-name}.controller.ts` (all controller methods)

**d) Create routes:**
- `src/rest/{entity-name}/routes.ts`

**e) Update root routes:**
- Add to `src/rest/routes.ts`

#### 5. Update OpenAPI Documentation

**File:** `src/docs/api/openapi.yaml`

Add the new endpoints and schemas to the OpenAPI specification.

---

## Key Patterns

### 1. Dependency Injection via Context (Ports and Adapters)

All layers receive dependencies through the `AppContext`, implementing the **Ports and Adapters** pattern:

- **Ports**: Interfaces/contracts defined by the application (what it needs)
- **Adapters**: Implementations provided by infrastructure (how it's done)

**Current Implementation:**
```typescript
// Application layer defines what it needs via context types
export interface AppContext {
  config: Config;
  logger: Logger;
  repositories: Repositories;  // Port: what we need
  gateways: Gateways;
  auth: AuthContext;
}

// Use cases receive dependencies through context
export const createUser = async (context: AppContext, input: CreateUserInput) => {
  // Uses repositories through the port
  const user = await context.repositories.users.create(input);
  return user;
};

// Infrastructure provides the adapter (implementation)
const repositories = initRepositories(prisma);  // Adapter: how it's done
```

**Key Points:**
- Use cases depend on **abstractions** (context interface), not concrete implementations
- Infrastructure **implements** the abstractions
- Easy to swap implementations (e.g., replace Prisma with another ORM)
- Testable: mock the context in tests

### 2. Initialization Pattern (Dependency Injection)

Repositories and controllers use initialization functions that enable dependency injection:

```typescript
// Repository initialization
export const initFunction = (dependency: Dependency) => {
  return async (data: Data) => {
    // Implementation using the injected dependency
  };
};

// Usage
const userRepo = initCreateUserRepository(prisma);  // Inject Prisma
const user = await userRepo({ email: 'test@example.com' });  // Use it
```

This pattern allows:
- **Dependency injection** at the composition root
- **Easy testing** by injecting mocks
- **Lazy initialization** of dependencies
- **Closure-based dependency management**

### 3. Aggregation Pattern

Each layer aggregates related functions into cohesive modules:

```typescript
export const initModule = (deps: Dependencies) => {
  return {
    operation1: initOperation1(deps),
    operation2: initOperation2(deps),
  };
};
```

This provides:
- **Single entry point** for each module
- **Cohesive grouping** of related functionality
- **Type-safe access** to all operations

### 4. Type Safety with TypeScript

TypeScript types are derived from implementations using `ReturnType`:

```typescript
export type ModuleType = ReturnType<typeof initModule>;
```

Benefits:
- **Single source of truth**: Types derived from implementation
- **Automatic updates**: Types change when implementation changes
- **IntelliSense support**: Full editor autocomplete

### 5. Strict Separation of Concerns (Onion Layers)

Each layer has a single, well-defined responsibility:

- **Domain (Entities)**: Business objects and rules—pure TypeScript, zero dependencies
- **Application (Use Cases)**: Business workflows—depends only on domain
- **Infrastructure (Repositories/REST)**: External concerns—depends on application + domain

**Forbidden:**
- ❌ Entities importing from use cases, repositories, or REST
- ❌ Use cases importing from repositories or REST directly
- ❌ Business logic in controllers or repositories

**Allowed:**
- ✅ Use cases importing entities
- ✅ Repositories importing entities
- ✅ Controllers importing use cases
- ✅ All layers using the context for dependency injection

### 6. Mapping Pattern (Boundary Translation)

Three types of mappers handle boundary crossings:

#### Repository Mappers (Infrastructure → Domain)
```typescript
// Maps database model to domain entity
export const toEntity = (model: PrismaModel): DomainEntity => {
  return {
    id: model.id,
    email: model.email,
    createdAt: model.createdAt,
  };
};
```

#### DTO Mappers (Domain → Infrastructure)
```typescript
// Maps domain entity to HTTP DTO
export const toDto = (entity: DomainEntity): EntityDto => {
  return {
    id: entity.id,
    email: entity.email,
    createdAt: entity.createdAt.toISOString(),  // Date → string
  };
};
```

**Key Points:**
- **Mappers live in infrastructure** layer where the conversion happens
- **Protect domain purity**: Domain entities never know about DTOs or database models
- **Handle format differences**: Date objects ↔ ISO strings, etc.
- **Two-way or one-way**: Mappers can be bidirectional or unidirectional as needed

### 7. Authentication and Authorization Pattern

The starter uses a middleware-based authentication system with use case-level authorization:

#### Authentication Middleware (Infrastructure)

**Location:** `src/rest/middlewares/auth.middleware.ts`

The middleware runs on every request and:
1. Extracts JWT token from `Authorization: Bearer <token>` header
2. Validates token with Firebase Admin SDK
3. Creates `AppContext` with proper auth state
4. Never throws errors - sets `isAuthenticated: false` for invalid tokens

```typescript
export const createAuthMiddleware = (baseContext: BaseContext) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = extractBearerToken(req.headers.authorization);
    
    let authContext: Partial<AuthContext>;
    
    if (token) {
      try {
        // Validate with Firebase
        authContext = await baseContext.gateways.iam.getAuthAndValidateToken(token);
      } catch (error) {
        // Invalid/expired token → treat as unauthenticated
        authContext = { isAuthenticated: false };
      }
    } else {
      // No token → public endpoint
      authContext = { isAuthenticated: false };
    }
    
    const context = createRequestContext(baseContext, authContext);
    (req as any).context = context;
    next();
  };
};
```

#### Authorization in Use Cases (Application Layer)

**Pattern:** Use cases check `context.auth.isAuthenticated` for protected operations

```typescript
export const createEntity = async (
  context: AppContext,
  input: CreateEntityInput,
): Promise<Entity> => {
  // Check authentication
  if (!context.auth.isAuthenticated) {
    throw new UnauthorizedError('Authentication required');
  }
  
  // Proceed with business logic
  const entity = await context.repositories.entity.create(input);
  return entity;
};
```

#### Authentication Context Type

```typescript
type AuthContextUnauthenticated = {
  isAuthenticated: false;
};

type AuthContextAuthenticated = {
  isAuthenticated: true;
  userId: string;  // Firebase UID
  isImpersonating: boolean;
  impersonatorUserId?: string;
};

export type AuthContext = AuthContextAuthenticated | AuthContextUnauthenticated;
```

**Key Design Decisions:**

1. **Middleware Responsibility**: Extract and validate tokens, create context
2. **Use Case Responsibility**: Check auth state, enforce authorization rules
3. **Graceful Degradation**: Invalid tokens → unauthenticated (not errors)
4. **Public Endpoints**: Work without tokens (middleware sets `isAuthenticated: false`)
5. **Protected Endpoints**: Use cases throw `UnauthorizedError` when needed
6. **Token Validation**: All validation via Firebase Admin SDK (no custom JWT parsing)
7. **Type Safety**: Discriminated union ensures type-safe auth checks

**Benefits:**
- Clear separation between authentication (middleware) and authorization (use cases)
- Public and protected endpoints use the same middleware
- Use cases contain authorization logic close to business rules
- Type-safe authentication state throughout the API
- Easy to test by mocking `context.auth`


### 7. Composition Root (Project Entry Point)

The `src/index.ts` file acts as the **composition root** where all dependencies are wired together:

```typescript
// This is the ONLY place where concrete implementations are created
const prisma = getPrismaClient();
const config = loadConfig();
const logger = initLogger(config);

// Wire up infrastructure
const baseContext = await createBaseContext();

// Inject dependencies into middleware
app.use((req, res, next) => {
  req.context = createRequestContext(baseContext, prisma);
  next();
});
```

**Principles:**
- **Single place** for dependency wiring
- **Concrete implementations** created here
- **Injected everywhere else**
- Makes it easy to change implementations without touching core logic

---

## Best Practices

### Onion Architecture Rules

1. **Protect the Domain Core**: Keep entities pure with zero external dependencies
2. **Dependency Direction**: All dependencies point inward—never outward
3. **Use Abstractions**: Inner layers define interfaces; outer layers implement them
4. **Cross Boundaries with Mapping**: Never pass infrastructure objects to the domain
5. **No Framework in Core**: Domain and use cases should be framework-agnostic

### Implementation Guidelines

1. **Keep layers independent**: Don't import from upper layers in lower layers
2. **Use context for dependencies**: Avoid global state and singletons in business logic
3. **Follow naming conventions**: Use consistent file naming across the project
4. **Consolidate controllers**: All controller methods for an entity in one file
5. **Type everything**: Leverage TypeScript for safety and documentation
6. **Validate at boundaries**: 
   - Input validation in use cases (business rules)
   - Schema validation in REST layer (format/structure)
7. **Handle errors appropriately**: 
   - Domain errors in use cases
   - HTTP mapping in controllers
8. **Keep business logic in use cases**: Not in repositories or controllers
9. **Document complex logic**: Add comments for non-obvious business rules
10. **Test each layer independently**: 
    - Domain: Unit tests for entity behavior
    - Use cases: Test with mocked repositories
    - Repositories: Integration tests with test database
    - Controllers: Test with mocked use cases

### Areas for Future Improvement

Based on pure Onion Architecture principles, consider these enhancements:

1. **Repository Interfaces in Domain/Application Layer**
   - Define `IUserRepository` interface in domain
   - Implement in infrastructure
   - Enables true dependency inversion

2. **Rich Domain Models**
   - Move validation logic into entities
   - Add domain behavior methods
   - Encapsulate business rules

3. **Domain-Specific Errors**
   - Create error classes for business rule violations
   - Better than generic `Error` objects
   - Easier to handle in outer layers

4. **Domain Services**
   - For logic spanning multiple entities
   - Complex validations
   - Business rules that don't fit in a single entity

5. **Value Objects**
   - For domain concepts like Email, Money, Address
   - Immutable and self-validating
   - Richer type system

---

## Summary

This backend starter implements **Onion Architecture** (also known as Ports and Adapters or Hexagonal Architecture) and provides:

- ✅ **Domain-centric design** with pure business entities at the core
- ✅ **Clear separation of concerns** across concentric layers
- ✅ **Dependency inversion** with dependencies flowing inward
- ✅ **Easy testing** through dependency injection via context
- ✅ **Infrastructure isolation** - frameworks and tools are pluggable
- ✅ **Scalability** through modular structure and clear patterns
- ✅ **Type safety** with TypeScript throughout
- ✅ **Maintainability** through consistent patterns and boundaries
- ✅ **Flexibility** to swap infrastructure without touching business logic

### Architecture Compliance

**Strengths:**
- Clear layer separation with domain at the center
- Dependencies flow inward correctly
- Pure domain entities with zero dependencies
- Dependency injection via context
- Proper mapping layers at boundaries

**Current Limitations:**
- Repository interfaces not formally defined in domain layer (acceptable but not ideal)
- Minimal domain logic (entities are currently anemic—could be enriched)
- Generic errors instead of domain-specific exceptions
- Context initialization has some infrastructure coupling

**Overall Score: 8/10**

The starter successfully implements Onion Architecture principles. You can refine it further as you add your own domain and features.

### Key Difference from Clean Architecture

While similar, Onion Architecture emphasizes:
- **Visual metaphor of concentric circles** with domain at center
- **Explicit focus on dependency inversion** at layer boundaries
- **Ports and Adapters terminology** for infrastructure interfaces
- **Domain purity** as the primary goal

Both architectures share the goal of creating maintainable, testable systems with clear boundaries, but Onion Architecture provides a more visual, circular mental model.

---

## Appendix: Common Mistakes to Avoid

### ❌ Anti-Patterns

1. **Domain entities importing from infrastructure**
   ```typescript
   // ❌ WRONG
   import { PrismaClient } from '@prisma/client';
   export interface User { /* ... */ }
   ```

2. **Use cases knowing about HTTP**
   ```typescript
   // ❌ WRONG
   import { Request } from 'express';
   export const createUser = async (req: Request) => { /* ... */ }
   ```

3. **Business logic in controllers**
   ```typescript
   // ❌ WRONG
   const create = async (req, res) => {
     if (!req.body.email.includes('@')) {  // Business logic in controller!
       return res.status(400).json({ error: 'Invalid email' });
     }
   };
   ```

4. **Direct database imports in use cases**
   ```typescript
   // ❌ WRONG
   import { prisma } from '@/repositories/database/prisma';
   export const createUser = async (input) => {
     return await prisma.user.create({ data: input });  // Skips repository!
   };
   ```

5. **Passing DTOs to use cases**
   ```typescript
   // ❌ WRONG
   await usecases.user.create(req.context, req.body);  // DTO passed directly
   
   // ✅ CORRECT
   await usecases.user.create(req.context, {
     email: req.body.email  // Map DTO to use case input
   });
   ```

### ✅ Correct Patterns

1. **Domain entities are pure**
   ```typescript
   // ✅ CORRECT
   export interface User {
     id: string;
     email: string;
     createdAt: Date;
   }
   ```

2. **Use cases are framework-agnostic**
   ```typescript
   // ✅ CORRECT
   export const createUser = async (
     context: AppContext,
     input: CreateUserInput
   ): Promise<User> => { /* ... */ }
   ```

3. **Business logic in use cases**
   ```typescript
   // ✅ CORRECT
   export const createUser = async (context, input) => {
     if (!input.email.includes('@')) {  // Business validation here
       throw new Error('Invalid email');
     }
     return await context.repositories.users.create(input);
   };
   ```

4. **Dependencies via context**
   ```typescript
   // ✅ CORRECT
   const user = await context.repositories.users.create(data);
   ```

5. **Mapping at boundaries**
   ```typescript
   // ✅ CORRECT
   const entity = await usecases.user.create(req.context, {
     email: req.body.email
   });
   const dto = toDto(entity);
   res.json(dto);
   ```

---

Each layer has a specific responsibility, and data flows in a predictable manner from external requests through infrastructure adapters, into the application (use case) core, and back out—always respecting the dependency rule that points inward toward the domain.


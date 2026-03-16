---
name: implement-repository
description: Implements repository layer for database operations following Onion Architecture. Use when creating repositories, database access functions, or when the user asks to implement data access for an entity.
---

# Implement Repository Layer

Implements the repository (data access) layer following the project's Onion Architecture patterns.

## When to Use

- User asks to create a repository
- Need to add database operations for an entity
- Adding CRUD operations for a new resource
- Keywords: "repository", "database", "data access", "Prisma"

## Implementation Steps

### 1. Create Repository Directory

```bash
mkdir -p src/repositories/{entity-name}/mappers
```

### 2. Create Mapper

**File:** `src/repositories/{entity-name}/mappers/{entity-name}.mapper.ts`

```typescript
import type { Entity } from '@/entities/{entity}/{entity}.js';
import type { Entity as PrismaEntity } from '@prisma/client';

export const toEntity = (model: PrismaEntity): Entity => {
  return {
    id: model.id,
    field: model.field,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
};
```

### 3. Create CRUD Operations

Create these files in `src/repositories/{entity-name}/`:

**create.ts:**
```typescript
import type { PrismaClient } from '@prisma/client';
import type { Entity } from '@/entities/{entity}/{entity}.js';
import { toEntity } from './mappers/{entity}.mapper.js';

export interface CreateEntityData {
  field: string;
}

export const initCreateEntityRepository = (prisma: PrismaClient) => {
  return async (data: CreateEntityData): Promise<Entity> => {
    const model = await prisma.entity.create({ data });
    return toEntity(model);
  };
};
```

**get-all.ts:**
```typescript
import type { PrismaClient } from '@prisma/client';
import type { Entity } from '@/entities/{entity}/{entity}.js';
import { toEntity } from './mappers/{entity}.mapper.js';

export const initGetAllEntitiesRepository = (prisma: PrismaClient) => {
  return async (): Promise<Entity[]> => {
    const models = await prisma.entity.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return models.map(toEntity);
  };
};
```

**get-by-id.ts:**
```typescript
import type { PrismaClient } from '@prisma/client';
import type { Entity } from '@/entities/{entity}/{entity}.js';
import { toEntity } from './mappers/{entity}.mapper.js';

export const initGetEntityByIdRepository = (prisma: PrismaClient) => {
  return async (id: string): Promise<Entity | null> => {
    const model = await prisma.entity.findUnique({ where: { id } });
    return model ? toEntity(model) : null;
  };
};
```

**update.ts:**
```typescript
import type { PrismaClient } from '@prisma/client';
import type { Entity } from '@/entities/{entity}/{entity}.js';
import { toEntity } from './mappers/{entity}.mapper.js';

export interface UpdateEntityData {
  id: string;
  field?: string;
}

export const initUpdateEntityRepository = (prisma: PrismaClient) => {
  return async (data: UpdateEntityData): Promise<Entity> => {
    const { id, ...updateData } = data;
    const model = await prisma.entity.update({
      where: { id },
      data: updateData,
    });
    return toEntity(model);
  };
};
```

**delete.ts:**
```typescript
import type { PrismaClient } from '@prisma/client';

export const initDeleteEntityRepository = (prisma: PrismaClient) => {
  return async (id: string): Promise<void> => {
    await prisma.entity.delete({ where: { id } });
  };
};
```

### 4. Create Aggregator

**File:** `src/repositories/{entity-name}/index.ts`

```typescript
import type { PrismaClient } from '@prisma/client';
import { initCreateEntityRepository } from './create.js';
import { initGetAllEntitiesRepository } from './get-all.js';
import { initGetEntityByIdRepository } from './get-by-id.js';
import { initUpdateEntityRepository } from './update.js';
import { initDeleteEntityRepository } from './delete.js';

export const initEntityRepositories = (prisma: PrismaClient) => {
  return {
    create: initCreateEntityRepository(prisma),
    getAll: initGetAllEntitiesRepository(prisma),
    getById: initGetEntityByIdRepository(prisma),
    update: initUpdateEntityRepository(prisma),
    delete: initDeleteEntityRepository(prisma),
  };
};

export type EntityRepositories = ReturnType<typeof initEntityRepositories>;
```

### 5. Wire to Root Repository

**File:** `src/repositories/index.ts`

Add:
```typescript
import { initEntityRepositories } from './{entity-name}/index.js';

export const initRepositories = (prisma: PrismaClient) => {
  return {
    // ... existing
    entity: initEntityRepositories(prisma),
  };
};
```

### 6. Update Prisma Schema

**File:** `prisma/schema.prisma`

Add the entity model:

```prisma
model Entity {
  id        String   @id @default(uuid())
  field     String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("entities")
}
```

**Key points:**
- Use singular PascalCase for model name (e.g., `Product`, `User`, `Article`)
- Use plural snake_case for table name with `@@map` (e.g., `"products"`, `"users"`, `"articles"`)
- Always include `id`, `createdAt`, `updatedAt`
- Use `@map` for snake_case column names

### 7. Generate Migration and Update Prisma Client

After updating the schema, run these commands:

**Create migration:**
```bash
npm run db:migrate:dev
```

This will:
- Create a new migration file in `prisma/migrations/`
- Apply the migration to your database
- Regenerate the Prisma client

**Or manually:**
```bash
# Create and apply migration
npx prisma migrate dev --name add_entity_table

# Regenerate Prisma client (if needed separately)
npx prisma generate
```

**Migration naming convention:**
- Use snake_case
- Be descriptive: `add_entity_table`, `add_entity_tags_relation`, `update_entity_fields`

**Important:**
- Always create migrations in development with `migrate dev`
- Test the migration before committing
- Never edit migration files manually after creation
- Keep migration names descriptive and clear

## Key Rules

- Use factory pattern: `init{Operation}{Entity}Repository`
- Always map Prisma models to domain entities
- NO business logic in repositories
- Export TypeScript types using `ReturnType`
- Use consistent operation names: `create`, `getAll`, `getById`, `update`, `delete`

## Checklist

- [ ] Prisma schema updated with entity model
- [ ] Migration created and applied (`npm run db:migrate:dev`)
- [ ] Prisma client regenerated
- [ ] Mapper created with `toEntity` function
- [ ] All CRUD operations implemented
- [ ] Aggregator created
- [ ] Added to root repository aggregator
- [ ] Types exported properly
- [ ] Migration tested successfully

---
name: implement-usecase
description: Implements use case layer for business logic following Onion Architecture. Use when creating use cases, business logic, or when the user asks to implement application logic for an entity.
---

# Implement Use Case Layer

Implements the use case (application/business logic) layer following the project's Onion Architecture patterns.

## When to Use

- User asks to create a use case
- Need to add business logic for an entity
- Implementing application workflows
- Keywords: "use case", "business logic", "application logic"

## Implementation Steps

### 1. Create Use Case Directory

```bash
mkdir -p src/usecases/{entity-name}
```

### 2. Create CRUD Use Cases

Create these files in `src/usecases/{entity-name}/`:

**create-{entity}.ts:**
```typescript
import Joi from 'joi';
import type { AppContext } from '@/libs/context/index.js';
import type { Entity } from '@/entities/{entity}/{entity}.js';
import type { CreateEntityInput } from '@/entities/{entity}/create-{entity}-input.js';
import { BadUserInputError } from '@/entities/errors/bad-user-input-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const createEntity = async (
  context: AppContext,
  input: CreateEntityInput,
): Promise<Entity> => {
  validateInput(input);

  if (!context.auth.isAuthenticated) {
    throw new UnauthorizedError('User must be authenticated');
  }

  const entity = await context.repositories.entity.create({
    field: input.field,
  });

  return entity;
};

function validateInput(input: CreateEntityInput) {
  const schema = Joi.object<CreateEntityInput>({
    field: Joi.string().required().not().empty(),
  });

  const { error } = schema.validate(input);
  if (error) {
    throw new BadUserInputError(error.message);
  }
}
```

**get-all-{entities}.ts:**
```typescript
import type { AppContext } from '@/libs/context/index.js';
import type { Entity } from '@/entities/{entity}/{entity}.js';

export const getAllEntities = async (
  context: AppContext,
): Promise<Entity[]> => {
  return await context.repositories.entity.getAll();
};
```

**get-{entity}-by-id.ts:**
```typescript
import type { AppContext } from '@/libs/context/index.js';
import type { Entity } from '@/entities/{entity}/{entity}.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';

export interface GetEntityByIdInput {
  id: string;
}

export const getEntityById = async (
  context: AppContext,
  input: GetEntityByIdInput,
): Promise<Entity> => {
  const entity = await context.repositories.entity.getById(input.id);

  if (!entity) {
    throw new NotFoundError('Entity not found');
  }

  return entity;
};
```

**update-{entity}.ts:**
```typescript
import type { AppContext } from '@/libs/context/index.js';
import type { Entity } from '@/entities/{entity}/{entity}.js';
import type { UpdateEntityInput } from '@/entities/{entity}/update-{entity}-input.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export const updateEntity = async (
  context: AppContext,
  input: UpdateEntityInput,
): Promise<Entity> => {
  if (!context.auth.isAuthenticated) {
    throw new UnauthorizedError('User must be authenticated');
  }

  const existing = await context.repositories.entity.getById(input.id);
  if (!existing) {
    throw new NotFoundError('Entity not found');
  }

  const entity = await context.repositories.entity.update({
    id: input.id,
    field: input.field,
  });

  return entity;
};
```

**delete-{entity}.ts:**
```typescript
import type { AppContext } from '@/libs/context/index.js';
import { NotFoundError } from '@/entities/errors/not-found-error.js';
import { UnauthorizedError } from '@/entities/errors/unauthorized-error.js';

export interface DeleteEntityInput {
  id: string;
}

export const deleteEntity = async (
  context: AppContext,
  input: DeleteEntityInput,
): Promise<void> => {
  if (!context.auth.isAuthenticated) {
    throw new UnauthorizedError('User must be authenticated');
  }

  const existing = await context.repositories.entity.getById(input.id);
  if (!existing) {
    throw new NotFoundError('Entity not found');
  }

  await context.repositories.entity.delete(input.id);
};
```

### 3. Create Aggregator

**File:** `src/usecases/{entity-name}/index.ts`

```typescript
import { createEntity } from './create-{entity}.js';
import { getAllEntities } from './get-all-{entities}.js';
import { getEntityById } from './get-{entity}-by-id.js';
import { updateEntity } from './update-{entity}.js';
import { deleteEntity } from './delete-{entity}.js';

export const initEntityUsecases = () => {
  return {
    create: createEntity,
    getAll: getAllEntities,
    getById: getEntityById,
    update: updateEntity,
    delete: deleteEntity,
  };
};

export type EntityUsecases = ReturnType<typeof initEntityUsecases>;
```

### 4. Wire to Root Use Cases

**File:** `src/usecases/index.ts`

Add:
```typescript
import { initEntityUsecases } from './{entity-name}/index.js';

export const initUsecases = () => {
  return {
    // ... existing
    entity: initEntityUsecases(),
  };
};
```

## Key Rules

- Function name: `{operation}{Entity}` (camelCase)
- First parameter always `AppContext`
- Validate input with Joi
- Check authentication: `context.auth.isAuthenticated`
- Use domain error classes
- Access repositories via `context.repositories`
- Return domain entities (never DTOs)

## Validation Pattern

```typescript
function validateInput(input: InputType) {
  const schema = Joi.object<InputType>({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).required(),
    age: Joi.number().integer().min(0).optional(),
  });

  const { error } = schema.validate(input);
  if (error) {
    throw new BadUserInputError(error.message);
  }
}
```

## Error Classes

- `BadUserInputError` - Invalid input
- `UnauthorizedError` - Not authenticated
- `ForbiddenError` - Not authorized
- `NotFoundError` - Resource not found
- `BadRequestError` - General bad request

## Checklist

- [ ] All CRUD use cases implemented
- [ ] Input validation with Joi
- [ ] Authentication checks where needed
- [ ] Error handling with domain errors
- [ ] Aggregator created
- [ ] Added to root use case aggregator
- [ ] Types exported properly

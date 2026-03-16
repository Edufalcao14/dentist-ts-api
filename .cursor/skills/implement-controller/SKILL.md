---
name: implement-controller
description: Implements REST controller layer for HTTP handling following Onion Architecture. Use when creating controllers, REST endpoints, or when the user asks to implement API endpoints for an entity.
---

# Implement Controller Layer

Implements the REST controller (HTTP/presentation) layer following the project's Onion Architecture patterns.

## When to Use

- User asks to create a controller
- Need to add REST API endpoints
- Implementing HTTP handlers for an entity
- Keywords: "controller", "REST", "API", "endpoint", "HTTP"

## Implementation Steps

### 1. Create REST Directory Structure

```bash
mkdir -p src/rest/{entity-name}/controllers
mkdir -p src/rest/{entity-name}/dtos
mkdir -p src/rest/{entity-name}/mappers
```

### 2. Create DTOs

**Response DTO:** `src/rest/{entity-name}/dtos/{entity}.dto.ts`

```typescript
import { z } from 'zod';

export const EntityDtoSchema = z.object({
  id: z.string().uuid(),
  field: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EntityDto = z.infer<typeof EntityDtoSchema>;
```

**Create DTO:** `src/rest/{entity-name}/dtos/create-{entity}.dto.ts`

```typescript
import { z } from 'zod';

export const CreateEntityDtoSchema = z.object({
  field: z.string().min(1),
});

export type CreateEntityDto = z.infer<typeof CreateEntityDtoSchema>;
```

**Update DTO:** `src/rest/{entity-name}/dtos/update-{entity}.dto.ts`

```typescript
import { z } from 'zod';

export const UpdateEntityDtoSchema = z.object({
  field: z.string().min(1).optional(),
});

export type UpdateEntityDto = z.infer<typeof UpdateEntityDtoSchema>;
```

### 3. Create DTO Mapper

**File:** `src/rest/{entity-name}/mappers/{entity}.mapper.ts`

```typescript
import type { Entity } from '@/entities/{entity}/{entity}.js';
import type { EntityDto } from '../dtos/{entity}.dto.js';

export const toDto = (entity: Entity): EntityDto => {
  return {
    id: entity.id,
    field: entity.field,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
};
```

### 4. Create Controller (All Methods in ONE File)

**File:** `src/rest/{entity-name}/controllers/{entity}.controller.ts`

```typescript
import type { Request, Response } from 'express';
import type { Usecases } from '@/usecases/index.js';
import type { AppContext } from '@/libs/context/index.js';
import type { EntityDto } from '../dtos/{entity}.dto.js';
import type { CreateEntityDto } from '../dtos/create-{entity}.dto.js';
import type { UpdateEntityDto } from '../dtos/update-{entity}.dto.js';
import { toDto } from '../mappers/{entity}.mapper.js';

export const initEntityControllers = (usecases: Usecases) => {
  const create = async (
    req: Request<any, EntityDto, CreateEntityDto> & { context: AppContext },
    res: Response<EntityDto>,
  ) => {
    const entity = await usecases.entity.create(req.context, {
      field: req.body.field,
    });
    const entityDto = toDto(entity);
    res.status(201).json(entityDto);
  };

  const getAll = async (
    req: Request<any, EntityDto[]> & { context: AppContext },
    res: Response<EntityDto[]>,
  ) => {
    const entities = await usecases.entity.getAll(req.context);
    const entitiesDto = entities.map(toDto);
    res.json(entitiesDto);
  };

  const getById = async (
    req: Request<{ id: string }, EntityDto> & { context: AppContext },
    res: Response<EntityDto>,
  ) => {
    const entity = await usecases.entity.getById(req.context, {
      id: req.params.id || '',
    });

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' } as any);
    }

    const entityDto = toDto(entity);
    res.json(entityDto);
  };

  const update = async (
    req: Request<{ id: string }, EntityDto, UpdateEntityDto> & { context: AppContext },
    res: Response<EntityDto>,
  ) => {
    const entity = await usecases.entity.update(req.context, {
      id: req.params.id || '',
      field: req.body.field,
    });
    const entityDto = toDto(entity);
    res.json(entityDto);
  };

  const deleteEntity = async (
    req: Request<{ id: string }> & { context: AppContext },
    res: Response<void>,
  ) => {
    await usecases.entity.delete(req.context, {
      id: req.params.id || '',
    });
    res.status(204).send();
  };

  return {
    create,
    getAll,
    getById,
    update,
    delete: deleteEntity,
  };
};

export type EntityControllers = ReturnType<typeof initEntityControllers>;
```

### 5. Create Routes

**File:** `src/rest/{entity-name}/routes.ts`

```typescript
import { Router } from 'express';
import { initEntityControllers } from './controllers/{entity}.controller.js';
import type { Usecases } from '@/usecases/index.js';

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

### 6. Wire to Root Routes

**File:** `src/rest/routes.ts`

Add:
```typescript
import { initEntityRoutes } from './{entity-name}/routes.js';

export const createRestRoutes = (baseContext: BaseContext): Router => {
  const router = Router();
  const usecases = initUsecases();

  router.use(createAuthMiddleware(baseContext));

  // Add your entity routes
  router.use('/{entities}', initEntityRoutes(usecases));

  return router;
};
```

### 7. Update OpenAPI Specification

**File:** `src/docs/api/openapi.yaml`

Add the new endpoints to document your API:

```yaml
paths:
  /api/{entities}:
    get:
      summary: Get all entities
      description: Returns the list of all entities
      operationId: getAllEntities
      tags:
        - Entities
      responses:
        '200':
          description: List of entities
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Entity'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      summary: Create a new entity
      description: Creates a new entity
      operationId: createEntity
      tags:
        - Entities
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateEntity'
      responses:
        '201':
          description: Entity created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Entity'
        '400':
          description: Invalid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/{entities}/{id}:
    get:
      summary: Get an entity by ID
      description: Returns the details of a specific entity
      operationId: getEntityById
      tags:
        - Entities
      parameters:
        - name: id
          in: path
          required: true
          description: Entity ID (UUID)
          schema:
            type: string
            format: uuid
            example: 123e4567-e89b-12d3-a456-426614174000
      responses:
        '200':
          description: Entity found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Entity'
        '404':
          description: Entity not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    put:
      summary: Update an entity
      description: Updates an existing entity
      operationId: updateEntity
      tags:
        - Entities
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: Entity ID (UUID)
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateEntity'
      responses:
        '200':
          description: Entity updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Entity'
        '400':
          description: Invalid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Entity not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    delete:
      summary: Delete an entity
      description: Deletes an entity
      operationId: deleteEntity
      tags:
        - Entities
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: Entity ID (UUID)
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Entity deleted successfully
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Entity not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

**Add schemas in the components section:**

```yaml
components:
  schemas:
    Entity:
      type: object
      required:
        - id
        - field
        - createdAt
        - updatedAt
      properties:
        id:
          type: string
          format: uuid
          description: Entity ID
          example: 123e4567-e89b-12d3-a456-426614174000
        field:
          type: string
          description: Entity field
          example: "value"
        createdAt:
          type: string
          format: date-time
          description: Creation timestamp
          example: "2024-01-01T00:00:00.000Z"
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp
          example: "2024-01-01T00:00:00.000Z"

    CreateEntity:
      type: object
      required:
        - field
      properties:
        field:
          type: string
          description: Entity field
          example: "value"

    UpdateEntity:
      type: object
      properties:
        field:
          type: string
          description: Entity field
          example: "value"
```

**Key points for OpenAPI:**
- Use `security: - bearerAuth: []` for protected endpoints (create, update, delete)
- Include all HTTP status codes (200, 201, 204, 400, 401, 404, 500)
- Tag endpoints with the entity name (plural, capitalized)
- Use UUID format for ID parameters
- Use ISO 8601 datetime format for timestamps
- Add clear descriptions and examples

## Key Rules

- ALL controller methods in ONE file
- Factory pattern: `init{Entity}Controllers`
- Pass `req.context` to use cases
- Map DTOs to use case inputs
- Map entities to DTOs using mapper
- Use correct HTTP status codes
- Handle 404 explicitly for getById
- Export types using `ReturnType`

## HTTP Status Codes

- `200 OK` - Successful GET, PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Checklist

- [ ] DTOs created (entity, create, update)
- [ ] DTO mapper with `toDto` function
- [ ] Controller with all methods in ONE file
- [ ] Routes configuration
- [ ] Added to root routes
- [ ] Types exported properly
- [ ] Status codes correct
- [ ] OpenAPI specification updated with:
  - [ ] All endpoints (GET, POST, PUT, DELETE)
  - [ ] Entity schemas (Entity, CreateEntity, UpdateEntity)
  - [ ] Security annotations for protected endpoints
  - [ ] All response codes documented

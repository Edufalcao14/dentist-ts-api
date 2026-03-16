---
name: add-new-feature
description: Implements complete feature across all layers (domain, repository, use case, REST) following Onion Architecture. Use when adding new entities, complete CRUD features, or when the user asks to implement a new resource.
---

# Add New Feature - Complete Implementation

Implements a complete feature across all architectural layers following the project's Onion Architecture.

## When to Use

- User asks to add a new entity/resource
- Need complete CRUD implementation
- Building a new feature from scratch
- Keywords: "add feature", "new entity", "new resource", "implement CRUD"

## Prerequisites

1. Understand the entity's fields and relationships
2. Plan the database schema

## Step-by-Step Implementation

### Step 0: Database Schema (If New Entity)

**Update Prisma schema:** `prisma/schema.prisma`

```prisma
model Entity {
  id        String   @id @default(uuid())
  field     String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("entities")
}
```

**Create and apply migration:**

```bash
npm run db:migrate:dev
```

This will create the migration and regenerate Prisma client.

### Step 1: Domain Layer

**Create entity:** `src/entities/{entity-name}/{entity-name}.ts`

```typescript
export interface Entity {
  id: string;
  field: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Create input interfaces:**
- `src/entities/{entity-name}/create-{entity}-input.ts`
- `src/entities/{entity-name}/update-{entity}-input.ts`

### Step 2: Repository Layer

Execute the `implement-repository` skill:

1. Create mapper: `repositories/{entity}/mappers/{entity}.mapper.ts`
2. Create operations: `create.ts`, `get-all.ts`, `get-by-id.ts`, `update.ts`, `delete.ts`
3. Create aggregator: `repositories/{entity}/index.ts`
4. Wire to `repositories/index.ts`

### Step 3: Use Case Layer

Execute the `implement-usecase` skill:

1. Create use cases: `create-{entity}.ts`, `get-all-{entities}.ts`, etc.
2. Add input validation with Joi
3. Add authentication checks
4. Create aggregator: `usecases/{entity}/index.ts`
5. Wire to `usecases/index.ts`

### Step 4: REST Layer

Execute the `implement-controller` skill:

1. Create DTOs: `{entity}.dto.ts`, `create-{entity}.dto.ts`, `update-{entity}.dto.ts`
2. Create DTO mapper: `rest/{entity}/mappers/{entity}.mapper.ts`
3. Create controller: `rest/{entity}/controllers/{entity}.controller.ts`
4. Create routes: `rest/{entity}/routes.ts`
5. Wire to `rest/routes.ts`

### Step 5: API Documentation

Update OpenAPI specification in `src/docs/api/openapi.yaml`:

1. Add all endpoints under `paths:` section
2. Add entity schemas under `components/schemas:` section
3. Include security annotations for protected endpoints
4. Document all response codes (200, 201, 204, 400, 401, 404, 500)

## Implementation Order

Always implement in this order:

```
0. Database Schema (Prisma) - Define data structure
   ↓
1. Domain (entities) - Core business objects
   ↓
2. Repository - Data access
   ↓
3. Use Case - Business logic
   ↓
4. REST - HTTP layer
   ↓
5. API Documentation - OpenAPI specification
```

This order ensures:
- Database is ready before creating repositories
- Dependencies flow correctly (outer layers depend on inner layers)
- Each layer has what it needs from previous layers

## Quick Checklist

### Database Layer
- [ ] Prisma schema model added
- [ ] Migration created (`npm run db:migrate:dev`)
- [ ] Prisma client regenerated
- [ ] Migration tested successfully

### Domain Layer
- [ ] Entity interface created
- [ ] Input interfaces created

### Repository Layer
- [ ] Mapper with `toEntity` created
- [ ] CRUD operations implemented
- [ ] Aggregator created
- [ ] Wired to root repository

### Use Case Layer
- [ ] CRUD use cases implemented
- [ ] Input validation added
- [ ] Authentication checks added
- [ ] Aggregator created
- [ ] Wired to root use cases

### REST Layer
- [ ] DTOs created (response, create, update)
- [ ] DTO mapper created
- [ ] Controller created (all methods in one file)
- [ ] Routes created
- [ ] Wired to root routes

### API Documentation
- [ ] OpenAPI paths added for all endpoints
- [ ] Entity schemas added (Entity, CreateEntity, UpdateEntity)
- [ ] Security annotations added for protected endpoints
- [ ] All response codes documented

## Naming Conventions

- **Files:** kebab-case (`create-user.ts`)
- **Types/Interfaces:** PascalCase (`CreateUserInput`)
- **Functions:** camelCase (`createUser`)
- **Factory functions:** `init{Entity}{Type}` (e.g., `initUserRepositories`)

## Example: Adding "Order" Entity

```bash
# 0. Database Schema
# Edit: prisma/schema.prisma (add Order model)
npm run db:migrate:dev
# Name: add_order_table

# 1. Domain
touch src/entities/order/order.ts
touch src/entities/order/create-order-input.ts

# 2. Repository
mkdir -p src/repositories/order/mappers
# Create: mapper, create.ts, get-all.ts, get-by-id.ts, update.ts, delete.ts, index.ts

# 3. Use Case
mkdir -p src/usecases/order
# Create: create-order.ts, get-all-orders.ts, get-order-by-id.ts, update-order.ts, delete-order.ts, index.ts

# 4. REST
mkdir -p src/rest/order/{controllers,dtos,mappers}
# Create: DTOs, mapper, controller, routes.ts

# 5. API Documentation
# Update: src/docs/api/openapi.yaml
```

## Testing

After implementation:
1. Verify migration applied: Check database structure
2. Test each endpoint with Postman/curl
3. Verify authentication works
4. Test validation errors
5. Check database operations
6. Verify data is persisted correctly

## Common Pitfalls

- ❌ Don't skip the Prisma migration step
- ❌ Don't forget to regenerate Prisma client after schema changes

- ❌ Don't skip layers
- ❌ Don't put business logic in controllers
- ❌ Don't import repositories directly in use cases (use context)
- ❌ Don't pass DTOs to use cases (map to domain inputs)
- ❌ Don't forget to wire up aggregators

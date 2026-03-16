# Cursor Skills for CDesign Backend

This directory contains Cursor AI skills that automate common implementation tasks for this backend application following **Onion Architecture**.

## Available Skills

### 1. `implement-repository`
**Purpose:** Implements repository (data access) layer for database operations

**Use when:**
- Creating new repositories
- Adding database operations for an entity
- Implementing data access patterns

**What it does:**
- Creates mapper for Prisma ↔ Domain Entity conversion
- Implements CRUD operations (create, getAll, getById, update, delete)
- Creates repository aggregator
- Wires to root repository

**Trigger keywords:** "repository", "database", "data access", "Prisma"

---

### 2. `implement-usecase`
**Purpose:** Implements use case (business logic) layer

**Use when:**
- Creating business logic for an entity
- Adding application workflows
- Implementing domain operations

**What it does:**
- Implements CRUD use cases
- Adds input validation with Joi
- Adds authentication checks
- Creates use case aggregator
- Wires to root use cases

**Trigger keywords:** "use case", "business logic", "application logic"

---

### 3. `implement-controller`
**Purpose:** Implements REST controller (HTTP) layer

**Use when:**
- Creating REST API endpoints
- Adding HTTP handlers for an entity
- Implementing API routes

**What it does:**
- Creates DTOs with Zod schemas
- Creates DTO mapper for Entity ↔ DTO conversion
- Implements all controller methods in one file
- Creates routes configuration
- Wires to root routes

**Trigger keywords:** "controller", "REST", "API", "endpoint", "HTTP"

---

### 4. `add-new-feature`
**Purpose:** Implements complete feature across all layers

**Use when:**
- Adding a new entity/resource
- Building complete CRUD functionality
- Implementing end-to-end feature

**What it does:**
- Guides through all layers in correct order
- Provides complete checklist
- Orchestrates other skills
- Ensures proper layer dependencies

**Trigger keywords:** "add feature", "new entity", "new resource", "implement CRUD"

---

## How to Use Skills

### Option 1: Automatic (Recommended)

Cursor AI will automatically detect when to use skills based on your request:

```
You: "Create a repository for the Product entity"
→ Cursor uses `implement-repository` skill

You: "Add use cases for managing orders"
→ Cursor uses `implement-usecase` skill

You: "Implement REST API for the Customer entity"
→ Cursor uses `implement-controller` skill

You: "Add complete CRUD for Tags"
→ Cursor uses `add-new-feature` skill
```

### Option 2: Manual Reference

You can explicitly reference a skill:

```
You: "Use the implement-repository skill to create data access for Categories"
```

## Implementation Order

When adding a new feature, always implement in this order:

```
1. Domain (entities) ← Pure business objects
   ↓
2. Repository ← Data access
   ↓
3. Use Case ← Business logic
   ↓
4. REST ← HTTP layer
```

This ensures dependencies flow correctly (outer layers depend on inner layers).

## Quick Reference

### Adding a Complete Feature

```bash
# 1. Define domain entity
src/entities/entity-name/entity-name.ts

# 2. Use implement-repository skill
# Creates: repositories/entity-name/

# 3. Use implement-usecase skill
# Creates: usecases/entity-name/

# 4. Use implement-controller skill
# Creates: rest/entity-name/
```

### File Structure Created

```
src/
├── entities/entity-name/
│   ├── entity-name.ts
│   ├── create-entity-input.ts
│   └── update-entity-input.ts
├── repositories/entity-name/
│   ├── mappers/
│   │   └── entity.mapper.ts
│   ├── create.ts
│   ├── get-all.ts
│   ├── get-by-id.ts
│   ├── update.ts
│   ├── delete.ts
│   └── index.ts
├── usecases/entity-name/
│   ├── create-entity.ts
│   ├── get-all-entities.ts
│   ├── get-entity-by-id.ts
│   ├── update-entity.ts
│   ├── delete-entity.ts
│   └── index.ts
└── rest/entity-name/
    ├── controllers/
    │   └── entity.controller.ts
    ├── dtos/
    │   ├── entity.dto.ts
    │   ├── create-entity.dto.ts
    │   └── update-entity.dto.ts
    ├── mappers/
    │   └── entity.mapper.ts
    └── routes.ts
```

## Architecture Principles

All skills follow these core principles:

1. **Dependency Flow:** Outer layers depend on inner layers, never reverse
2. **Pure Domain:** Entities have zero external dependencies
3. **Dependency Injection:** All dependencies via `AppContext`
4. **Boundary Mapping:** Convert at layer boundaries (DTO ↔ Entity ↔ Model)
5. **Business Logic in Use Cases:** Not in controllers or repositories

## Related Files

- **Rules:** `.cursor/rules/` - Cursor rules that provide context
- **Architecture Docs:** `src/docs/architecture.md` - Detailed architecture documentation

## Examples

Look at existing implementations for reference:
- **Users:** `src/{repositories,usecases,rest}/users/`
- **Products:** `src/{repositories,usecases,rest}/products/`
- **Articles:** `src/{repositories,usecases,rest}/articles/`

---

**Created:** 2026-02-07  
**Project:** CDesign Backend API  
**Architecture:** Onion Architecture (Clean Architecture)

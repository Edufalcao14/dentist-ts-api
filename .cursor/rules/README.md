# Cursor Rules – Backend

Rules in this folder guide development for this backend (Onion Architecture).

## Rules

| Rule | Description | When it applies |
|------|-------------|-----------------|
| **onion-architecture.mdc** | Core architecture and dependency rules | Always |
| **usecase-pattern.mdc** | Use case format, validation, no types in use case files | `**/usecases/**/*.ts` |
| **repository-pattern.mdc** | Repository structure, mappers, factory pattern | `**/repositories/**/*.ts` |
| **controller-pattern.mdc** | REST controllers, DTOs, routes | `**/rest/**/controllers/*.ts` |
| **adding-new-features.mdc** | Checklist and steps for new entities/features | `**/src/**/*.ts` |

## Principles

1. **Dependencies inward** — Outer layers depend on inner layers only.
2. **Pure domain** — Entities and input types in `src/entities/`; no types defined in use case files.
3. **Dependency injection** — Via `AppContext`.
4. **Mapping at boundaries** — DTO ↔ Entity ↔ Prisma model.
5. **Business logic in use cases** — Not in controllers or repositories.

## Adding a new entity (e.g. Product)

1. **Domain:** `src/entities/product/` (entity + input interfaces).
2. **Repository:** `src/repositories/product/` (mapper + operations + index).
3. **Use case:** `src/usecases/product/` (operations importing from entities, Joi validation, index).
4. **REST:** `src/rest/product/` (DTOs, mapper, controller, routes).
5. **Wire up:** Register in root aggregators and `rest/routes.ts`.

See `adding-new-features.mdc` for the full checklist and patterns.

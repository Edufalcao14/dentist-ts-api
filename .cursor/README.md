# CDesign Backend - Cursor Configuration

This document summarizes the Cursor rules and skills configured for this backend project.

## 📁 Directory Structure

```
backend/.cursor/
├── rules/                          # Cursor Rules (always-on guidance)
│   ├── README.md
│   ├── onion-architecture.mdc      # Core architecture principles (always applied)
│   ├── repository-pattern.mdc      # Repository layer patterns
│   ├── usecase-pattern.mdc         # Use case layer patterns
│   ├── controller-pattern.mdc      # Controller layer patterns
│   └── adding-new-features.mdc     # Complete feature guide
│
└── skills/                         # Cursor Skills (executable workflows)
    ├── README.md
    ├── implement-repository/       # Automates repository creation
    │   └── SKILL.md
    ├── implement-usecase/          # Automates use case creation
    │   └── SKILL.md
    ├── implement-controller/       # Automates controller creation
    │   └── SKILL.md
    └── add-new-feature/            # Orchestrates complete feature
        └── SKILL.md
```

## 🎯 What Each Does

### Cursor Rules (`.cursor/rules/`)

**Purpose:** Provide persistent context and guidance to Cursor AI

**How they work:**
- Always loaded when working on matching files
- Help Cursor understand your architecture
- Provide examples and patterns
- Prevent common mistakes

**Files:**
1. **onion-architecture.mdc** - Core principles (always active)
2. **repository-pattern.mdc** - Activates for `**/repositories/**/*.ts`
3. **usecase-pattern.mdc** - Activates for `**/usecases/**/*.ts`
4. **controller-pattern.mdc** - Activates for `**/rest/**/controllers/*.ts`
5. **adding-new-features.mdc** - Activates for `**/src/**/*.ts`

### Cursor Skills (`.cursor/skills/`)

**Purpose:** Automate repetitive implementation tasks

**How they work:**
- Cursor AI detects when to use them based on your request
- Execute step-by-step workflows
- Generate code following your patterns
- Ensure consistency across implementations

**Skills:**
1. **implement-repository** - Creates data access layer
2. **implement-usecase** - Creates business logic layer
3. **implement-controller** - Creates HTTP/REST layer
4. **add-new-feature** - Orchestrates complete CRUD feature

## 🚀 Usage Examples

### Example 1: Using Rules (Automatic)

When you open a file, relevant rules automatically provide context:

```
# Open: src/repositories/products/create.ts
→ Repository pattern rule activates
→ Cursor knows to use init pattern, mappers, etc.
```

### Example 2: Using Skills (Triggered by Request)

```
You: "Create a repository for the Category entity"
→ Cursor detects keywords: "repository", "create"
→ Uses implement-repository skill
→ Generates all files following patterns

You: "Add complete CRUD for Tags"
→ Cursor detects: "CRUD", "add"
→ Uses add-new-feature skill
→ Orchestrates all layers
```

### Example 3: Complete Feature Flow

```bash
# User request: "Add a Comment entity with CRUD operations"

# Cursor will:
1. Use add-new-feature skill (orchestrator)
2. Create domain entities
3. Use implement-repository skill
   → Creates repositories/comment/
4. Use implement-usecase skill
   → Creates usecases/comment/
5. Use implement-controller skill
   → Creates rest/comment/
```

## 📊 Architecture Overview

All rules and skills enforce **Onion Architecture**:

```
┌──────────────────────────────────┐
│   Infrastructure Layer           │
│  ┌────────────────────────────┐  │
│  │  REST (Controllers, DTOs)  │  │
│  └──────────┬─────────────────┘  │
│             ↓                     │
│  ┌────────────────────────────┐  │
│  │  Use Cases (Business Logic)│  │
│  │  ┌──────────────────────┐  │  │
│  │  │ Entities (Domain)    │  │  │ ← Core
│  │  └──────────────────────┘  │  │
│  └──────────┬─────────────────┘  │
│             ↓                     │
│  ┌────────────────────────────┐  │
│  │  Repositories (Data Access)│  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

## 🔑 Key Principles Enforced

1. **Dependencies flow inward** - Outer layers depend on inner, never reverse
2. **Pure domain** - Entities have zero external dependencies
3. **Dependency injection** - All dependencies via `AppContext`
4. **Boundary mapping** - Convert at layer boundaries
5. **Business logic in use cases** - Not in controllers or repositories

## 📝 Implementation Order

Always implement in this order:

```
1. Domain (entities)      ← Define business objects
   ↓
2. Repository             ← Data access
   ↓
3. Use Case               ← Business logic
   ↓
4. REST                   ← HTTP endpoints
```

## ✅ Benefits

### With Rules:
- ✅ Consistent code structure
- ✅ Automatic pattern enforcement
- ✅ Context-aware suggestions
- ✅ Prevention of anti-patterns

### With Skills:
- ✅ Automated boilerplate generation
- ✅ Faster implementation
- ✅ Reduced errors
- ✅ Consistent naming and structure

## 🎓 Learning Resources

### For Understanding Patterns:
- Read: `.cursor/rules/README.md`
- See: `src/docs/architecture.md`
- Examples: `src/{repositories,usecases,rest}/users/`

### For Using Skills:
- Read: `.cursor/skills/README.md`
- Just ask Cursor naturally:
  - "Create a repository for X"
  - "Add use cases for Y"
  - "Implement REST API for Z"

## 🔄 Workflow

### Adding a New Feature (e.g., "Order")

1. **Create Prisma schema and migration**
   ```bash
   # Add to prisma/schema.prisma
   npm run db:migrate:dev
   ```

2. **Define domain entity**
   ```typescript
   // src/entities/order/order.ts
   export interface Order { ... }
   ```

3. **Ask Cursor:**
   ```
   "Add complete CRUD operations for the Order entity"
   ```

4. **Cursor will:**
   - Use `add-new-feature` skill
   - Create repository layer
   - Create use case layer
   - Create REST layer
   - Wire everything together

5. **Test the endpoints** 🚀

## 📚 Additional Notes

### Viewing Hidden Files
Press `Cmd + Shift + .` in Cursor to show/hide the `.cursor` directory.

### Editing Rules/Skills
All files are markdown - edit them directly if you need to customize patterns.

### Adding New Patterns
- Add to rules for guidance
- Add to skills for automation

---

**Created:** 2026-02-07  
**Project:** CDesign Backend API  
**Architecture:** Onion Architecture (Clean Architecture)  
**AI Agent:** Cursor with Claude Sonnet 4.5

# Use Case Pattern Audit

Against rule: **backend/.cursor/rules/usecase-pattern.mdc**

Rules: (1) No types in use case files — all input types in `src/entities/`. (2) Imports order: Joi, AppContext, entity/input from entities, errors. (3) First line in body: `validateInput(input);` with Joi. (4) Private `validateInput` at bottom, schema inside it.

---

## ✅ Compliant

| File | Notes |
|------|--------|
| `usecases/users/create-user.ts` | Reference implementation. Input from entities, Joi first, validateInput first, schema inside validateInput. |
| `usecases/articles/get-all-articles.ts` | Input from entities, Joi first, validateInput first, schema inside validateInput. |
| `usecases/auth/sign-in.ts` | Input from entities (`SignInInput`), validateInput with Joi. Import order: Joi is 2nd (Context 1st). |
| `usecases/products/add-tag.ts` | Input from entities (`AddTagInput`), Joi first, validateInput after auth. |

---

## ❌ Violations

### 1. Types defined in use case file (must move to `src/entities/`)

| File | Type to move | Target entity path |
|------|--------------|--------------------|
| `articles/create-article.ts` | `CreateArticleInput` | `entities/article/create-article-input.ts` |
| `articles/update-article.ts` | `UpdateArticleInput` | `entities/article/update-article-input.ts` |
| `articles/get-article-by-id.ts` | `GetArticleByIdInput` | `entities/article/get-article-by-id-input.ts` |
| `articles/get-article-by-slug.ts` | `GetArticleBySlugInput` | `entities/article/get-article-by-slug-input.ts` |
| `articles/delete-article.ts` | `DeleteArticleInput` | `entities/article/delete-article-input.ts` |
| `article-categories/delete-article-category.ts` | `DeleteArticleCategoryInput` | `entities/article-category/delete-article-category-input.ts` |
| `article-categories/get-article-category-by-id.ts` | `GetArticleCategoryByIdInput` | `entities/article-category/get-article-category-by-id-input.ts` |
| `auth/refresh-tokens.ts` | `RefreshTokenInput` | `entities/auth/refresh-token-input.ts` |
| `users/get-user-by-id.ts` | `GetUserByIdInput` | `entities/user/get-user-by-id-input.ts` |
| `products/get-product-by-id.ts` | `GetProductByIdInput` | `entities/product/get-product-by-id-input.ts` |
| `products/delete-product.ts` | `DeleteProductInput` | `entities/product/delete-product-input.ts` |
| `products/create-product.ts` | `ProductImageUpload`, `CreateProductUseCaseInput` | `entities/product/` |
| `products/update-product.ts` | `UpdateProductUseCaseInput` | `entities/product/update-product-input.ts` |
| `products/add-product-image.ts` | `AddProductImageInput` | `entities/product/add-product-image-input.ts` |
| `product-estimations/create-product-estimation.ts` | `CreateProductEstimationInput` | `entities/product-estimation/create-product-estimation-input.ts` |
| `product-estimations/get-product-estimation-by-id.ts` | `GetProductEstimationByIdInput` | `entities/product-estimation/get-product-estimation-by-id-input.ts` |
| `product-estimations/update-product-estimation-priority.ts` | `UpdateProductEstimationPriorityInput` | `entities/product-estimation/update-product-estimation-priority-input.ts` |

### 2. No Joi validation (manual checks or none)

| File | Issue |
|------|--------|
| `articles/create-article.ts` | No Joi; manual `if (!input.title...)` and `throw new Error` / `BadUserInputError`. Should use validateInput + Joi. |
| `articles/update-article.ts` | No Joi; manual checks. Same. |
| `article-categories/create-article-category.ts` | No Joi; manual `if (!input.name...)`. Input from entities OK. |
| `article-categories/update-article-category.ts` | No Joi; manual checks. Input from entities OK. |
| `article-categories/delete-article-category.ts` | Defines input in file; no Joi for `id`. |
| `article-categories/get-article-category-by-id.ts` | Defines input in file; no Joi for `id`. |
| `articles/get-article-by-id.ts` | Defines input in file; manual `if (!input.id)` instead of Joi. |
| `articles/get-article-by-slug.ts` | Same for slug. |
| `articles/delete-article.ts` | Same for id. |
| `users/get-user-by-id.ts` | Same for id. |
| `products/get-product-by-id.ts` | Same for id. |
| `products/delete-product.ts` | Same for id. |

### 3. Import order

| File | Issue |
|------|--------|
| `auth/refresh-tokens.ts` | AppContext before Joi; should be Joi first. |
| `auth/sign-in.ts` | AppContext before Joi; should be Joi first. |

### 4. Use case imports from repository (forbidden)

| File | Issue |
|------|--------|
| `articles/update-article.ts` | Imports `UpdateArticleData` from `@/repositories/articles/update.js`. Use case must not import from repository layer. |

---

## No input / read-only (pattern N/A or minimal)

- `users/get-all-users.ts` — No input; OK.
- `products/get-all-products.ts` — Check if it has optional input; if not, OK.
- `article-categories/get-all-article-categories.ts` — No input; OK.

---

## Summary

- **Compliant:** 4 use cases (create-user, get-all-articles, sign-in, add-tag).
- **Move types to entities:** 17 use case files.
- **Add Joi validateInput:** multiple (articles, article-categories, users get-by-id, products get-by-id/delete, etc.).
- **Fix import order:** auth (refresh-tokens, sign-in).
- **Remove repository import:** articles/update-article.ts.

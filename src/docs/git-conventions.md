# Git Commit Conventions & Hooks

This document explains the git commit message conventions and the pre-commit hooks configured in this project.

## Table of Contents

- [Commit Message Format](#commit-message-format)
- [Commit Types](#commit-types)
- [Commit Message Linter](#commit-message-linter)
- [Pre-commit Hook (ESLint)](#pre-commit-hook-eslint)
- [How to Use](#how-to-use)
- [Configuration](#configuration)

## Commit Message Format

This project follows the [Angular Commit Message Conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit). All commit messages must follow this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Format Rules

1. **Type** (required): Must be one of the allowed commit types (see below)
2. **Scope** (optional): The area of the codebase affected
3. **Subject** (required): 
   - Brief description of the change
   - Use imperative mood ("add" not "added" or "adds")
   - First letter lowercase
   - No period at the end
   - Minimum 10 characters, maximum 100 characters
4. **Body** (optional): Detailed explanation of the change
5. **Footer** (optional): Reference to issues, breaking changes, etc.

### Examples

✅ **Valid commits:**
```
feat: add user authentication
fix: resolve memory leak in data processing
docs: update API documentation
feat(auth): add JWT token refresh
fix(api): handle null pointer exception in user controller
```

❌ **Invalid commits:**
```
added new feature          # Missing type
FEAT: add feature          # Type should be lowercase
feat: add.                 # Subject too short and ends with period
feat: Added new feature    # Should use imperative mood
```

## Commit Types

The following commit types are allowed in this project:

| Type | Description | Emoji |
|------|-------------|-------|
| `feat` | A new feature | ✨ |
| `fix` | A bug fix | 🐛 |
| `docs` | Documentation changes | 📚 |
| `style` | Code style changes (formatting, etc; no code change) | 🎨 |
| `refactor` | Code refactoring (no functional change) | ♻️ |
| `perf` | Performance improvements | ⚡ |
| `test` | Adding or updating tests | 🧪 |
| `chore` | Maintenance tasks, dependency updates, etc. | 🧹 |
| `ci` | CI/CD related changes | 🔄 |
| `build` | Changes that affect the build system | 🏗️ |
| `security` | Security-related changes | 🔐 |

### When to Use Each Type

- **feat**: Use when adding new functionality or features
- **fix**: Use when fixing bugs or errors
- **docs**: Use when updating documentation files (README, comments, etc.)
- **style**: Use for code formatting, missing semicolons, etc. (no logic change)
- **refactor**: Use when restructuring code without changing functionality
- **perf**: Use when improving performance
- **test**: Use when adding or modifying tests
- **chore**: Use for maintenance tasks, dependency updates, build configs
- **ci**: Use for CI/CD pipeline changes
- **build**: Use for build system or dependency changes
- **security**: Use for security-related patches or improvements

## Commit Message Linter

This project uses [git-commit-msg-linter](https://github.com/legend80s/git-commit-msg-linter) to automatically validate commit messages.

### How It Works

The linter runs automatically via a Git hook (`commit-msg`) when you attempt to commit. If your commit message doesn't follow the conventions, the commit will be rejected with a helpful error message.

### What Gets Validated

- ✅ Commit type is valid
- ✅ Subject length is between 10-100 characters
- ✅ Subject follows formatting rules (lowercase, no period, etc.)
- ✅ Overall message format is correct

### Example Error Messages

If you try to commit with an invalid message:

```bash
$ git commit -m "added feature"
```

You'll see an error like:

```
[git-commit-msg-linter]: ❌ Invalid commit message format!

Expected format: <type>(<scope>): <subject>

Example: feat: add user authentication

Allowed types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, security
```

## Pre-commit Hook (ESLint)

Before each commit, ESLint automatically checks your code for linting errors and code quality issues.

### How It Works

The pre-commit hook runs `npm run lint` before allowing a commit. If ESLint finds any errors, the commit is blocked.

### What Gets Checked

- TypeScript/JavaScript syntax errors
- Code style violations
- Best practices
- Potential bugs
- Unused variables
- Type safety issues

### Running ESLint Manually

You can run ESLint at any time:

```bash
# Check for linting errors
npm run lint

# Auto-fix fixable issues
npm run lint:fix
```

### Fixing Lint Errors Before Committing

If the pre-commit hook fails due to linting errors:

1. **Option 1: Auto-fix** (recommended)
   ```bash
   npm run lint:fix
   git add .
   git commit -m "feat: your message"
   ```

2. **Option 2: Manual fix**
   - Review the ESLint errors
   - Fix them manually
   - Run `npm run lint` to verify
   - Commit again

3. **Option 3: Skip hook** (not recommended, only for emergencies)
   ```bash
   git commit --no-verify -m "feat: your message"
   ```

⚠️ **Warning**: Skipping hooks should be avoided as it bypasses code quality checks.

## How to Use

### Making a Commit

1. **Stage your changes:**
   ```bash
   git add .
   ```

2. **Commit with a proper message:**
   ```bash
   git commit -m "feat: add user authentication endpoint"
   ```

3. **What happens:**
   - Pre-commit hook runs ESLint
   - If ESLint passes, commit-msg hook validates your message
   - If both pass, your commit succeeds
   - If either fails, the commit is rejected

### Multi-line Commit Messages

For more detailed commits:

```bash
git commit -m "feat: add user authentication" -m "Implements JWT-based authentication with refresh tokens. Adds login and register endpoints."
```

### Commit with Scope

Include the scope for better organization:

```bash
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(api): handle database connection errors"
git commit -m "docs(readme): update installation instructions"
```

## Configuration

### Commit Message Linter Configuration

The commit message linter configuration is located at the git repository root:
```
../commitlinterrc.json
```

You can customize:
- Commit types and their descriptions
- Minimum/maximum message length
- Language for error messages
- Example commit messages

See the [git-commit-msg-linter documentation](https://github.com/legend80s/git-commit-msg-linter) for full configuration options.

### ESLint Configuration

ESLint configuration is in `eslint.config.js` at the project root. You can customize:
- Rules and their severity
- File patterns to lint/ignore
- TypeScript-specific rules

### Husky Hooks

Git hooks are managed by [Husky](https://typicode.github.io/husky/) and located in:
```
.husky/
├── pre-commit    # Runs ESLint
└── commit-msg    # Validates commit messages
```

Hooks are automatically set up when you run `npm install` (via the `prepare` script).

## Troubleshooting

### Commit Message Rejected

**Problem**: Your commit message is rejected even though it looks correct.

**Solutions**:
- Check the exact error message for details
- Verify the commit type is one of the allowed types
- Ensure the subject is 10-100 characters
- Make sure the subject starts with a lowercase letter

### ESLint Errors Blocking Commit

**Problem**: ESLint finds errors and blocks your commit.

**Solutions**:
- Run `npm run lint:fix` to auto-fix issues
- Review and fix remaining errors manually
- If you need to bypass (not recommended), use `--no-verify`

### Hook Not Running

**Problem**: Hooks aren't running when you commit.

**Solutions**:
- Ensure Husky is installed: `npm install`
- Verify hooks exist: `ls -la .husky/`
- Make sure hooks are executable: `chmod +x .husky/*`
- Check that the `prepare` script ran: `npm run prepare`

## Best Practices

1. **Write clear, descriptive commit messages**: Future you (and your team) will thank you
2. **Keep commits focused**: One logical change per commit
3. **Fix linting errors immediately**: Don't accumulate technical debt
4. **Use appropriate commit types**: Choose the most specific type that applies
5. **Include scope when helpful**: Makes it easier to understand what part of the codebase changed
6. **Don't skip hooks**: They exist to maintain code quality

## Resources

- [Angular Commit Message Conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [git-commit-msg-linter Documentation](https://github.com/legend80s/git-commit-msg-linter)
- [ESLint Documentation](https://eslint.org/)
- [Husky Documentation](https://typicode.github.io/husky/)


---
name: typescript-check
description: Run TypeScript type checking across projects to catch errors before deployment
---

# TypeScript Type Check Skill

## Overview

Run TypeScript type checking to identify and report type errors before deployment or code review. This skill standardizes the type checking process across multiple projects.

## When to Use

- Before committing code changes
- Before deployment
- When debugging type-related issues
- As part of code review process

## The Process

### Step 1: Identify Project Type

Determine the project type based on the presence of configuration files:

- **Next.js project**: Look for `next.config.mjs` or `next.config.js`
- **Node.js project**: Look for `package.json` with TypeScript dependencies
- **Monorepo**: Look for `workspaces` in root `package.json`

### Step 2: Run Type Check

Execute the appropriate TypeScript check command:

#### For Next.js projects:
```bash
cd "PROJECT_DIR" && npx tsc --noEmit --project tsconfig.json 2>&1 | head -40
```

#### For Node.js projects:
```bash
cd "PROJECT_DIR" && npx tsc --noEmit -p tsconfig.json 2>&1 | head -40
```

#### For monorepo apps:
```bash
cd "PROJECT_DIR/apps/APP_NAME" && npx tsc --noEmit 2>&1 | head -20
```

### Step 3: Analyze Results

- **No errors**: Type check passed
- **Errors found**: Report the errors with file paths and line numbers
- **Partial errors**: If output is truncated, increase the `head` limit or pipe to a file

### Step 4: Report

Provide a summary of:
- Total number of type errors
- Files with the most errors
- Suggested fixes for common errors

## Common Error Patterns

1. **Missing type annotations**: Add explicit types to function parameters
2. **Import errors**: Check import paths and module resolution
3. **Null/undefined errors**: Add null checks or use optional chaining
4. **Generic type errors**: Verify generic type parameters

## Tips

- Run type check after every significant code change
- Use `--noEmit` flag to avoid generating output files
- Pipe to `head` to limit output for quick checks
- For detailed output, remove the `head` command

## Example Output

```
src/components/Header.tsx(15,5): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
src/lib/api.ts(42,10): error TS2345: Argument of type '{ id: string; }' is not assignable to parameter of type 'User'.
```

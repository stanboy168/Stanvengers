# Stanvengers — CLAUDE.md

This file is the primary reference for AI assistants (Claude Code and others) working in this repository. Update it as the project evolves.

## Project Status

**New / empty repository.** No source code has been committed yet. The sections below document conventions and workflows to follow once development begins.

## Repository Info

- **GitHub:** `stanboy168/Stanvengers`
- **Default development branch:** `main`
- **Feature branch convention:** `claude/<slug>` for AI-driven changes, `feature/<slug>` for human-driven changes

## Development Workflow

1. Always develop on a dedicated branch — never commit directly to `main`.
2. Use clear, descriptive commit messages that explain *why* a change was made, not just what.
3. Open a pull request for review before merging to `main`.
4. Push using `git push -u origin <branch-name>`.

## Git Conventions

- Commit message format: `<type>: <short summary>` (e.g. `feat: add hero roster page`, `fix: correct stat calculation`)
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Keep commits atomic — one logical change per commit.

## AI Assistant Guidelines

- **Read this file first** before making any changes to understand current conventions.
- **Do not push to `main`** without explicit user approval.
- **Do not create pull requests** unless explicitly asked by the user.
- **Prefer editing existing files** over creating new ones.
- **Do not add comments** unless the reasoning is non-obvious (hidden constraint, workaround, surprising invariant).
- **Do not add error handling** for scenarios that cannot happen in practice.
- **Keep changes minimal** — implement only what was requested, no speculative refactors.
- When in doubt about scope or approach, ask the user before proceeding.

## Codebase Structure

> To be documented once the project structure is established.

```
Stanvengers/
├── CLAUDE.md          ← this file
└── (project files to be added)
```

## Tech Stack

> To be documented once the stack is chosen.

## Running the Project

> To be documented once the project is set up.

## Testing

> To be documented once tests are established.

## Environment Variables

> To be documented once environment configuration is defined.

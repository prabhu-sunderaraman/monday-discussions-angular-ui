# Project Guidance for Claude

This is an Angular v21 application. See [tech-stack.md](.claude/context/tech-stack.md).

## Rules — MUST be followed when generating code

**Whenever you generate code, you MUST refer to and comply with ALL of the rule files below.** Read the relevant rule files before writing code, and ensure the generated code adheres to every applicable rule.

- [accessibility.md](.claude/rules/accessibility.md) — WCAG 2.1 AA compliance for HTML elements.
- [architecture.md](.claude/rules/architecture.md) — overall application architecture.
- [coding-standards.md](.claude/rules/coding-standards.md) — TypeScript rules, file size limits, naming conventions, test file co-location.
- [components-services-state.md](.claude/rules/components-services-state.md) — standalone components, signals, service and state conventions.
- [error-handling.md](.claude/rules/error-handling.md) — HTTP interceptors, error logging and normalization.
- [i18n.md](.claude/rules/i18n.md) — no hardcoded strings, text constants, English-only, Angular pipes.
- [logging.md](.claude/rules/logging.md) — no `console.*`, use `LoggingService`.
- [security.md](.claude/rules/security.md) — security practices.
- [storage.md](.claude/rules/storage.md) — all storage access through `StorageService`.
- [styling.md](.claude/rules/styling.md) — SCSS theming (primitives, semantic, themes), `ThemeService`.
- [testing.md](.claude/rules/testing.md) — `TestBed`, `describe`/`it`, what to unit test.

## Context

- [tech-stack.md](.claude/context/tech-stack.md) — libraries and versions.
- [requirements.md](.claude/context/requirements.md) — project requirements.
- [ai-journal.md](.claude/context/ai-journal.md) — running journal/notes.

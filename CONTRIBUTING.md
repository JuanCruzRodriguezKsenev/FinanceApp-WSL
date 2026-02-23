# 🛠️ Contributing & Development Guidelines - Finance App 3.0

This document defines the standards for maintaining a clean, professional, and resilient codebase. Adherence to these rules is mandatory to ensure the stability of the enterprise architecture.

---

## 🌿 1. Branching Strategy

We follow a simplified **Gitflow** model to ensure production stability:

-   **`main`**: Production-ready code. Only merged from `develop`.
-   **`develop`**: Main integration branch. All features must be merged here first.
-   **`feat/*`**: New features or enhancements.
-   **`fix/*`**: Bug fixes.
-   **`chore/*`**: Maintenance, dependencies, or configuration tasks.

### Workflow:
1. Create a branch from `develop`: `git checkout -b feat/my-feature`.
2. Commit following the convention below.
3. Open a Pull Request (PR) to `develop`.
4. After approval and merge, `develop` is synced to `main` for releases.

---

## 📝 2. Commit Message Convention

We use **Conventional Commits** to generate automated changelogs and maintain a readable history.

**Format:** `<type>(<scope>): <description>`

-   **`feat`**: A new feature (e.g., `feat(auth): add google oauth2 support`).
-   **`fix`**: A bug fix (e.g., `fix(db): resolve connection leak in serverless`).
-   **`docs`**: Documentation only changes.
-   **`style`**: Changes that do not affect the meaning of the code (white-space, formatting).
-   **`refactor`**: A code change that neither fixes a bug nor adds a feature.
-   **`perf`**: A code change that improves performance.
-   **`test`**: Adding missing tests or correcting existing tests.
-   **`chore`**: Changes to the build process or auxiliary tools.

---

## 🏗️ 3. Architectural Mandates

The project follows a **Vertical Slice Architecture**.

1.  **Domain Isolation**: Logic, UI, and schemas must live inside `src/features/[feature-name]`.
2.  **Result Pattern**: Every Server Action **must** return a functional `Result<T, E>` POJO.
    -   *Rule:* No classes or methods in the return value to ensure RSC serialization.
3.  **Distributed Resilience**: External calls (DB, APIs) must be wrapped in a `CircuitBreaker`.
    -   *Rule:* Use the `CircuitBreakerFactory` with Redis/Upstash adapter for production.
4.  **Semantic Styling**: No Utility-first CSS (Tailwind).
    -   *Rule:* Use **CSS Modules** and semantic variables.
5.  **Internationalization (i18n)**: Use Server-Side dictionaries in `src/shared/dictionaries`.

---

## 🛡️ 4. Security & Privacy (PII)

Financial data is sensitive.
-   **PII Masking**: Never log raw CBUs, CVUs, emails, or passwords.
-   **Logger**: Always use `src/shared/lib/logger`. It contains the redaction layer.
-   **Secrets**: Use `.env.local`. Never commit `.env` files.

---

## ✅ 5. Development Definition of Done (DoD)

Before merging a PR, ensure:
1.  **TypeScript**: No errors (`npm run type-check`).
2.  **Linting**: Follows the project style (`npm run lint`).
3.  **Testing**: All tests pass (`npm run test`).
4.  **Build**: The project builds successfully (`npm run build`).
5.  **Documentation**: `ARCHITECTURE.md` is updated if infrastructure changes.

---

**Antigravity AI** | February 2026

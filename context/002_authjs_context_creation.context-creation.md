# Auth.js integration — context / implementation brief

## Purpose

This document provides the full context and step-by-step instructions for an automated agent (or human) to integrate Auth.js-based authentication into the GuardianGate Next.js project and implement styled login and signup pages that follow the project's existing UI system.

## Scope

- Integrate Auth.js (server-side auth) with the Next.js app (app router).
- Add a login page and signup page consistent with the project's styling and UI components found under `src/components/ui`.
- Provide API route(s) or route handlers to handle sign-in, sign-up, callbacks, and session management.
- Document environment variables, files to modify/create, tests to add, and verification steps.

## Success criteria / Acceptance tests

1. Visiting `/login` shows a login form matching project styles and uses existing `Button`, `Input`, `card` components.
2. Visiting `/signup` shows a signup form matching project styles and creates a user account (via chosen provider or credentials) and authenticates the user.
3. After a successful login/signup the user receives a valid session (cookie or JWT) and can access a protected route that requires auth (e.g. a simple `/dashboard` placeholder).
4. Sign-out works and clears the session.

## Contract (minimal)

- Inputs: email/password from the signup/login form (or OAuth provider redirects).
- Outputs: on success — 200/redirect to post-login route; on failure — form-level errors with reasons.
- Data shapes:
  - Signup request body: { email: string, password: string, name?: string }
  - Login request body (Credentials): { email: string, password: string }
  - Session object: { user: { id: string, email: string, name?: string }, expires: string }
- Error modes: invalid credentials, existing email on signup, missing environment variables, DB errors.

## Files to create (recommended)

Note: these are implementation suggestions matching the Next.js 13 app router layout used in this repo.

- src/app/login/page.tsx — Client page component rendering the login form and calling the sign-in API.
- src/app/signup/page.tsx — Client page component rendering the signup form and calling sign-up API.
- src/app/(auth)/signout/route.ts (or similar) — optional sign-out route to redirect after signout.
- src/app/api/auth/[...auth]/route.ts — Auth.js route handler for Next.js app router (catch-all for auth requests).
- src/lib/auth.ts — central Auth.js configuration (providers, adapter, callbacks).
- src/lib/server/db.ts or prisma client (if using DB) — small module for DB connection/adapters.

## Dependencies

Recommended packages (Auth.js-first approach):

- @auth/core — core Auth.js runtime
- @auth/nextjs — Next.js adapter (if available in your Auth.js distribution)
- optionally: @next-auth/prisma-adapter or an Auth.js compatible adapter (Prisma / Mongo / TypeORM) if you persist users
- bcrypt or argon2 — for password hashing if using Credentials provider

## Install (example)

Install the chosen packages and a DB adapter if needed. If using npm:

npm install @auth/core @auth/nextjs bcrypt

If you choose Prisma:

npm install prisma @prisma/client @next-auth/prisma-adapter

## Environment variables (required)

- AUTH_SECRET — random secret for signing cookies/JWTs
- DATABASE_URL — database connection string (if using a DB)
- GITHUB_ID, GITHUB_SECRET (or other OAuth provider credentials) — only if you enable OAuth providers
- NEXTAUTH_URL — base URL for callbacks (helpful in some environments)

## Implementation notes & steps

1. Choose providers

   - For a simple first pass implement a Credentials provider so signup/login can be done with email + password.
   - Optionally add OAuth providers (GitHub, Google) and place provider credentials into env.

2. Database & user model

   - If you want persisted users, add a database (Prisma recommended). Create a `User` model with fields: id, name, email(unique), passwordHash, createdAt.
   - Create migrations.

3. Auth.js config

   - Create `src/lib/auth.ts` that exports a configured Auth.js handler using configured providers and (optionally) an adapter.
   - Ensure AUTH_SECRET is used and session strategy configured (jwt vs database sessions).

4. API route for Auth.js

   - Add route at `src/app/api/auth/[...auth]/route.ts` that imports the Auth.js handler and passes requests to it.

5. Signup flow (if using Credentials provider)

   - Create POST endpoint `src/app/api/auth/signup/route.ts` that validates input, checks for existing email, hashes password, creates user in DB, then calls signIn or returns success so client can call sign-in.

6. Login page

   - Create `src/app/login/page.tsx` as a client component.
   - Use existing design components: `src/components/ui/input.tsx`, `button.tsx`, and `card.tsx` for consistent styling.
   - On submit call Auth.js signIn helper or POST credentials to `api/auth/callback/credentials` (depending on integration) — keep UX simple: show loading state and inline errors.

7. Signup page

   - Create `src/app/signup/page.tsx` similar to the login page.
   - Validate on client, show helpful messages, then call `api/auth/signup` to create the account.

8. Protecting routes

   - Add a small example server-side protected route: `src/app/dashboard/page.tsx` that checks for a session on the server and redirects to `/login` if none.

9. Client session access
   - Use the Auth.js client helpers (or fetch a session API) to display the logged-in user in `src/components/header.tsx` and show signout button.

## Edge cases to handle

- Empty/invalid email or password
- Duplicate email at signup
- Rate limiting or brute-force protection (note for later enhancement)
- Email case normalization and trimming
- Password hash algorithm and migration plan

## Tests & QA

- Unit tests for signup API: happy path + duplicate email.
- Unit tests for login API: correct credentials and wrong password.
- Integration smoke: start dev server, create account, login, visit protected page.

## Security notes

- Never return password hashes from any API.
- Ensure AUTH_SECRET and any OAuth secrets are stored in environment variables and never committed.
- Use secure cookie attributes and proper SameSite settings (Auth.js handles this by default if configured correctly).

## Developer hints (matching project style)

- Reuse `src/components/ui` primitives for consistent visuals.
- Keep login/signup pages small and focused — input fields, form validation, error UI, and helpful links (forgot password, sign up / sign in toggle).

## Verification checklist for reviewer

1. Run dev server: app builds and shows `/login`.
2. Signup creates a new user and logs them in by redirect.
3. Dashboard or a protected route is accessible only while logged in.
4. Signout clears session and redirects to `/login`.

## Follow-ups (nice-to-have)

- Add email verification and password reset flows.
- Add rate limiting on auth endpoints.
- Add tests for session expiry and refresh.

## Notes

This document assumes a Next.js app-router project structure (which matches the current repo). If the implementation chooses a different storage (e.g. no DB), document that choice and its tradeoffs.

---

Created-by: automated instruction generator

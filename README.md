# Next + Prisma + tRPC starter for Railway

A typed full-stack app on Next 16, React 19, Prisma 7 and tRPC 11, with Postgres.

## Why this exists

The Next Prisma tRPC template on Railway deploys a repository last touched in
May 2023:

```json
"next": "^13.0.0",
"@prisma/client": "^4.7.1",
"@trpc/server": "^10.9.1",
"react": "^18.2.0"
```

**No deployment of it succeeds** — the template reports 0% health. Three years of
unattended dependency drift will do that, and the stack it was pinned near has
moved twice since: Prisma 7 changed where the connection string lives, and tRPC 11
changed where the transformer is configured.

## What's in here

| File | Why it exists |
|------|---------------|
| `prisma/schema.prisma` | One `Post` model, indexed on `createdAt` |
| `prisma.config.ts` | Prisma 7 keeps the CLI's connection string here, not in the schema |
| `src/lib/prisma.ts` | Client through a driver adapter, one instance per process |
| `src/server/router.ts` | The tRPC router — a query and a validated mutation |
| `src/app/page.tsx` | A form that writes and a list that reads back |
| `railway.json` | Migrations as a pre-deploy step, health check on `/api/health` |
| `predeploy.sh` | Runs the migration, retrying only while Postgres is still unreachable |

## Four things worth knowing

- **Migrations run pre-deploy, not at build.** The build container has no database.
  `prisma migrate deploy` runs in the pre-deploy step, where one exists, and before
  the new version starts taking traffic. Putting it in the build is the single most
  common way this stack fails on a platform. On a project's first deploy the app
  and Postgres start together, so `predeploy.sh` retries Prisma's `P1001` — the
  "can't reach the database server" error — for up to a minute; Railway itself
  never retries a failed pre-deploy command.
- **`prisma generate` does run at build**, because generated client code has to be
  in the image. Build and pre-deploy are different containers, and files written in
  the second one do not survive.
- **The health check asks the database.** A process that is up but cannot reach
  Postgres is not serving anything; reporting it healthy only delays finding out.
- **The lockfile is committed and audits clean.** Railway refuses to build when the
  lockfile carries a HIGH advisory, and three of the transitive dependencies here
  ship one — the `overrides` block is what pins the patched versions.

## Prisma 7, if you last used 6

`url` is gone from the `datasource` block. The CLI reads it from `prisma.config.ts`;
the application passes its own connection to `PrismaClient` through a driver
adapter, `@prisma/adapter-pg` here. The upside on a platform is real: the schema no
longer needs a reachable database at build time.

## TypeScript 7

Next's built-in type checking uses a compiler API that TypeScript 7 does not
expose, so `experimental.useTypeScriptCli` is on in `next.config.ts` and Next runs
`tsc` instead. That is what keeps this on the current TypeScript rather than
pinning back to 6.

## Run locally

```bash
npm ci
cp .env.example .env      # point DATABASE_URL at a local Postgres
npx prisma migrate dev
npm run dev               # http://localhost:3000
```

## Configuration

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | yes | Postgres connection string — wired to the Postgres service |
| `PORT` | no | Set by the platform |

## License

MIT

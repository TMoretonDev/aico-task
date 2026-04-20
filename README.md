# AICO Task

An Nx monorepo containing the API, UI and shared-types package for the AICO take home task. The project is a simple CRUD API with a table component in the frontend to visualise the data. The UI also allows adding, updating and deleting of devices.

## Assumptions

- Devices are all manufactured in house and all devices share a set of standard fields (This was mentioned in the interview so it felt like a sane assumption here)
- No authentication required for the task. Per tenant authentication could be added for a real world deployment.
- 'Update device status' interpreted as a generic PATCH route in the devices controller.
- State history and real-time telemetry are scoped out but have been considered as per the sensor-specific table schemas that I added.

## Approach & challenges

### Single source of truth for validation (mid-project pivot)

My initial plan had the API using `class-validator` decorators on DTOs and the UI using its own Zod schema, with hand-maintained TypeScript interfaces in `shared-types` bridging the two. Halfway through, I learned about `nestjs-zod` which allows Nest DTOs to be built directly from Zod schemas. I pivoted to making Zod schemas the single source of truth: one schema per contract, imported by both the API (as the DTO via `createZodDto` + `ZodValidationPipe`) and the UI (as the tanstack-form validator). Any change to a contract now lands in exactly one file, and frontend/backend validation rules can't drift.

### Schema design for device subtypes

My first pass had separate tables per device type: a 'Smoke alarm' table, 'Black mould' table, and 'Heat Sensor' table, each with its own copy of the common fields (serial number, manufacturer, location). That gave me three sources of truth for what a 'Serial Number' looks like, and any change to common metadata meant updating three places.

I reshaped this into a single `devices` table holding the shared metadata (name, type, manufacturer, serial, location, online status) with 1:1 subtype tables for type-specific config and readings. This keeps the common fields as the single source of truth for types etc. while letting each device type carry its own structured data. The sensor-specific tables are written out in the Drizzle schema but their CRUD routes aren't yet wired up.

I remember during the initial interview we discussed how Aico Homelink deals with varying data shapes for different devices, to which it was stated that all devices were made in-house and there is very limited ambiguity on what data shapes look like. I factored this into my decision-making here, opting for separate sub-type tables over an ambiguous 'device_data' jsonb object which would lead to various issues down the line.

### Integrating Drizzle ORM into Nest.js

Whilst Nest.js has documented TypeORM implementations (alongside other popular ORMs), there was no official documented method for using Drizzle inside Nest.js. This led to a fair amount of time being spent researching the best Nest.js practice and how to correctly use a custom provider for this case. Additionally I also struggled to decide on a method for providing seed data (default device types). Whilst Drizzle provided drizzle-seed, it didn't play nicely with the drizzle provider.

## Tech stack

- **Backend**: NestJS, Drizzle ORM, Postgres, zod (+ `nestjs-zod`)
- **Frontend**: React, Vite, TanStack Query, TanStack Form, shadcn/ui, Tailwind
- **Shared**: Zod schemas live in `@aico-task/shared-types` and are consumed by both the API (runtime validation + DTOs) and the UI (form validation + types)
- **Infra**: pnpm workspaces + Nx, Docker Compose (Postgres)

## Prerequisites

- Node.js `20+` (22 recommended)
- pnpm `10+`
- Docker + Docker Compose
- Host port `5433` free (mapped to Postgres's internal `5432`)

## How to run the app locally

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the committed examples and adjust values if your local setup differs:

```bash
cp apps/aico-task-api/.env.example apps/aico-task-api/.env
cp apps/aico-task-ui/.env.example apps/aico-task-ui/.env
```

### 3. Build the shared-types package

The API's compiled runtime consumes the built JS from `packages/shared-types`. Rebuild whenever the shared schemas change:

```bash
pnpm -F @aico-task/shared-types build
```

### 4. Start Postgres

```bash
docker compose up -d
```

### 5. Apply the schema + seed device types

```bash
pnpm -F @aico-task/aico-task-api db:push
pnpm -F @aico-task/aico-task-api db:seed
```

### 6. Run the apps (separate terminals)

```bash
# API: http://localhost:3000
pnpm nx start:dev aico-task-api

# UI: http://localhost:5173
pnpm nx start:dev aico-task-ui
```

## API documentation

Interactive Swagger UI at [http://localhost:3000/docs](http://localhost:3000/docs) once the API is running.

## Design decisions

**Why Vite?**: For me due to personal experience it was a choice between Next.js and Vite as I wanted to choose a widely used production ready framework. TanStack Start seems promising but again is not battle tested in production but is worth keeping an eye on for future projects.

**Why not Next.js?**: I sided with Vite over Next.js as we simply weren't going to benefit from any of Next.js' best features in this project. An IoT app is inherently going to serve dynamic content so we won't benefit from the SEO features offered by Next. As I'm only building one page for this task, I wasn't going to benefit from the folder based routing either. Also, Next.js' built in API layer wasn't going to be of use here as I wanted to use a separate API project that was more suitable for handling complex service layer logic and high volumes of data (IoT device readings).

**Why Nest.js?**: I wanted to go with a Node.js framework and found that Nest.js is still one of the best choices when it comes to scalability. I also find Nest.js' code to be very readable thanks to how decorators are frequently used and how Nest.js' recommended folder structure enforces cleanly abstracted logic. For this task, I also found that Nest.js has a lot of features working out of the box which helped reduce time that would have been spent if making an Express API from scratch.

**Why PostgreSQL?**: I chose PostgreSQL as it is not only familiar but also after reading online I learned of TimescaleDB which is a PostgreSQL plugin built for storing live sensor data. Even though storing live sensor data was not in scope for this task, I wanted to choose a DB that could support live sensor data to factor in project scalability.

**Why DrizzleORM?**: I chose DrizzleORM as its syntax very closely matches raw SQL which makes it easier for developers to understand the syntax even with only a basic understanding of SQL. I also personally found Drizzle's schemas and relations to be very readable which will also make for a better developer experience.

I personally like using ORMs due to having the ability to swap in a different db provider, e.g. from PostgreSQL to MySQL, in a single configuration change without having to change the SQL in repository classes. I also find that having the schemas, relations and constraints described in code helps provide extra context when debugging and implementing new features.

**Why use shadcn/ui?**: I wanted a component library with the styling sorted out of the box for the purpose of this task. I'm also personally a big fan of how shadcn/ui is built on top of Tailwind CSS and how you only install the components you need directly into your project's component library which leads to a reduced bundle size.

**Why use Zod?**: I personally don't have too much experience using Zod but have heard from other developers how much they enjoy using it and thought this task would be a good opportunity to gain additional experience with the library. I also learned halfway through development of the task that Nest.js can use Zod for dto validation and also learned that Drizzle schemas can be built on top of zod.

**Why use Nx / a monorepo?**: The main reason here being maintainability. Being able to have the full application stack in one repository with visibility over shared packages leads to significantly improved development experience. Nx also has some cool features out of the box for running commands against affected code, caching for CI etc.

**Why not Turbo?**: I've personally only used Nx to date so I mainly chose it for familiarity, though after reading some articles online, I found various people saying they preferred Nx over Turbo which solidified my decision for this task.

**Why use TanStack Query?**: I personally chose TanStack Query due to its easy-to-use cache / cache invalidation out of the box which was not only a perfect fit for this task but also reinforces scalability to reduce redundant calls to the API in a larger application with more moving parts.

## Testing

E2E tests for the API live alongside the code they exercise (`apps/aico-task-api/src/**/*.e2e-spec.ts`) and run against a disposable Postgres instance defined in `docker-compose.test.yml`. The test DB uses `tmpfs` so data never touches disk, and every run gets a fresh container on port `5434`, separate from the dev DB on `5433`.

### How to run the tests

```bash
pnpm -F @aico-task/aico-task-api test:e2e
```

How it works:

1. Brings up the tmpfs Postgres via `docker-compose.test.yml` and waits for its healthcheck to pass.
2. Applies the Drizzle schema + seeds the device types table against the test DB.
3. Runs Jest with the e2e config.

### The test approach

- **Devices** (`device.controller.e2e-spec.ts`): full CRUD. Every endpoint has a `success` describe and (where applicable) a `parameter validation` describe covering 400 / 404 paths, duplicate serial number handling, and persistence verification via follow-up GETs.
- **Device Types** (`device-types.controller.e2e-spec.ts`): GET list + seed-data assertion.

### Test DB isolation

Credentials for the test DB live in `apps/aico-task-api/.env.test` and are loaded by Jest via `test/load-env.ts` (wired through the `setupFiles` entry in `test/jest-e2e.json`) before `AppModule` is imported. That means the test-run `ConfigService` only ever sees the test DB, and there's no way for tests to accidentally hit the dev DB.

### Troubleshooting

If `test:e2e` fails with `ECONNRESET`, a schema push error, or unexplained persistence-test failures, the test container is probably in a stale state from before a recent schema change. Tear it down and run again:

```bash
pnpm -F @aico-task/aico-task-api test:e2e:db:down
pnpm -F @aico-task/aico-task-api test:e2e
```

## Known limitations & what's next

- **Drizzle schema and zod schema must be manually kept in sync**: Currently a developer who adds a column to the Drizzle schema must remember to update the shared zod schema too. A longer-term fix would be generating zod schemas from Drizzle using drizzle-zod.

- **Only able to search by ID in the frontend currently**: Currently the search functionality in the frontend/API is very limited and only allows searching by ID which in reality is not user-friendly. A flexible filter component combined with a generic search endpoint that supports a query string could be added to support searching by various fields.

- **No CI / Github workflows configured**: The project could be easily improved by adding some basic CI workflows, e.g. test runs for affected changes, security/package audits, linting, building, deploying to a dev environment etc.

- **No authentication**: Implementing authentication did seem out of scope for the task but is still a considerable gap worth documenting as this would be a high-priority next step if work on the project were to continue.

- **No standard error shape**: Additional work is required to use a global exception filter in Nest.js to force compliance with a standard error object shape. This could also be coupled with an error code for developer debugging for future maintenance concerns.

- **Wire up device specific tables**: Whilst the tables are described in the Drizzle schemas, these tables should be accessed by Drizzle join queries with accompanying CRUD routes so the app can support device type specific properties.

- **No frontend tests**: Though I have backend API e2e tests that check for parameter validation and successful / failed CRUD operations, the frontend is currently untested due to its simplicity and lack of requirement for integration/e2e tests. There's no complex hook logic to warrant unit tests and all components come directly from shadcn/ui which also eliminates the need for component-level testing. That being said, if the project were to grow and the frontend gained increased complexity and areas of integration, there would be a need for frontend tests.

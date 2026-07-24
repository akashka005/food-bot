# Food Bot Project Documentation

## 1. Overview
Food Bot is a monorepo for an AI-powered campus food ordering and pre-booking platform. It combines a Next.js web experience, WhatsApp-based conversational ordering, recommendation logic, and shared backend packages for auth, database, analytics, and notifications.

## 2. Goals
- Provide a modern student food ordering experience.
- Support WhatsApp and web-based ordering flows.
- Enable vendor and admin management tools.
- Use AI for conversational ordering and personalized recommendations.

## 3. High-Level Architecture
- Apps:
  - web: main Next.js application for students, vendors, and admins.
- Packages:
  - ai: conversational agent, prompts, memory, and RAG logic.
  - auth: authentication and authorization helpers.
  - database: Prisma schema and data access layer.
  - notifications: notification delivery abstractions.
  - queue: order and slot scheduling engine.
  - recommendation: recommendation engine.
  - shared: common types, validators, and utilities.
  - whatsapp: WhatsApp integration client.

## 4. Low-Level Architecture
### Application Layers
- Presentation: React components and app routes under apps/web.
- API layer: route handlers for auth, webhooks, and dashboard operations.
- Domain logic: packages for queueing, recommendations, analytics, and AI.
- Persistence: PostgreSQL via Prisma models defined in packages/database/prisma/schema.prisma.

### Key Modules
- Auth package handles user identity and RBAC.
- AI package processes chat intents, generates responses, and supports retrieval augmentation.
- Queue package manages pickup slots and order estimation.
- Recommendation package builds personalized meal suggestions.
- Notification package prepares delivery of status updates.

## 5. Core Workflows
### Student Workflow
1. Register or log in.
2. Browse stalls and menu items.
3. Add items to cart.
4. Select a pickup slot.
5. Confirm order and track status.

### Vendor Workflow
1. View assigned kitchen queue.
2. Update menu availability.
3. Manage prep progress and order fulfillment.
4. Review analytics and sales trends.

### Admin Workflow
1. Manage students, vendors, and support cases.
2. Review RBAC and permissions.
3. Monitor platform-level metrics.
4. Publish announcements and platform updates.

## 6. Development Workflow
- Install dependencies with pnpm.
- Start the database using Docker Compose.
- Generate Prisma client and push schema changes.
- Run the web app in development mode.

Example:
```bash
pnpm install
docker compose up -d
pnpm db:generate
pnpm db:push
pnpm dev
```

## 7. Environment Variables
Copy .env.example to .env and fill values for database, auth, AI, and WhatsApp connectors.

## 8. Deployment Notes
- The app is designed for containerized deployment.
- Docker configuration is available in docker-compose.yml and apps/web/Dockerfile.
- CI workflow exists under .github/workflows/ci.yml.

## 9. Repository Notes
- Use pnpm workspaces for package management.
- Keep shared logic inside packages/ rather than duplicating it across apps.
- Prefer small, focused packages for maintainability.

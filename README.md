# LPU SmartFood AI 🍔🤖

A next-generation intelligent campus food delivery and ordering platform for Lovely Professional University. Built with an AI-first approach for automated WhatsApp ordering, RAG-powered personalization, and commercial-grade vendor management.

## 🚀 Features

- **WhatsApp AI Ordering:** NLP-powered bot via Groq LLaMA-3 to understand complex food orders (e.g., "Get me 2 spicy paneer rolls and an extra cold coffee").
- **RAG Recommendation Engine:** Personalized food recommendations combining collaborative filtering, trending items, and content-based embedding similarity (using `pgvector`).
- **Student Web UI:** Modern, glassmorphism-styled dashboard for browsing menus, managing cart, tracking live orders, and building a campus wallet.
- **Vendor Portal:** Real-time Kanban board for kitchen queue management, revenue analytics, and menu CRUD.
- **Super Admin Console:** RBAC management, platform-wide GMV tracking, and student/vendor onboarding.
- **Real-time Notifications:** Webhook and WebSocket ready infrastructure for order status tracking.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Monorepo:** Turborepo, pnpm workspaces
- **Database:** PostgreSQL with `pgvector`
- **ORM:** Prisma
- **Auth:** NextAuth.js v5 (Auth.js)
- **AI & NLP:** Vercel AI SDK, Groq (LLaMA-3 70B & 8B)
- **Styling:** Tailwind CSS (Custom glassmorphism design system)
- **State Management:** Zustand, React Query
- **Deployment:** Docker, GitHub Actions CI/CD

## 📦 Project Structure

```text
food-bot/
├── apps/
│   └── web/                 # Main Next.js App (Student, Vendor, Admin)
├── packages/
│   ├── analytics/           # Shared metrics and aggregation logic
│   ├── auth/                # Shared Auth.js configuration
│   ├── ai/                  # Vercel AI SDK and RAG wrappers
│   ├── database/            # Prisma schema, migrations, and client
│   ├── notifications/       # Order status push/email notifications
│   ├── recommendation/      # Recommendation engine logic
│   ├── shared/              # Shared types, Zod schemas
│   └── ui/                  # Reusable React components (shadcn/ui based)
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (for PostgreSQL + pgvector)

### Installation

1. **Clone and Install:**
   ```bash
   git clone <repo_url>
   cd food-bot
   pnpm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   # Fill in the required API keys (Groq, Auth secret, etc.)
   ```

3. **Start Database:**
   ```bash
   docker-compose up -d db
   ```

4. **Initialize Database:**
   ```bash
   pnpm --filter @smartfood/database generate
   pnpm --filter @smartfood/database db:push
   ```

5. **Run Development Server:**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`.

## 🐳 Docker Deployment

To build and run the entire stack (Database + Web App) using Docker:

```bash
docker-compose up --build -d
```

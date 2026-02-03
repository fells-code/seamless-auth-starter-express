# Seamless Auth — Express Starter API

A production-grade **Express + TypeScript + Sequelize** API starter designed to work beautifully with **Seamless Auth** using **server-mode authentication**.

This template is perfect for **founders, indie builders, and engineering teams** who want a secure, scalable backend with minimal setup and a frictionless developer experience.

Everything included in this template is optimized for:

- **DX (Developer Experience)**
- **Security**
- **Scalability**
- **Infrastructure readiness (Terraform, ECS, RDS)**
- **Local + Production clarity**

---

## 🚀 Features

This starter is packed with modern API features that make building secure SaaS apps easier and faster.

### 🔥 Seamless Auth (Server Mode)

- Zero-redirect, passwordless authentication
- Cookie-based session validation
- Role-based access (`requireRole("beta_user")`)
- Automatic user resolution (`req.user`)

### 🗄️ Sequelize ORM

- Postgres integration
- Auto-database creation on boot
- Auto-migration execution in dev & prod
- `User` model (id, email, roles[])
- `Waitlist` model for private beta or email list capture

### 📬 Waitlist API

- `POST /waitlist` → Add waitlist entry
- `GET /waitlist/count` → Get total entries

### 👤 User API

- `POST /users` → Create a user
- `GET /users` → Fetch all users
- `POST /users/:id/role` → Assign a role

### 🔐 Beta-Only API

- `GET /beta_users`
- Only users with `"beta_user"` role can access it

### 🐳 Docker-Ready

- Multi-stage Dockerfile (distroless runtime)
- docker-compose for local PG + API
- Auto-start database
- Auto-run migrations

### 🧪 DX Enhancements

- Nodemon + ts-node/esm dev experience
- Automatic environment loading
- Automatic database creation
- Automatic migrations
- Clean modular architecture

### 🛠 Tooling

- ESLint + Prettier
- Husky pre-commit hooks
- lint-staged
- Type-safe directory structure

---

## 📁 Directory Structure

```
seamless-auth-starter-express/
│
├── config/
│ └── config.js → Sequelize config (env-driven)
│
├── migrations/ → Sequelize migrations
│ └── YYYY-create-users.js
│
├── models/ → Sequelize models
│ ├── index.js → Model loader
│ ├── user.js → User model
│ └── waitlist.js → Waitlist model
│
├── scripts/
│ ├── ensureDatabase.js → Creates DB if missing
│ └── runMigrations.js → Executes all migrations
│
├── src/
│ ├── controllers/
│ │ ├── users.controller.ts
│ │ └── beta.controller.ts
│ │
│ ├── routes/
│ │ ├── users.ts
│ │ └── beta.ts
│ │
│ ├── middleware/
│ │ └── requireUser.ts (optional)
│ │
│ └── index.ts → Express entrypoint
│
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── package.json
└── .env
```

---

## 🔧 Environment Variables

Generated automatically by `create-seamless`:

```env
AUTH_SERVER_URL=https://demo.seamlessauth.com
SEAMLESS_COOKIE_SIGNING_KEY=<generated>
SEAMLESS_SERVICE_TOKEN=GRAB_FROM_SEAMLESS_AUTH_PORTAL

DATABASE_URL=postgres://postgres:postgres@localhost:5432/seamless
DB_NAME=seamless
```

---

## ▶️ Running Locally

### Install dependencies

```bash
npm install
```

### Start with:

- auto-database creation
- auto-migrations
- hot reload

```bash
npm run dev
```

API runs at:

```
http://localhost:3000
```

---

## 🐳 Running via Docker

```bash
docker-compose up --build
```

Shut down:

```bash
docker-compose down -v
```

---

## 🧪 API Endpoints

### Users

| Method | Route             | Description           |
| ------ | ----------------- | --------------------- |
| POST   | `/users`          | Create new user       |
| GET    | `/users`          | List all users        |
| POST   | `/users/:id/role` | Assign role to a user |

---

### Waitlist

| Method | Route             | Description           |
| ------ | ----------------- | --------------------- |
| POST   | `/waitlist`       | Add waitlist entry    |
| GET    | `/waitlist/count` | Get number of entries |

---

### Beta Access (Role Protected)

| Method | Route         | Description                   |
| ------ | ------------- | ----------------------------- |
| GET    | `/beta_users` | Only accessible by beta users |

Protected via:

```ts
app.use("/beta_users", requireRole("beta_user"), betaRoute);
```

---

## 💎 Developer Experience Highlights

### ✨ Auto-DB Creation

Works locally and in AWS RDS:

```bash
node scripts/ensureDatabase.js
```

### ✨ Auto-Migrations

Every dev / prod boot runs:

```bash
node scripts/runMigrations.js
```

### ✨ Modern ESM + TypeScript

- Native Node 18+ features
- ts-node/esm for dev
- First-class module support

### ✨ Sequelize ORM

Familiar API for Node developers.

### ✨ Docker + Terraform Ready

Matches the target arch for AWS ECS + RDS.

---

## 🧹 Linting, Formatting & Precommit Hooks

### Install tooling:

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-import husky lint-staged
```

---

### \`.eslintrc.json\`

```json
{
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended", "plugin:import/recommended", "prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "import/order": ["error"],
    "no-unused-vars": "warn"
  }
}
```

---

### \`.prettierrc\`

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true
}
```

---

### \`package.json\` updates

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.js",
    "format": "prettier --write .",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,js,json,md}": ["prettier --write", "eslint --fix"]
  }
}
```

---

### Add Husky Hook

```bash
npx husky add .husky/pre-commit "npm run lint && npm run build"
git add .husky/pre-commit
```

This ensures:

- Code is linted
- Code is formatted
- TypeScript compiles
- Bad code never enters the repo

---

## 🎉 You're Ready for Production & AWS

This starter already includes:

- Sequelize ORM
- Auto migrations
- Waitlist + User APIs
- Role-based auth
- Docker-ready builds
- Distroless images
- ESM TypeScript
- Precommit pipeline
- DX-focused architecture

It can be deployed today to:

- AWS ECS + Fargate
- AWS RDS Postgres
- CloudFront + ALB
- Fly.io
- Render
- DigitalOcean Apps

Next steps (optional):

- Add Terraform modules
- Add CI/CD
- Add OpenAPI docs
- Add unit testing
- Add worker queues

Happy building with **Seamless Auth**! 🚀

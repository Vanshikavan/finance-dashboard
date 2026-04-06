# Zorvyn Finance Backend

A RESTful backend API for a finance dashboard system with role-based access control, built as part of the Zorvyn Backend Developer Intern assignment.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Prisma 7
- **Auth**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Setup Instructions

1. Clone the repository
```bash
   git clone <your-repo-url>
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env` file in the root
```env
   DATABASE_URL="your-postgresql-url"
   JWT_SECRET="your-secret-key"
   PORT=3000
```

4. Run database migration
```bash
   npx prisma migrate dev --name init
   npx prisma generate
```

5. Seed sample data
```bash
   npx prisma db seed
```

6. Start the server
```bash
   npm run dev
```

## Test Credentials (after seeding)

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@zorvyn.com       | password123 |
| Analyst | analyst@zorvyn.com     | password123 |
| Viewer  | viewer@zorvyn.com      | password123 |

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | List all users |
| PATCH | `/api/users/:id/role` | Admin | Update user role |
| PATCH | `/api/users/:id/status` | Admin | Activate/deactivate user |

### Transactions
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/transactions` | All roles | List transactions (paginated) |
| POST | `/api/transactions` | Admin | Create transaction |
| PATCH | `/api/transactions/:id` | Admin | Update transaction |
| DELETE | `/api/transactions/:id` | Admin | Soft delete transaction |

**Filter params**: `?type=EXPENSE&category=Food&from=2025-01-01&to=2025-12-31&page=1&limit=10`

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | Analyst, Admin | Total income, expenses, net balance |
| GET | `/api/dashboard/by-category` | Analyst, Admin | Spending breakdown by category |
| GET | `/api/dashboard/trends` | Analyst, Admin | Monthly income vs expense (6 months) |
| GET | `/api/dashboard/recent` | Analyst, Admin | Last 10 transactions |
| GET | `/api/dashboard/insights` | Analyst, Admin | Highest spend category, averages |

**All protected routes require**: `Authorization: Bearer <token>`

## Role Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View transactions | ✅ (own) | ✅ (own) | ✅ (all) |
| Create/Edit/Delete transactions | ❌ | ❌ | ✅ |
| View dashboard & insights | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## Architecture Decisions & Assumptions

- **Modular structure**: Each feature (auth, users, transactions, dashboard) is fully self-contained with its own routes, controller, and service layer. This makes the codebase easy to extend without touching unrelated code.
- **Service layer pattern**: All business logic lives in service files. Controllers only receive requests and send responses. This separation means logic can be reused and tested independently.
- **Soft delete**: Transactions are never permanently deleted. A `deletedAt` timestamp is set instead. This is important in finance systems for audit trail purposes.
- **Data scoping by role**: Viewers and Analysts only see their own transactions. Admins see all. This is enforced at the service layer, not just the route level.
- **Prisma 7 with driver adapter**: Used `@prisma/adapter-pg` as required by Prisma 7's new architecture. The database URL is configured via `prisma.config.ts`, keeping the schema file clean.
- **JWT expiry set to 7 days**: Reasonable for an internal dashboard tool. In production this would be shorter with refresh token support.
- **Assumption**: Only Admins can create transactions. In a real system, users might create their own transactions, but for this dashboard the Admin manages the data.
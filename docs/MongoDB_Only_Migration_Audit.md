# PostgreSQL to MongoDB Migration Audit Report

## 1. Executive Summary
This report audits the current architecture of the Doctor Stethos Hospital Operations Portal to evaluate a complete migration from PostgreSQL (managed via Prisma) to a MongoDB-only persistence layer. The current application actively uses PostgreSQL and Prisma across its backend services. No MongoDB infrastructure currently exists. Migrating to MongoDB will require rewriting the backend data access layer (repositories/services) and replacing Prisma with Mongoose or the native MongoDB driver.

## 2. Actual Active Project Directory and Application Structure
- **Root Directory**: `D:\Dr.stethos\hospital-operations-portal\`
- **Frontend**: `frontend/` (React + Vite + TypeScript)
- **Backend**: `backend/` (Node.js + Express + TypeScript)
- **Documentation**: `docs/`

The original frontend `D:\Dr.stethos\DrStethos_Admin\` appears to have been migrated/copied into the `hospital-operations-portal/frontend` structure as part of recent restructuring.

## 3. Current Frontend and Backend Technology Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI, Zustand, Axios. Authentication has been migrated to use the REST API.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
- **Email**: Nodemailer (SMTP).

## 4. All PostgreSQL and Prisma Dependencies
The following files actively use or configure PostgreSQL and Prisma:
- `backend/package.json`: Contains `@prisma/client` and `prisma` dependencies.
- `backend/.env` & `backend/.env.example`: Contains `DATABASE_URL` configured for PostgreSQL.
- `backend/prisma/schema.prisma`: The relational schema definition.
- `backend/src/config/db.ts`: Initializes and exports the `PrismaClient` singleton.
- **Services (Data Access Layer)**:
  - `backend/src/modules/auth/auth.service.ts`: Uses Prisma for `User` queries.
  - `backend/src/modules/hospitals/hospitals.service.ts`: Uses Prisma for `Hospital` and `HospitalAccessAssignment` CRUD.
  - `backend/src/modules/imports/imports.service.ts`: Uses Prisma for `ImportJob`, `ImportRowError`, `Hospital`, and `HospitalAccessAssignment`.
  - `backend/src/modules/invitations/invitations.service.ts`: Uses Prisma for `AdminInvitation` and `User` creation.

## 5. Existing MongoDB Implementation and Reusable Components
- **Status**: None.
- There are no MongoDB dependencies, connection strings, or Mongoose schemas present in the codebase. MongoDB must be introduced from scratch.

## 6. Database Entity Inventory and Relationship Mapping
Based on `schema.prisma`, the following entities exist:
1. **User**: Stores user details and roles (`SUPER_ADMIN`, `MANAGER`). Related to `HospitalAccessAssignment` (1:N) and `AuditLog` (1:N).
2. **AdminInvitation**: Stores email invitations with unique tokens and expiration.
3. **Hospital**: Stores hospital records. Related to `HospitalAccessAssignment` (1:N).
4. **HospitalAccessAssignment**: A junction table linking `User` and `Hospital`. Enforces a unique compound index `[userId, hospitalId]`.
5. **AuditLog**: Stores audit trail events, linked optionally to `User`.
6. **ImportJob**: Tracks the status of Excel imports. Related to `ImportRowError` (1:N).
7. **ImportRowError**: Tracks specific row failures during an import job.

## 7. Frontend-to-Backend-to-Database Data-Flow Traces
- **Login Flow**: `AdminLogin.tsx` -> `api.ts` -> `POST /api/auth/login` -> `auth.controller.ts` -> `auth.service.ts` -> Prisma `User` query.
- **Hospital Directory**: Frontend List -> `GET /api/hospitals` -> `hospitals.controller.ts` -> `hospitals.service.ts` -> Prisma `Hospital` query (with `HospitalAccessAssignment` filtering for Managers).
- **Invitations**: Super Admin UI -> `POST /api/invitations` -> `invitations.controller.ts` -> `invitations.service.ts` -> Prisma `AdminInvitation` upsert -> Nodemailer.

## 8. Incomplete Features, Mocks and Missing Implementations
- Audit history logging is defined in the schema but is not actively traced/populated in the current service implementations (e.g., hospital edits do not currently write to `AuditLog`).
- Dashboard metrics logic needs to be verified; it might currently be mocked on the frontend or missing backend aggregation endpoints.

## 9. Migration Impact by File and Module
- **Configuration**: `backend/src/config/db.ts` must be rewritten to initialize a MongoDB connection.
- **Data Access**: All `.service.ts` files must be refactored to replace `prisma.<model>.<operation>()` calls with MongoDB/Mongoose equivalents.
- **Transactions**: Prisma transactions (if used for assignments) must be converted to MongoDB multi-document transactions (requires replica set) or handled via embedded updates.

## 10. Proposed MongoDB Collections, Indexes and Data-Access Architecture
We recommend introducing **Mongoose** to maintain schema validation and ease the transition from an ORM.

**Collection Strategy**:
1. `users`: Stores user documents.
2. `hospitals`: Stores hospital details.
   - *Relationship*: Instead of a junction table, `hospitals` could store an `assignedManagers` array (ObjectIds), OR `users` could store an `assignedHospitals` array. Since a hospital usually has few managers, embedding `assignedManagers: [{ type: ObjectId, ref: 'User' }]` on the `Hospital` document simplifies querying.
3. `admin_invitations`: Stores tokens. Needs a TTL Index on `expiresAt`.
4. `audit_logs`: Separate collection (append-only).
5. `import_jobs`: Can embed `errors` directly as an array of subdocuments to avoid a separate collection for row errors.

## 11. Security and Data-Integrity Considerations
- **Data Integrity**: MongoDB does not strictly enforce referential integrity (foreign keys). Deleting a hospital requires a manual cascading update to remove it from any user's assigned list if stored there.
- **Unique Constraints**: Need to ensure unique indexes are built for `users.email` and `admin_invitations.token`.
- **ObjectId Serialization**: Mongoose uses `_id` (ObjectId). API responses must map `_id` to `id` to maintain compatibility with the existing React frontend.

## 12. Required Dependency, Environment and Deployment Changes
- **Remove**: `@prisma/client`, `prisma`.
- **Add**: `mongoose` or `mongodb` native driver.
- **Env**: Replace `DATABASE_URL` (postgres) with `MONGO_URI`.
- **Deployment**: CI/CD pipelines and Dockerfiles must be updated to provision MongoDB instead of PostgreSQL.

## 13. Recommended Migration Order
1. Install Mongoose and configure `MONGO_URI` connection in `db.ts`.
2. Define Mongoose schemas for all entities matching the Prisma models.
3. Sequentially migrate `auth.service.ts` and `invitations.service.ts` (simplest).
4. Migrate `hospitals.service.ts` (handling the access assignment transition).
5. Migrate `imports.service.ts` (handling embedded errors).
6. Remove Prisma schemas, dependencies, and generated client.
7. Test all API endpoints against the frontend.

## 14. Testing and Verification Plan
- Create a test script to seed MongoDB with a Super Admin.
- Verify login and session persistence.
- Verify that Manager role users can only see hospitals assigned to them.
- Verify Excel import correctly populates the database and handles row errors accurately.

## 15. Questions or Blockers
- **Transactions**: Does the deployment environment support MongoDB Replica Sets? (Required if multi-document ACID transactions are needed for operations like hospital creation + access assignment). If not, embedding the relationship avoids the need for transactions.


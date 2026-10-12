# Doctor Stethos Hospital Operations Portal - Architecture

## Overview
The Doctor Stethos Hospital Operations Portal is a full-stack web application designed for managing hospital operations, user onboarding via invitations, bulk hospital imports, and role-based access control.

The system uses **MongoDB** as its sole primary operational database via **Mongoose**. All prior dependencies on PostgreSQL and Prisma ORM have been completely eliminated.

---

## High-Level Architecture

```
+-------------------------------------------------------------+
|                     Client (Browser)                        |
|   React + Vite + TailwindCSS + Shadcn UI + Axios Client     |
+-------------------------------------------------------------+
                              |
                     HTTP / JSON REST API
                              |
+-------------------------------------------------------------+
|                 Backend (Node.js / Express)                 |
|   - Authentication Middleware (JWT in httpOnly cookies)    |
|   - Role-Based Access Control (SUPER_ADMIN, MANAGER)        |
|   - Modular Architecture:                                   |
|       * Auth Module (/api/auth)                             |
|       * Hospitals Module (/api/hospitals)                   |
|       * Invitations Module (/api/invitations)               |
|       * Imports Module (/api/imports)                       |
|   - Email Service (Nodemailer with SMTP)                    |
+-------------------------------------------------------------+
                              |
                       Mongoose ODM
                              |
+-------------------------------------------------------------+
|                     MongoDB Database                        |
|   Collections:                                              |
|     - users                                                 |
|     - hospitals                                             |
|     - hospitalaccessassignments                             |
|     - admininvitations                                      |
|     - importjobs                                            |
|     - auditlogs                                             |
+-------------------------------------------------------------+
```

---

## Database Design & Collections

### 1. `users`
- `_id`: ObjectId (serialized to `id`)
- `email`: String (unique, lowercased, indexed)
- `password`: String (bcrypt hashed)
- `role`: `'SUPER_ADMIN' | 'MANAGER'`
- `firstName`: String (optional)
- `lastName`: String (optional)
- `timestamps`: `createdAt`, `updatedAt`

### 2. `hospitals`
- `_id`: ObjectId (serialized to `id`)
- `name`: String (required)
- `location`: String
- `contactNumber`: String
- `timestamps`: `createdAt`, `updatedAt`

### 3. `hospitalaccessassignments`
- `_id`: ObjectId
- `userId`: ObjectId (references `users`)
- `hospitalId`: ObjectId (references `hospitals`)
- Compound unique index: `{ userId: 1, hospitalId: 1 }`
- Enforces scoped hospital visibility for Manager / Operations roles.

### 4. `admininvitations`
- `_id`: ObjectId
- `email`: String (unique, lowercased)
- `token`: String (hashed)
- `role`: `'SUPER_ADMIN' | 'MANAGER'`
- `expiresAt`: Date (TTL index on `expiresAt` for automatic expiry)

### 5. `importjobs`
- `_id`: ObjectId
- `status`: `'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'`
- `totalRows`: Number
- `failedRows`: Number
- `errors`: Array of embedded `{ rowNumber, error }`
- `timestamps`: `createdAt`, `updatedAt`

### 6. `auditlogs`
- `_id`: ObjectId
- `userId`: ObjectId (optional, references `users`)
- `action`: String
- `entity`: String
- `entityId`: String
- `details`: Mixed / JSON
- `createdAt`: Date

---

## Security & Authentication

1. **Authentication Strategy**:
   - Passwords hashed with bcrypt (salt rounds = 10).
   - JWT issued upon login and stored in httpOnly cookies (or Bearer Authorization header).
   - Token payload includes `id`, `userId`, `email`, `role`.

2. **Access Control**:
   - `SUPER_ADMIN`: Unrestricted access across all hospitals, invitations, imports, and system settings.
   - `MANAGER`: Scoped hospital access governed by `HospitalAccessAssignment`. Managers can view and manage only hospitals assigned to them.


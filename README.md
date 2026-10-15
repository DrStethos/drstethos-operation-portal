# Doctor Stethos Hospital Operations Portal

A complete, unified Hospital Operations Portal for Doctor Stethos, featuring an intuitive modern frontend and a clean, high-performance Node.js backend powered exclusively by **MongoDB**.

## Features
- **MongoDB-Only Architecture**: Fully migrated away from PostgreSQL and Prisma. Data access powered by Mongoose with optimized indexing and clean JSON serialization.
- **Role-Based Operations Management**:
  - `SUPER_ADMIN`: Portal governance, invitations, global hospital management, hospital-field dropdown options, and hospital record editing.
  - `MANAGER`: Add and bulk-import hospitals, edit only hospitals they added, and delete only their own records. Super Admins can edit any hospital.
- **Flexible Hospital Fields**: Admin-managed hospital type and speciality dropdowns with direct text entry when no choices are configured or a custom value is needed. Hospital records include phone, email, address, source, and vacancy details. Spreadsheet `Source Website` values are stored and displayed as `Source`; serial numbers are retained for imports but omitted from the directory. The directory's `Added By` column displays the creator's account email.
- **Hospital Outreach Tracking**: Record whether each hospital is connected, use the hospital's single vacancy count, and capture feedback and follow-up commitments in comments. The directory summarizes contacted and connected hospitals.
- **Hospital Job Applications**: View applicants for app-posted jobs, including application counts, application dates, hospital and doctor status, and interview dates when those dates are already recorded. Super Admins can delete app job posts (including application records) or remove a portal vacancy without deleting the hospital.
- **User Management**: View, edit, and delete platform users. Deleting a user removes their linked profile and user record; when the authenticated `deleteUserAccount` Cloud Function is deployed, it also removes their Firebase Authentication account. Admins cannot delete their own account.
- **Profile Verifications**: Super Admins can approve or reject doctor and hospital profiles from the portal using the same Firebase-authenticated Firestore workflow as DrStethos Admin. Email and push notifications use the existing callable Cloud Functions.
- **Secure Authentication**: HttpOnly cookie-based JWT sessions, bcrypt password hashing, and invitation-based onboarding.
- **Bulk Hospital Imports**: High-throughput Excel (.xlsx) file processing with automated assignment, row-level error tracking, and same-account updates to every exact-name match without adding duplicates.
- **Transactional Notifications**: Configurable SMTP email integration for user onboarding invitations.

## Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run seed      # Initializes default Super Admin
npm run dev       # Starts server on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev       # Starts UI on http://localhost:5173
```

## CapRover Deployment (Tarball Upload)

This repository is an npm-workspaces project with a Vite/React frontend and an Express/Mongoose backend. The root `Dockerfile` can build both applications into one image. The frontend and backend also have separate CapRover definitions and can be deployed as separate apps using separate tarballs. MongoDB remains an external service; no container starts a database.

For separate apps, upload a frontend archive made from `frontend` and a backend archive made from `backend`. Each archive must contain its own `captain-definition` and `Dockerfile` at archive root. The frontend production API requests target `https://drstethos-operation-portal-backend.llp.trizenventures.com/api`.

### Build and validate locally

Run these commands from the project root:

```powershell
npm ci
npm run build
npm run lint --workspace=frontend
docker build -t hospital-operations-portal:local .
docker run --rm -p 8080:5000 `
  -e MONGO_URI="<mongodb-connection-string>" `
  -e JWT_SECRET="<long-random-secret>" `
  hospital-operations-portal:local
```

Then check `http://localhost:8080/health` and open `http://localhost:8080/` in a browser. The backend Docker images expose port `5000`; they listen on `0.0.0.0` and honor `PORT` if overridden. The standalone frontend nginx image exposes port `80`.

### CapRover environment variables

Configure these in the app's **App Configs → Environmental Variables**:

| Variable | Requirement | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Required | MongoDB connection string for the existing database. Ensure the database allows connections from the CapRover host. |
| `JWT_SECRET` | Required | Long, randomly generated secret used to sign and verify login tokens. Do not use the development fallback. |
| `FRONTEND_URL` | Required when frontend is on a separate origin | Public frontend origin, without a trailing slash (for example, `https://operations.drstethos.com`). Used for invitation links and to allow credentialed cross-origin API requests. |
| `SMTP_HOST` | Required for invitation email | SMTP server hostname. |
| `SMTP_PORT` | Required for invitation email | SMTP server port, commonly `587` or `465`. |
| `SMTP_SECURE` | Required for invitation email | Set to `true` when the SMTP server requires TLS from connection start (typically port `465`); otherwise `false`. |
| `SMTP_USER` | Required for invitation email | SMTP authentication username. |
| `SMTP_PASS` | Required for invitation email | SMTP authentication password or provider token. |
| `EMAIL_FROM_ADDRESS` | Required for invitation email | Sender address accepted by the SMTP provider. |
| `EMAIL_FROM_NAME` | Optional | Sender display name. |
| `EMAIL_REPLY_TO` | Optional | Reply-to address; defaults to the sender address. |
| `FIREBASE_PROJECT_ID` | Optional for direct backend API use | Firebase project used by the backend verification API. Defaults to `drstethos-app`; the Operations Portal profile actions use the signed-in Firebase client instead. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Optional for direct backend API use, unless using `FIREBASE_SERVICE_ACCOUNT_JSON` | Path to a service-account JSON file with Firestore access. On Google Cloud, grant the backend's runtime service account Firestore access instead. Not required for the Portal's Firebase-client verification workflow. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Optional alternative to `GOOGLE_APPLICATION_CREDENTIALS` | Full service-account JSON, provided as a protected backend environment variable for direct backend API use. Not required for the Portal's Firebase-client verification workflow. Never commit service-account credentials. |
| `DEFAULT_ADMIN_EMAIL` | Optional, initial setup only | Email for the first seeded Super Admin account. |
| `DEFAULT_ADMIN_PASSWORD` | Optional, initial setup only | Initial Super Admin password. Set a unique strong value before running the seed; never use the seed script's development fallback. |
| `PORT` | Optional | Backend container listen port. Defaults to `5000`; configure the CapRover backend app's container HTTP port to match. |
| `NODE_ENV` | Set by image | The image sets `production`, enabling secure authentication cookies. |

Both the root Docker build and the standalone frontend Dockerfile set `VITE_API_URL` to the deployed backend URL above. To change it for another environment, pass `--build-arg VITE_API_URL=https://<backend-host>/api` to `docker build`; Vite embeds this value in the static frontend at build time, so setting `VITE_API_URL` only as a CapRover runtime variable does not change an already-built bundle. `frontend/.env.production.example` records the current production value. For local development, `frontend/.env.example` continues to point to `http://localhost:5000/api`.

The backend's `FRONTEND_URL` is an origin allow-list value for CORS as well as the origin used to build invitation links. For the production operations portal, set it to `https://operations.drstethos.com` (no trailing slash) and redeploy or restart the backend after changing it. That production origin is also explicitly allowed by the backend. The frontend initializes Firebase using the DrStethos client configuration, so the deployed domain must be permitted by Firebase Auth and Firestore security rules. Portal users sign in with MongoDB; profile-verification actions additionally require an authorized Firebase admin session, as in DrStethos Admin. The profile actions write to Firestore with that session and call the existing Cloud Functions for notifications and email. They do not require backend Google Application Default Credentials. The optional standalone `/api/verification` endpoint still uses Firebase Admin credentials; for direct calls, configure `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON` with a service account authorized for the `drstethos-app` Firestore project. Never commit credentials or include them in a Docker image. For verification emails, the four enabled `emailTemplates` documents (`doctorApproval`, `hospitalApproval`, `doctorRejection`, and `hospitalRejection`) and the callable `sendEmail` Cloud Function must also be configured.

SMTP variables are needed for the invitation-email workflow; the application has placeholder defaults, which are not suitable for production. `EMAIL_PROVIDER` appears in the example environment file but is not currently read by the application.

### Create a combined CapRover tarball

From the project root's parent directory, run:

```powershell
tar -cvf "..\project-deployment.tar" .
```

The `.` must be the `hospital-operations-portal` project directory. The archive must have the root `captain-definition` and `Dockerfile` at its top level. The root `.dockerignore` excludes local dependencies, environment files, and build output.

### Create separate frontend and backend tarballs

From the project root, run:

```powershell
Set-Location .\frontend
tar -cvf ..\frontend-deployment.tar --exclude=node_modules --exclude=dist --exclude=.git --exclude=.env --exclude='.env.*' --exclude=functions .
Set-Location ..\backend
tar -cvf ..\backend-deployment.tar --exclude=node_modules --exclude=.git --exclude=.env --exclude='.env.*' --exclude=uploads --exclude=.agents --exclude=.claude --exclude=.cursor --exclude=.devin .
Set-Location ..
```

Upload each archive to its matching CapRover app. Set the frontend app's container HTTP port to `80` and the backend app's container HTTP port to `5000`. Configure backend environment variables on the backend app; `FRONTEND_URL` must exactly match the frontend's public HTTPS origin. The frontend API URL is baked into its Docker build and defaults to the backend domain above.

### Upload with CapRover Method 2

1. Create or open the application in the CapRover dashboard.
2. Open the app's **Deployment** section and select **Method 2: Upload Tarball**.
3. Upload the combined archive to a combined app, or upload frontend and backend archives to their corresponding apps.
4. In the backend app's **App Configs**, set backend environment variables and its container HTTP port to `5000`. Keep the frontend app's container port at `80`.
5. Attach domains and enable HTTPS. Set backend `FRONTEND_URL` to the frontend's public HTTPS origin, then redeploy the backend.
6. For a new database, set `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` on the backend app, open its web console, and run `node backend/src/seed.js` for a combined image or `node src/seed.js` for a standalone backend image. Remove the bootstrap password variable after seeding.
7. Confirm the backend is healthy at `/health`, then test login, hospital list, and invitation email workflows from the frontend.

## Documentation
- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/api.md)
- [Setup & Environment Configuration](docs/setup.md)
- [MongoDB Migration Audit Report](docs/MongoDB_Only_Migration_Audit.md)

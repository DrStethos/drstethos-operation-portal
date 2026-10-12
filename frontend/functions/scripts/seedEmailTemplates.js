/**
 * Seed default email templates into Firestore.
 *
 * Usage (from functions/):
 *   npm run seed:templates
 *
 * Requires one of:
 *   1. functions/service-account-key.json (recommended for CI)
 *   2. firebase login (uses your CLI session + Firestore REST API)
 *   3. GOOGLE_APPLICATION_CREDENTIALS + gcloud application-default login
 *
 * Or paste documents manually in Firebase Console → Firestore → emailTemplates
 * using functions/emailTemplates.seed.json
 */

const { documentRequestTemplate } = require("../email/documentRequestTemplate");
const {
  doctorApprovalTemplate,
  hospitalApprovalTemplate,
} = require("../email/profileApprovalTemplate");
const {
  doctorRejectionTemplate,
  hospitalRejectionTemplate,
} = require("../email/profileRejectionTemplate");
const { supportContactTemplate } = require("../email/supportContactTemplate");

const templates = {
  documentRequest: documentRequestTemplate,
  doctorApproval: doctorApprovalTemplate,
  hospitalApproval: hospitalApprovalTemplate,
  doctorRejection: doctorRejectionTemplate,
  hospitalRejection: hospitalRejectionTemplate,
  supportContact: supportContactTemplate,
};

const DEFAULT_CLI_SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];

function getProjectId(fs, path) {
  const fromEnv =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_PROJECT;
  if (fromEnv) return fromEnv;

  const firebasercPath = path.join(__dirname, "..", "..", ".firebaserc");
  if (fs.existsSync(firebasercPath)) {
    const rc = JSON.parse(fs.readFileSync(firebasercPath, "utf8"));
    if (rc.projects?.default) return rc.projects.default;
  }

  return undefined;
}

function printCredentialHelp(keyPath) {
  console.error("No Firebase Admin credentials found.\n");
  console.error("Option A — service account key (recommended for CI):");
  console.error("  1. Open https://console.firebase.google.com/project/drstethos-app/settings/serviceaccounts/adminsdk");
  console.error("  2. Generate new private key");
  console.error(`  3. Save the file as: ${keyPath}`);
  console.error("  4. Run: npm run seed:templates\n");
  console.error("Option B — Firebase CLI login (local dev):");
  console.error("  1. From repo root: npx firebase login --reauth");
  console.error("  2. Run: npm run seed:templates\n");
  console.error("Option C — Firebase Console (manual):");
  console.error("  Create collection emailTemplates and paste fields from functions/emailTemplates.seed.json\n");
  console.error("If GOOGLE_APPLICATION_CREDENTIALS points to a missing file, run:");
  console.error("  unset GOOGLE_APPLICATION_CREDENTIALS");
}

function getFirebaseCliSession(fs, pathModule) {
  const firebaseAuthPath = pathModule.join(
    __dirname,
    "..",
    "..",
    "node_modules",
    "firebase-tools",
    "lib",
    "auth.js"
  );

  if (!fs.existsSync(firebaseAuthPath)) {
    return null;
  }

  try {
    const firebaseAuth = require(firebaseAuthPath);
    const account = firebaseAuth.getGlobalDefaultAccount?.();
    const refreshToken = account?.tokens?.refresh_token;
    if (!refreshToken) return null;

    const scopes =
      Array.isArray(account.tokens?.scopes) && account.tokens.scopes.length > 0
        ? account.tokens.scopes
        : DEFAULT_CLI_SCOPES;

    return {
      email: account.user?.email || "unknown user",
      getAccessToken: () => firebaseAuth.getAccessToken(refreshToken, scopes),
    };
  } catch {
    return null;
  }
}

function initAdminWithServiceAccount(admin, fs, path) {
  const keyPath = path.join(__dirname, "..", "service-account-key.json");
  const projectId = getProjectId(fs, path);
  const credEnvPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credEnvPath && !fs.existsSync(path.resolve(credEnvPath))) {
    console.error(
      `GOOGLE_APPLICATION_CREDENTIALS points to a missing file: ${credEnvPath}\n`
    );
    printCredentialHelp(keyPath);
    process.exit(1);
  }

  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || projectId,
    });
    return "service-account";
  }

  if (credEnvPath) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
    return "application-default";
  }

  return null;
}

function toFirestoreValue(value) {
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return { integerValue: String(value) };
  return { stringValue: String(value) };
}

function toFirestoreFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

async function seedViaRestApi(projectId, accessToken, docId, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  const fieldPaths = Object.keys(payload)
    .map((key) => `updateMask.fieldPaths=${encodeURIComponent(key)}`)
    .join("&");

  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/emailTemplates/${docId}?${fieldPaths}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: toFirestoreFields(payload) }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to seed ${docId}: ${response.status} ${body}`);
  }
}

async function seedWithAdminSdk(admin) {
  const db = admin.firestore();

  for (const [id, data] of Object.entries(templates)) {
    await db.collection("emailTemplates").doc(id).set(
      {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`Seeded emailTemplates/${id}`);
  }
}

async function seedWithFirebaseCli(projectId, cliSession) {
  console.log(`Using Firebase CLI login (${cliSession.email})`);
  const tokenResponse = await cliSession.getAccessToken();
  const accessToken = tokenResponse.access_token;

  if (!accessToken) {
    throw new Error("Could not obtain access token from Firebase CLI session.");
  }

  for (const [id, data] of Object.entries(templates)) {
    await seedViaRestApi(projectId, accessToken, id, data);
    console.log(`Seeded emailTemplates/${id}`);
  }
}

async function main() {
  const admin = require("firebase-admin");
  const path = require("path");
  const fs = require("fs");
  const projectId = getProjectId(fs, path);

  if (!projectId) {
    throw new Error("Could not determine Firebase project ID.");
  }

  const adminMode = !admin.apps.length ? initAdminWithServiceAccount(admin, fs, path) : "service-account";

  if (adminMode) {
    await seedWithAdminSdk(admin);
    console.log("Done.");
    return;
  }

  const cliSession = getFirebaseCliSession(fs, path);
  if (cliSession) {
    await seedWithFirebaseCli(projectId, cliSession);
    console.log("Done.");
    return;
  }

  printCredentialHelp(path.join(__dirname, "..", "service-account-key.json"));
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

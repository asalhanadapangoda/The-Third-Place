/**
 * Server-side environment variable validation.
 * Never print secret values in logs or return them to clients.
 */

const PUBLIC_VARS = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
];

const SERVER_ONLY_VARS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

export function getEnvSecurityStatus() {
  const status = {
    publicConfigured: {},
    serverConfigured: {},
    missingRequired: [],
  };

  for (const key of PUBLIC_VARS) {
    const present = Boolean(process.env[key]);
    status.publicConfigured[key] = present;
    if (!present) status.missingRequired.push(key);
  }

  for (const key of SERVER_ONLY_VARS) {
    const present = Boolean(process.env[key]);
    status.serverConfigured[key] = present;
  }

  return status;
}

export function assertServerEnv(keys = []) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Server configuration incomplete. Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

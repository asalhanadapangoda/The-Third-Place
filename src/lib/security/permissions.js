/**
 * Role-Based Access Control (RBAC) & Input Safety Utilities
 */

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  STAFF: "staff",
  PUBLIC: "public",
};

export const PERMISSIONS = {
  MANAGE_MENU: "manage:menu",
  MANAGE_EVENTS: "manage:events",
  MANAGE_GALLERY: "manage:gallery",
  MANAGE_CONTENT: "manage:content",
  MANAGE_ENQUIRIES: "manage:enquiries",
  MANAGE_SETTINGS: "manage:settings",
  MANAGE_UPLOADS: "manage:uploads",
  VIEW_AUDIT_LOGS: "view:audit_logs",
  MANAGE_ROLES: "manage:roles",
};

const ROLE_PERMISSION_MAP = {
  [ROLES.ADMIN]: new Set(Object.values(PERMISSIONS)),
  [ROLES.EDITOR]: new Set([
    PERMISSIONS.MANAGE_MENU,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_ENQUIRIES,
    PERMISSIONS.MANAGE_UPLOADS,
  ]),
  [ROLES.STAFF]: new Set([]),
  [ROLES.PUBLIC]: new Set([]),
};

export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSION_MAP[role];
  if (!perms) return false;
  return perms.has(permission);
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value) {
  return typeof value === "string" && UUID_REGEX.test(value);
}

/**
 * Prevents open-redirect vulnerabilities by allowing only internal relative paths.
 */
export function sanitizeRedirectPath(input, fallback = "/admin/dashboard") {
  if (typeof input !== "string" || !input.startsWith("/")) {
    return fallback;
  }
  if (input.startsWith("//") || input.includes("\\") || input.includes("://")) {
    return fallback;
  }
  return input;
}

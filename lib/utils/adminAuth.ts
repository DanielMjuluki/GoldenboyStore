import { timingSafeEqual } from 'crypto';

/**
 * Minimal shared-secret authentication for admin-only API routes.
 *
 * This intentionally does NOT create a customer/user account system (the
 * project constitution forbids that). It is a single-owner gate: the store
 * owner sets ADMIN_API_KEY in their environment and enters it once in the
 * admin UI, which then sends it as a Bearer token on every admin request.
 *
 * For a real multi-admin or higher-stakes deployment, replace this with a
 * proper auth provider (e.g. NextAuth with a single allow-listed owner
 * account, or platform-level access control).
 */
function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    // Still run a comparison of equal length buffers to reduce (not fully
    // eliminate) timing signal from early-exit length checks.
    timingSafeEqual(bufferA, bufferA);
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

export function isAuthorizedAdminRequest(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;

  // Fail closed: if no admin key is configured, admin routes are disabled
  // rather than silently open.
  if (!adminKey) return false;

  const authHeader = request.headers.get('authorization') ?? '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) return false;

  return safeCompare(token, adminKey);
}

export function unauthorizedAdminResponseInit(): ResponseInit {
  return {
    status: 401,
    headers: { 'WWW-Authenticate': 'Bearer realm="admin"' },
  };
}

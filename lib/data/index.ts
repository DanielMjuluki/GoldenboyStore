import { memoryStore } from './memoryStore';
import { GoogleSheetsDataStore } from './googleSheetsAdapter';

const sheetId = process.env.SHEET_ID;

/**
 * Resolves the service account credentials for Google Sheets auth.
 *
 * Two supported sources:
 *  - GOOGLE_SERVICE_ACCOUNT_KEY_PATH: a filesystem path to the key JSON.
 *    Works for local dev, where the file persists on disk.
 *  - GOOGLE_SERVICE_ACCOUNT_KEY_BASE64: the key JSON, base64-encoded, as a
 *    single env var. Works on serverless hosts like Vercel, which have no
 *    persistent filesystem to point a path at.
 *
 * If both are set, the path takes precedence (useful for local dev against
 * a prod-style config). Returns null if neither is set, which falls back
 * to the in-memory store below.
 */
function resolveServiceAccountAuth(): string | Record<string, unknown> | null {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  if (keyPath) return keyPath;

  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (keyBase64) {
    try {
      const json = Buffer.from(keyBase64, 'base64').toString('utf-8');
      return JSON.parse(json);
    } catch (error) {
      throw new Error(
        'GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is set but could not be decoded as base64 JSON. ' +
          'Regenerate it with: base64 -i service-account.json | tr -d "\\n"'
      );
    }
  }

  return null;
}

const serviceAccountAuth = resolveServiceAccountAuth();

export const dataStore =
  sheetId && serviceAccountAuth
    ? new GoogleSheetsDataStore(sheetId, serviceAccountAuth)
    : memoryStore;

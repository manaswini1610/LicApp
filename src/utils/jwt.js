/**
 * Decode JWT payload for display only (not verified — server must validate).
 */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isUuidLike(s) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    s,
  );
}

/**
 * Best-effort display name from JWT claims (backend-specific keys vary).
 */
export function displayNameFromJwtToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload !== "object") return null;

  const tryString = (v) =>
    typeof v === "string" && v.trim() ? v.trim() : null;

  const username =
    tryString(payload.username) ??
    tryString(payload.preferred_username) ??
    tryString(payload.userName) ??
    tryString(payload.name);

  if (username) return username;

  const email = tryString(payload.email);
  if (email) return email.split("@")[0];

  const sub = tryString(payload.sub);
  if (sub && !isUuidLike(sub)) return sub;

  return null;
}

/** Extract a user-visible message from Better Auth / better-call client errors (no PII). */
export function authErrorMessage(err) {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err.message) return String(err.message);
  const body = err.body;
  if (body && typeof body === "object") {
    if (body.message) return String(body.message);
    if (body.code) return String(body.code);
  }
  if (err.code) return String(err.code);
  const st = err.status ?? err.statusCode;
  if (typeof st === "number") return `Request failed (${st})`;
  return "";
}

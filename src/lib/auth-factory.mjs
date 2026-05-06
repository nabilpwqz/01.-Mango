import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const baseURL =
  process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Common dev ports + env; per-request origin/host fixes "Invalid origin". */
const staticDevOrigins = [];
for (let port = 3000; port <= 3025; port++) {
  staticDevOrigins.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);
}

/**
 * @param {Request | undefined} request
 */
export async function resolveTrustedOrigins(request) {
  const set = new Set(
    [
      baseURL,
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      ...staticDevOrigins,
      ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [])
    ].filter((v) => typeof v === "string" && v.length > 0)
  );

  if (request?.url) {
    try {
      set.add(new URL(request.url).origin);
    } catch {
      /* noop */
    }
  }

  const host = request?.headers?.get?.("host");
  if (host) {
    set.add(`http://${host}`);
    set.add(`https://${host}`);
  }

  const xfHost = request?.headers?.get?.("x-forwarded-host");
  const xfProto = request?.headers?.get?.("x-forwarded-proto");
  if (xfHost) {
    const h = xfHost.split(",")[0].trim();
    const proto = (xfProto && xfProto.split(",")[0].trim()) || "https";
    set.add(`${proto}://${h}`);
  }

  return [...set];
}

export function openAuthSqlite() {
  const dataDir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const sqlitePath = path.join(dataDir, "auth.sqlite");
  const sqlite = new Database(sqlitePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("busy_timeout = 8000");
  return sqlite;
}

function googleSocialBlock() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
  const googleConfigured =
    googleClientId &&
    googleSecret &&
    !googleClientId.includes("your_google") &&
    !googleSecret.includes("your_google");
  if (!googleConfigured) return {};
  return {
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleSecret
      }
    }
  };
}

/**
 * @param {import("better-sqlite3").Database} sqlite
 */
export function createAuth(sqlite) {
  return betterAuth({
    baseURL,
    trustedOrigins: resolveTrustedOrigins,
    secret: process.env.BETTER_AUTH_SECRET || "dev-only-secret-change-me-min-32-chars!!",
    database: sqlite,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128
    },
    ...googleSocialBlock(),
    plugins: [nextCookies()]
  });
}

"use client";

import { createAuthClient } from "better-auth/react";

function resolveBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "";
}

export const authClient = createAuthClient({
  baseURL: resolveBaseURL()
});

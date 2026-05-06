"use client";

/**
 * Better Auth does not ship a React context provider. Session state lives in the
 * client from `createAuthClient` in `@/lib/auth-client`. This wrapper is a
 * stable place for any future client-only providers.
 */
export default function Providers({ children }) {
  return children;
}

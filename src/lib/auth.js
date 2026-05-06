import { createAuth, openAuthSqlite } from "./auth-factory.mjs";

const sqlite = openAuthSqlite();
export const auth = createAuth(sqlite);

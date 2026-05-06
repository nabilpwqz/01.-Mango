import { fileURLToPath } from "url";
import path from "path";
import { createAuth, openAuthSqlite } from "../src/lib/auth-factory.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
process.chdir(path.join(here, ".."));

const sqlite = openAuthSqlite();
const auth = createAuth(sqlite);
const ctx = await auth.$context;
await ctx.runMigrations();
sqlite.close();

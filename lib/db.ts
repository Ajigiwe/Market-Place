import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "dev.db";
const client = createClient({ url: `file:${dbPath}` });
export const db = drizzle(client, { schema });

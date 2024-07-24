import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";

const queryString = process.env.DB_URL as string;
export const queryClient = postgres(queryString);
export const db = drizzle(queryClient);
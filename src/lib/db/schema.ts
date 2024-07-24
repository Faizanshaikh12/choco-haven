import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    fname: varchar('fname', { length: 100 }).notNull(),
    lname: varchar('lname', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    provider: varchar('provider', { length: 20 }).notNull(),
    externalId: varchar('external_id', { length: 100 }).notNull(),
    image: varchar('image'),
    role: varchar('role', { length: 12 }).default('customer').notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
});

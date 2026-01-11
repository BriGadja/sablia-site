import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const siteUsers = pgTable("site_users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const insertSiteUserSchema = createInsertSchema(siteUsers);
export const selectSiteUserSchema = createSelectSchema(siteUsers);
export type InsertSiteUser = typeof siteUsers.$inferInsert;
export type SelectSiteUser = typeof siteUsers.$inferSelect;

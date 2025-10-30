import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at").notNull().default(Math.floor(Date.now() / 1000)),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  roleId: integer("role_id").notNull().references(() => roles.id),
  createdAt: integer("created_at").notNull().default(Math.floor(Date.now() / 1000)),
});

export const tickets = sqliteTable("tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  campus: text("campus").notNull(),
  // category is constrained at app level to one of: feedback | inquiry | question
  category: text("category").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull().default("Open"),
  location: text("location").default(''),
  createdBy: integer("created_by"),
  createdAt: integer("created_at").notNull().default(Math.floor(Date.now() / 1000)),
});



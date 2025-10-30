import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at").notNull().default(Math.floor(Date.now() / 1000)),
});

export const campusesTable = sqliteTable("campuses", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  lat: text("lat").notNull(),
  lon: text("lon").notNull(),
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

export const trainingPrograms = sqliteTable("training_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  campusId: text("campus_id").references(() => campusesTable.id),
  paymentStatus: integer("payment_status", { mode: 'boolean' }).notNull().default(false),
  paymentAmount: integer("payment_amount").notNull().default(0),
  dateText: text("date_text"),
  source: text("source").notNull().default("pdf"),
  
  createdAt: integer("created_at").notNull().default(Math.floor(Date.now() / 1000)),
});



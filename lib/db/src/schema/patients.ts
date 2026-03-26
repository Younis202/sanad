import { pgTable, text, serial, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const patientsTable = pgTable("patients", {
  id: serial("id").primaryKey(),
  nationalId: varchar("national_id", { length: 20 }).notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  bloodType: varchar("blood_type", { length: 10 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  city: text("city").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  allergies: text("allergies").array().notNull().default([]),
  chronicConditions: text("chronic_conditions").array().notNull().default([]),
  criticalNotes: text("critical_notes").default(""),
});

export const insertPatientSchema = createInsertSchema(patientsTable).omit({ id: true });
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patientsTable.$inferSelect;

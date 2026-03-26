import { pgTable, text, serial, integer, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { patientsTable } from "./patients";

export const vaccinationsTable = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patientsTable.id),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  date: date("date").notNull(),
  nextDue: date("next_due"),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
});

export const insertVaccinationSchema = createInsertSchema(vaccinationsTable).omit({ id: true });
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type Vaccination = typeof vaccinationsTable.$inferSelect;

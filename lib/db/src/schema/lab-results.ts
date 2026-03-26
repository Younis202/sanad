import { pgTable, text, serial, integer, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { patientsTable } from "./patients";

export const labResultsTable = pgTable("lab_results", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patientsTable.id),
  testName: text("test_name").notNull(),
  testNameAr: text("test_name_ar").notNull(),
  date: date("date").notNull(),
  hospital: text("hospital").notNull(),
  value: text("value").notNull(),
  unit: text("unit").notNull(),
  normalRange: text("normal_range").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("normal"),
});

export const insertLabResultSchema = createInsertSchema(labResultsTable).omit({ id: true });
export type InsertLabResult = z.infer<typeof insertLabResultSchema>;
export type LabResult = typeof labResultsTable.$inferSelect;

import { pgTable, text, serial, integer, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { patientsTable } from "./patients";

export const medicalRecordsTable = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patientsTable.id),
  date: date("date").notNull(),
  hospital: text("hospital").notNull(),
  hospitalAr: text("hospital_ar").notNull(),
  doctorName: text("doctor_name").notNull(),
  specialty: text("specialty").notNull(),
  specialtyAr: text("specialty_ar").notNull(),
  diagnosis: text("diagnosis").notNull(),
  diagnosisAr: text("diagnosis_ar").notNull(),
  notes: text("notes").notNull().default(""),
  type: varchar("type", { length: 50 }).notNull().default("outpatient"),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecordsTable).omit({ id: true });
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type MedicalRecord = typeof medicalRecordsTable.$inferSelect;

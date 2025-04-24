import { create } from "domain";
import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

// role ENUM
export const userRoleEnum = pgEnum("user_role", [
  "doctor",
  "nurse",
  "receptionist",
  "lab_technician",
  "admin",
  "pharmacist",
]);
export const appontmentStatus = pgEnum("status", [
  "pending",
  "in session",
  "done",
]);

// Patient Type ENUM
export const patientTypeEnum = pgEnum("patient_type", [
  "inpatient",
  "outpatient",
]);

export const labTestEnum = pgEnum("test_result", [
  "pending",
  "completed",
  "cancelled",
]);

// Departments Table
export const DepartmentsTable = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Departments Relations
export const DepartmentsTableRelations = relations(
  DepartmentsTable,
  ({ many }) => ({
    users: many(StaffTable),
  }),
);

export const UserTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  phone_number: varchar("phone_number", { length: 15 }).notNull().unique(),
  email: varchar("email", { length: 70 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull(),
  work_id: varchar("work_id", { length: 100 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const UserTableRelations = relations(UserTable, ({ one }) => ({
  staff: one(StaffTable, {
    fields: [UserTable.id],
    references: [StaffTable.id],
  }),
}));

// Users Table
export const StaffTable = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  department_id: uuid("department_id")
    .notNull()
    .references(() => DepartmentsTable.id, {
      onDelete: "cascade",
    }),
});

// Users Relations
export const StaffTableRelations = relations(StaffTable, ({ one, many }) => ({
  department: one(DepartmentsTable, {
    fields: [StaffTable.department_id],
    references: [DepartmentsTable.id],
  }),
  appointments: many(AppointmentsTable),
  medical_records: many(PatientMedicalRecords),
  lab_tests: many(labTestRequestTable),
}));

// Students Table
export const StudentTable = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  phone_number: varchar("phone_number", { length: 15 }).unique().notNull(),
  reg_no: varchar("reg_no", { length: 15 }).unique().notNull(),
  emergency_contact: varchar("emergency_contact", { length: 15 }),
  special_conditions: text("special_conditions"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Students Relations
export const StudentTableRelations = relations(
  StudentTable,
  ({ many, one }) => ({
    appointments: many(AppointmentsTable),
    medical_records: many(PatientMedicalRecords),
    inpatients: many(InpatientTable),
    labtests: many(labTestRequestTable),
  }),
);

// Appointments Table
export const AppointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  reg_no: varchar("reg_no", { length: 15 }).references(
    () => StudentTable.reg_no,
    { onDelete: "cascade" },
  ),
  doctor_id: uuid("doctor_id")
    .references(() => StaffTable.id, { onDelete: "cascade" })
    .notNull(),
  appointment_date: timestamp("appointment_date").notNull(),
  status: appontmentStatus("status").default("pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Appointments Relations
export const AppointmentsTableRelations = relations(
  AppointmentsTable,
  ({ one }) => ({
    student: one(StudentTable, {
      fields: [AppointmentsTable.reg_no],
      references: [StudentTable.reg_no],
    }),
    doctor: one(StaffTable, {
      fields: [AppointmentsTable.doctor_id],
      references: [StaffTable.id],
    }),
  }),
);

// student medical records table
export const PatientMedicalRecords = pgTable("medical_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  reg_no: varchar("reg_no")
    .notNull()
    .references(() => StudentTable.reg_no, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  prescription: varchar("prescription", { length: 400 }),
  prescribed_by_id: uuid("prescribed_by_id").references(() => StaffTable.id),
  doctor_recommendation: varchar("doctor_recommendation", { length: 400 }),
  patient_type: patientTypeEnum("patient_type").default("outpatient"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const PatientMedicalRecordsRelations = relations(
  PatientMedicalRecords,
  ({ many, one }) => ({
    student: one(StudentTable, {
      fields: [PatientMedicalRecords.reg_no],
      references: [StudentTable.reg_no],
    }),
    prescribing_doctor: one(StaffTable, {
      fields: [PatientMedicalRecords.prescribed_by_id],
      references: [StaffTable.id],
    }),
    lab_test: many(labTestRequestTable),
  }),
);

export const labTestRequestTable = pgTable("lab_test_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  reg_no: varchar("reg_no", { length: 15 }).references(
    () => StudentTable.reg_no,
  ),
  medical_history_id: uuid("medical_history_id").references(
    () => PatientMedicalRecords.id,
    { onDelete: "cascade" },
  ),
  test_name: varchar("test_name", { length: 100 }).notNull(),
  test_description: varchar("test_description", { length: 200 }).notNull(),
  test_status: labTestEnum("test_status").default("pending"),
  test_result: varchar("test_result", { length: 200 }),
  requested_by_id: uuid("requested_by_id").references(() => StaffTable.id),
  tested_by_id: uuid("tested_by_id").references(() => StaffTable.id),
  requested_at: timestamp("requested_at").defaultNow(),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const labTestRequestTableRelations = relations(
  labTestRequestTable,
  ({ one }) => ({
    student: one(StudentTable, {
      fields: [labTestRequestTable.reg_no],
      references: [StudentTable.reg_no],
    }),
    requested_by: one(StaffTable, {
      fields: [labTestRequestTable.requested_by_id],
      references: [StaffTable.id],
    }),
    tested_by: one(StaffTable, {
      fields: [labTestRequestTable.tested_by_id],
      references: [StaffTable.id],
    }),
    medical_record: one(PatientMedicalRecords, {
      fields: [labTestRequestTable.medical_history_id],
      references: [PatientMedicalRecords.id],
    }),
  }),
);

// rooms table
export const RoomsTable = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  available_beds: integer("available_beds").default(0),
  total_beds: integer("total_beds").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// rooms table relations
export const RoomsTableRelations = relations(RoomsTable, ({ many }) => ({
  inpatients: many(InpatientTable),
}));

// inpatients table
export const InpatientTable = pgTable(
  "inpatients",
  {
    reg_no: varchar("reg_no", { length: 15 }).references(
      () => StudentTable.reg_no,
    ),
    room_id: uuid("room_id").references(() => RoomsTable.id),
    admission_date: timestamp("admission_date").defaultNow(),
    discharge_date: timestamp("discharge_date"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.reg_no, table.room_id] }),
    };
  },
);

// inpatients table relations
export const InpatientTableRelations = relations(InpatientTable, ({ one }) => ({
  room: one(RoomsTable, {
    fields: [InpatientTable.room_id],
    references: [RoomsTable.id],
  }),
  student: one(StudentTable, {
    fields: [InpatientTable.reg_no],
    references: [StudentTable.reg_no],
  }),
}));

// drugs table
export const DrugsTable = pgTable("drugs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const PrescriptionsTable = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  reg_no: varchar("reg_no", { length: 15 }).references(
    () => StudentTable.reg_no,
  ),
  status: text("status").default("pending"),
  valid_date: timestamp("valid_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const InventoryHistoryTable = pgTable("inventory_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  drug_id: uuid("drug_id").references(() => DrugsTable.id),
  change: integer("change").notNull(),
  reason: text("reason").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

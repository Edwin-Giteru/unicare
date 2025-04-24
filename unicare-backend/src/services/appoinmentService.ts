import { Appointment } from "../types/appointment";
import { db } from "../db";
import { AppointmentsTable, StudentTable, UserTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { d } from "drizzle-kit/index-BAUrj6Ib";

const appointments: Appointment[] = [];

export const bookAppointment = async (
  regNo: string,
  doctorId: string,
  date: string | any,
  // requestingUser: { id: string; role: string }
) => {
  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    throw new Error("Invalid date format");
  }
  // if (requestingUser.role !== "receptionist") {
  //   throw new Error("Only receptionists can book appointments.");
  // }

  return await db
    .insert(AppointmentsTable)
    .values({
      reg_no: regNo,
      doctor_id: doctorId,
      appointment_date: appointmentDate,
    })
    .returning();
};

export const studentExists = async (regNo: string): Promise<boolean> => {
  const student = await db
    .select()
    .from(StudentTable)
    .where(eq(StudentTable.reg_no, regNo));
  return student.length > 0;
};

export const doctorExists = async (doctorId: string): Promise<boolean> => {
  const doctor = await db
    .select()
    .from(UserTable)
    .where(and(eq(UserTable.id, doctorId), eq(UserTable.role, "doctor")));
  return doctor.length > 0;
};

import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  UserTable,
  PatientMedicalRecords,
  labTestRequestTable,
} from "../db/schema";

export async function getAllDoctors() {
  try {
    const doctors = await db
      .select({
        id: UserTable.id,
        name: UserTable.name,
        phone_number: UserTable.phone_number,
        email: UserTable.email,
        work_id: UserTable.work_id,
      })
      .from(UserTable)
      .where(eq(UserTable.role, "doctor"))
      .orderBy(desc(UserTable.created_at));

    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
}
export async function getStudentMedicalHistory(regNo: string) {
  try {
    // Fetch medical history and associated lab tests for the student
    const medicalHistory = await db
      .select({
        id: PatientMedicalRecords.id,
        prescription: PatientMedicalRecords.prescription,
        doctor_recommendation: PatientMedicalRecords.doctor_recommendation,
        patient_type: PatientMedicalRecords.patient_type,
        created_at: PatientMedicalRecords.created_at,
      })
      .from(PatientMedicalRecords)
      .where(eq(PatientMedicalRecords.reg_no, regNo))
      .orderBy(desc(PatientMedicalRecords.created_at));

    const labTests = await db
      .select({
        id: labTestRequestTable.id,
        test_name: labTestRequestTable.test_name,
        test_description: labTestRequestTable.test_description,
        test_status: labTestRequestTable.test_status,
        test_result: labTestRequestTable.test_result,
        requested_at: labTestRequestTable.requested_at,
        completed_at: labTestRequestTable.completed_at,
      })
      .from(labTestRequestTable)
      .where(eq(labTestRequestTable.medical_history_id, medicalHistory[0].id))
      .orderBy(desc(labTestRequestTable.requested_at));

    // Merge medical history and lab tests
    const medicalHistoryWithLabTests = medicalHistory.map((record) => ({
      ...record,
      lab_results: labTests,
    }));

    return medicalHistoryWithLabTests;
  } catch (error) {
    console.error("Error fetching medical history with lab tests:", error);
    throw new Error("Failed to fetch medical history with lab tests");
  }
}

export async function createStudentPrescription(
  regNo: string,
  prescription: string,
) {
  try {
    return await db
      .insert(PatientMedicalRecords)
      .values({
        reg_no: regNo,
        prescription,
      })
      .returning();
  } catch (error) {
    console.error("Error creating prescription:", error);
    throw new Error("Failed to create prescription");
  }
}

export async function requestStudentLabTest(
  regNo: string,
  testName: string,
  testDescription: string,
  requestedById: string | null,
) {
  try {
    // Fetch the latest medical history ID for the student
    const medicalHistory = await db
      .select({ id: PatientMedicalRecords.id })
      .from(PatientMedicalRecords)
      .where(eq(PatientMedicalRecords.reg_no, regNo))
      .orderBy(desc(PatientMedicalRecords.created_at))
      .limit(1);

    const medicalHistoryId =
      medicalHistory.length > 0 ? medicalHistory[0].id : null;

    // Insert the lab test request
    const labTestRequest = await db
      .insert(labTestRequestTable)
      .values({
        reg_no: regNo,
        medical_history_id: medicalHistoryId,
        test_name: testName,
        test_description: testDescription,
        requested_by_id: requestedById,
        requested_at: new Date(),
      })
      .returning();

    return labTestRequest;
  } catch (error) {
    console.error("Error requesting lab test:", error);
    throw new Error("Failed to request lab test");
  }
}
export async function updatePatientType(
  patientType: "outpatient" | "inpatient",
  regNo: string,
) {
  try {
    const result = await db
      .update(PatientMedicalRecords)
      .set({ patient_type: patientType })
      .where(eq(PatientMedicalRecords.reg_no, regNo))
      .returning();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getStudentLabTests(regNo: string) {
  try {
    const labTests = await db
      .select({
        id: labTestRequestTable.id,
        test_name: labTestRequestTable.test_name,
        test_description: labTestRequestTable.test_description,
        test_status: labTestRequestTable.test_status,
        test_result: labTestRequestTable.test_result,
        requested_at: labTestRequestTable.requested_at,
        completed_at: labTestRequestTable.completed_at,
      })
      .from(labTestRequestTable)
      .where(eq(labTestRequestTable.reg_no, regNo))
      .orderBy(desc(labTestRequestTable.requested_at));

    return labTests;
  } catch (error) {
    console.error("Error fetching student lab tests:", error);
    throw new Error("Failed to fetch student lab tests");
  }
}

import { eq } from "drizzle-orm";
import { db } from "../db";
import { labTestRequestTable, UserTable } from "../db/schema";

export const createLabResultsInDB = async (
  labResults: string,
  labTechId: string,
  regNo: string,
) => {
  try {
    // check if labtech exists
    const labTech = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, labTechId));
    if (labTech.length === 0) {
      throw new Error("Lab technician not found");
    }

    // Check if the lab test request exists for the given regNo
    const labTestRequest = await db
      .select()
      .from(labTestRequestTable)
      .where(eq(labTestRequestTable.reg_no, regNo));
    if (labTestRequest.length === 0) {
      throw new Error(
        "Lab test request not found for the given registration number",
      );
    }

    const result = await db
      .update(labTestRequestTable)
      .set({
        test_result: labResults,
        tested_by_id: labTechId,
        test_status: "completed",
        completed_at: new Date(),
      })
      .where(eq(labTestRequestTable.reg_no, regNo))
      .returning();
    return result;
  } catch (error: any) {
    console.error("Error creating lab results:", error);
    throw new Error(error);
  }
};

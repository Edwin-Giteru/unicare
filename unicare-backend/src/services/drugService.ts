import { db } from "../db";
import {
  DrugsTable,
  PrescriptionsTable,
  InventoryHistoryTable,
  PatientMedicalRecords,
} from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const addDrug = async (drug: {
  name: string;
  quantity: number;
  price: number;
}) => {
  try {
    const newDrug = await db
      .insert(DrugsTable)
      .values({
        name: drug.name,
        quantity: drug.quantity,
        price: drug.price,
      })
      .returning();

    return newDrug;
  } catch (error: any) {
    console.error("Error adding drug:", error);
    throw new Error(error);
  }
};

export const getAllDrugs = async () => {
  return await db
    .select({
      id: DrugsTable.id,
      name: DrugsTable.name,
      quantity: DrugsTable.quantity,
      price: DrugsTable.price,
    })
    .from(DrugsTable);
};

export const administerDrug = async (
  drugId: string,
  amount: number,
  regNo: string,
) => {
  const prescription = await db
    .select({
      prescription: PatientMedicalRecords.prescription,
    })
    .from(PatientMedicalRecords)
    .where(eq(PatientMedicalRecords.reg_no, regNo))
    .then((res) => res[0]);

  if (!prescription) {
    throw new Error("No prescription found for the given student.");
  }

  const prescribedDrugs = prescription.prescription;
  if (!prescribedDrugs || !prescribedDrugs.includes(drugId)) {
    throw new Error("The drug is not part of the prescription.");
  }

  const drug = await db
    .select({
      id: DrugsTable.id,
      quantity: DrugsTable.quantity,
      price: DrugsTable.price,
    })
    .from(DrugsTable)
    .where(eq(DrugsTable.id, drugId))
    .then((res) => res[0]);

  if (!drug) throw new Error("Drug not found");
  if (drug.quantity < amount) throw new Error("Not enough stock");

  const [updatedDrug] = await db
    .update(DrugsTable)
    .set({ quantity: drug.quantity - amount })
    .where(eq(DrugsTable.id, drugId))
    .returning();

  return updatedDrug;
};
export const getPrescription = async (reg_no: string) => {
  return await db
    .select({
      prescription: PatientMedicalRecords.prescription,
      prescribed_by: PatientMedicalRecords.prescribed_by_id,
    })
    .from(PatientMedicalRecords)
    .where(eq(PatientMedicalRecords.reg_no, reg_no));
};

export const updatePrescriptionStatus = async (
  prescriptionId: string,
  status: string,
) => {
  return await db
    .update(PrescriptionsTable)
    .set({ status, updated_at: new Date() })
    .where(eq(PrescriptionsTable.id, prescriptionId));
};

export const updateInventoryStock = async (
  drugId: string,
  quantityChange: number,
) => {
  const drug = await db
    .select({
      id: DrugsTable.id,
      quantity: DrugsTable.quantity,
    })
    .from(DrugsTable)
    .where(eq(DrugsTable.id, drugId))
    .then((res) => res[0]);

  if (!drug) throw new Error("Drug not found");
  if (drug.quantity + quantityChange < 0) throw new Error("Not enough stock");

  return await db
    .update(DrugsTable)
    .set({ quantity: drug.quantity + quantityChange })
    .where(eq(DrugsTable.id, drugId));
};

export const isValidPrescription = async (prescriptionId: string) => {
  const prescription = await db
    .select({
      valid_date: PrescriptionsTable.valid_date,
    })
    .from(PrescriptionsTable)
    .where(eq(PrescriptionsTable.id, prescriptionId))
    .then((res) => res[0]);

  if (!prescription) throw new Error("Prescription not found");

  const today = new Date().toISOString().split("T")[0];
  const prescriptionDate = new Date(prescription.valid_date)
    .toISOString()
    .split("T")[0];

  return today === prescriptionDate;
};

export const logInventoryChange = async (
  drugId: string,
  change: number,
  reason: string,
) => {
  return await db.insert(InventoryHistoryTable).values({
    drug_id: drugId,
    change,
    reason,
    timestamp: new Date(),
  });
};

export const getInventoryHistory = async () => {
  return await db
    .select({
      id: InventoryHistoryTable.id,
      drug_id: InventoryHistoryTable.drug_id,
      change: InventoryHistoryTable.change,
      reason: InventoryHistoryTable.reason,
      timestamp: InventoryHistoryTable.timestamp,
    })
    .from(InventoryHistoryTable)
    .orderBy(desc(InventoryHistoryTable.timestamp));
};

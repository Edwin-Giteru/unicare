import { Request, Response } from "express";
import {
  addDrug,
  getAllDrugs,
  administerDrug,
} from "../../services/drugService";
import {
  drugSchema,
  administerDrugSchema,
} from "../../validation/pharmacistValidation";
import {
  getPrescription,
  updatePrescriptionStatus,
  updateInventoryStock,
  isValidPrescription,
  logInventoryChange,
  getInventoryHistory,
} from "../../services/drugService";
import {
  dispenseDrugSchema,
  updateInventorySchema,
} from "../../validation/pharmacistValidation";
import { validate } from "../../utils/validation";

export const createDrug = async (
  req: Request & { user?: { id: string; role: string } },
  res: Response,
) => {
  // Check if the user is a pharmacist
  const { role } = req.user || {};
  if (role !== "pharmacist") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    validate(req.body, drugSchema);
    const { name, quantity, price } = req.body;

    const newDrug = await addDrug({ name, quantity, price });
    if (newDrug.length === 0) {
      return res.status(400).json({ message: "Failed to add drug" });
    }
    return res
      .status(201)
      .json({ message: `Drug ${newDrug[0].name} created succesfully` });
  } catch (error: any) {
    return res.status(400).json("Error adding new drug: " + error);
  }
};

export const listDrugs = async (_req: Request, res: Response) => {
  try {
    const drugs = await getAllDrugs();
    res.status(200).json(drugs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleAdministerDrug = async (
  req: Request & { user?: { id: string; role: string } },
  res: Response,
) => {
  const { role } = req.user || {};
  if (role !== "pharmacist") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    validate(req.body, administerDrugSchema);
    const { reg_no } = req.params;
    const { id, amount } = req.body;

    const updatedDrug = await administerDrug(id, amount, reg_no);
    res.status(200).json({ message: "Drug stock updated", drug: updatedDrug });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const viewPrescriptions = async (
  req: Request & { user?: { id: string; role: string } },
  res: Response,
) => {
  const { role } = req.user || {};
  if (role !== "pharmacist") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const { reg_no } = req.params;
    const studentPrescriptions = await getPrescription(reg_no);
    if (!studentPrescriptions) {
      res.status(404).json({ message: "Prescriptions not found" });
      return;
    }
    res.status(200).json(studentPrescriptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmDrugDispensation = async (
  req: Request & { user?: { id: string; role: string } },
  res: Response,
) => {
  const { role } = req.user || {};
  if (role !== "pharmacist") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    validate(req.body, dispenseDrugSchema);
    const { prescriptionId, drugs } = req.body;

    const isValid = await isValidPrescription(prescriptionId);
    if (!isValid) {
      res.status(400).json({ message: "Prescription is not valid for today." });
    }

    await updatePrescriptionStatus(prescriptionId, "dispensed");

    for (const drug of drugs) {
      await updateInventoryStock(drug.id, -drug.quantity);
      await logInventoryChange(drug.id, -drug.quantity, "Dispensed");
    }

    res.status(200).json({ message: "Drugs dispensed successfully." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDrugInventory = async (
  req: Request & { user?: { id: string; role: string } },
  res: Response,
) => {
  const { role } = req.user || {};
  if (role !== "pharmacist") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    validate(req.body, updateInventorySchema);
    const { id, quantity } = req.body;

    const updatedDrug = await updateInventoryStock(id, quantity);
    const reason = quantity > 0 ? "Stock replenished" : "Stock reduced";
    await logInventoryChange(id, quantity, reason);

    res
      .status(200)
      .json({ message: "Inventory updated successfully", updatedDrug });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const viewInventoryHistory = async (req: Request, res: Response) => {
  try {
    const history = await getInventoryHistory();
    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

import express, { Request, Response } from "express";
import {
  createDrug,
  listDrugs,
  handleAdministerDrug,
  viewPrescriptions,
  confirmDrugDispensation,
  updateDrugInventory,
  viewInventoryHistory,
} from "../../controllers/pharmacist/pharmacyController";
import validateRequest from "../../middleware/validateRequest";
import {
  drugSchema,
  administerDrugSchema,
  dispenseDrugSchema,
  updateInventorySchema,
} from "../../validation/pharmacistValidation";
import authenticateUser from "../../middleware/auth";

const pharmacistRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pharmacist
 *   description: Pharmacist drug management
 */

/**
 * @swagger
 * /v1/drug/add:
 *   post:
 *     summary: Add a new drug
 *     tags: [Pharmacist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *              - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Paracetamol"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *              price:
 *                type: integer
 *              example: 50
 *     responses:
 *       201:
 *         description: Drug added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
pharmacistRouter.post(
  "/add",
  authenticateUser,
  validateRequest(drugSchema),
  (req: Request, res: Response) => {
    createDrug(req, res);
  },
);

/**
 * @swagger
 * /v1/drug/list:
 *   get:
 *     summary: Get all available drugs
 *     tags: [Pharmacist]
 *     security:
 *       - bearerAuth: []
 *   requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *
 *     responses:
 *       200:
 *         description: List of drugs
 *       401:
 *         description: Unauthorized
 */
pharmacistRouter.get(
  "/list",
  authenticateUser,
  validateRequest(drugSchema),
  (req: Request, res: Response) => {
    listDrugs(req, res);
  },
);

/**
 * @swagger
 * /v1/drug/administer:
 *   post:
 *     summary: Administer a drug (reduce stock)
 *     tags: [Pharmacist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - amount
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               amount:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Drug stock updated
 *       400:
 *         description: Not enough stock or invalid ID
 *       401:
 *         description: Unauthorized
 */
pharmacistRouter.post(
  "/administer",
  authenticateUser,
  validateRequest(administerDrugSchema),
  (req: Request, res: Response) => {
    handleAdministerDrug(req, res);
  },
);

/**
 * @swagger
 * /v1/drug/prescriptions/{reg_no}:
 *   get:
 *     summary: View prescriptions for a student
 *     tags: [Pharmacist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reg_no
 *         required: true
 *         schema:
 *           type: string
 *         description: Student registration number
 *     responses:
 *       200:
 *         description: List of prescriptions
 *       404:
 *         description: Prescriptions not found
 *       401:
 *         description: Unauthorized
 */
pharmacistRouter.get(
  "/prescriptions/:reg_no",
  authenticateUser,
  (req: Request, res: Response) => {
    viewPrescriptions(req, res);
  },
);

/**
 * @swagger
 * /v1/drug/dispense:
 *   post:
 *     summary: Confirm drug dispensation
 *     tags: [Pharmacist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DispenseDrug'
 *     responses:
 *       200:
 *         description: Drugs dispensed successfully
 *       400:
 *         description: Validation error or invalid prescription
 *       401:
 *         description: Unauthorized
 */
pharmacistRouter.post(
  "/dispense",
  validateRequest(dispenseDrugSchema),
  authenticateUser,
  (req: Request, res: Response) => {
    confirmDrugDispensation(req, res);
  },
);

/**
 * @swagger
 * /v1/drug/inventory:
 *   put:
 *     summary: Update drug inventory
 *     tags: [Pharmacist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInventory'
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
// pharmacistRouter.put(
//   "/inventory",
//   validateRequest(updateInventorySchema),
//   updateDrugInventory,
// );

/**
 * @swagger
 * /v1/drug/history:
 *   get:
 *     summary: View inventory history
 *     tags: [Pharmacist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
pharmacistRouter.get("/history", viewInventoryHistory);

export default pharmacistRouter;

import express, { Request, Response } from "express";
import {
  getMedicalHistoryController,
  createPrescriptionController,
  requestLabTestController,
  updatePatientTypeController,
  getLabResultsController,
  updateTreatmentStatusController,
  getAllDoctorsController,
} from "../../controllers/doctor/doctorController";
import authenticateUser  from "../../middleware/auth";

const doctorRouter = express.Router();

/**
 * @swagger
 * /v1/doctor:
 *   get:
 *     summary: Get all doctors' details
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all doctors fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the doctor
 *                   name:
 *                     type: string
 *                     description: Name of the doctor
 *                   phone_number:
 *                     type: string
 *                     description: Phone number of the doctor
 *                   email:
 *                     type: string
 *                     description: Email address of the doctor
 *                   work_id:
 *                     type: string
 *                     description: Work ID of the doctor
 *       403:
 *         description: Unauthorized access (only receptionists can access this route)
 *       500:
 *         description: Server error
 */
doctorRouter.get("", authenticateUser, (req: Request, res: Response) => {
  getAllDoctorsController(req, res);
});

/**
 * @swagger
 * /v1/doctor/students/{regNo}/medical-history:
 *   get:
 *     summary: Get a student's complete medical history
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regNo
 *         required: true
 *         schema:
 *           type: string
 *         description: Student registration number
 *     responses:
 *       200:
 *         description: Medical history fetched successfully
 *       404:
 *         description: Student not found or no medical history available
 *       500:
 *         description: Server error
 */
doctorRouter.get(
  "/students/:regNo/medical-history",
  authenticateUser,
  (req: Request, res: Response) => {
    getMedicalHistoryController(req, res);
  },
);

/**
 * @swagger
 * /v1/doctor/students/{regNo}/prescriptions:
 *   post:
 *     summary: Write a new prescription for a student
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regNo
 *         required: true
 *         schema:
 *           type: string
 *         description: Student registration number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prescriptionDetails:
 *                 type: string
 *                 description: Details of the prescription
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Validation error or failed to create prescription
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
doctorRouter.post(
  "/students/:regNo/prescriptions",
  authenticateUser,
  (req: Request, res: Response) => {
    createPrescriptionController(req, res);
  },
);

/**
 * @swagger
 * /v1/doctor/students/{regNo}/lab-tests:
 *   post:
 *     summary: Request a lab test for the student
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regNo
 *         required: true
 *         schema:
 *           type: string
 *         description: Student registration number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testName:
 *                 type: string
 *                 description: Name of the lab test
 *               testDescription:
 *                 type: string
 *                 description: Description of the lab test
 *               requestedById:
 *                 type: string
 *                 description: ID of the staff requesting the test
 *     responses:
 *       201:
 *         description: Lab test requested successfully
 *       400:
 *         description: Validation error or failed to request lab test
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
doctorRouter.post(
  "/students/:regNo/lab-tests",
  authenticateUser,
  (req: Request, res: Response) => {
    requestLabTestController(req, res);
  },
);

/**
 * @swagger
 * /v1/doctor/students/{regNo}/status:
 *   patch:
 *     summary: Mark the patient as either inpatient or outpatient
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regNo
 *         required: true
 *         schema:
 *           type: string
 *         description: Student registration number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientType:
 *                 type: string
 *                 enum: [inpatient, outpatient]
 *                 description: Type of the patient
 *     responses:
 *       200:
 *         description: Patient type updated successfully
 *       400:
 *         description: Validation error or failed to update patient type
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
doctorRouter.patch(
  "/students/:regNo/status",
  authenticateUser,
  (req: Request, res: Response) => {
    updatePatientTypeController(req, res);
  },
);

/**
 * @swagger
 * /v1/doctor/students/{regNo}/lab-results:
 *   get:
 *     summary: View lab results of the student
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regNo
 *         required: true
 *         schema:
 *           type: string
 *         description: Student registration number
 *     responses:
 *       200:
 *         description: Lab results fetched successfully
 *       404:
 *         description: Student not found or no lab results available
 *       500:
 *         description: Server error
 */
doctorRouter.get(
  "/students/:regNo/lab-results",
  authenticateUser,
  (req: Request, res: Response) => {
    getLabResultsController(req, res);
  },
);

/**
 * @swagger
 * /v1/doctor/students/{regNo}/treatment-status:
 *   patch:
 *     summary: View and update the patient's status during treatment
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regNo
 *         required: true
 *         schema:
 *           type: string
 *         description: Student registration number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               treatmentStatus:
 *                 type: string
 *                 description: Updated treatment status
 *     responses:
 *       200:
 *         description: Treatment status updated successfully
 *       400:
 *         description: Validation error or failed to update treatment status
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
doctorRouter.patch(
  "/students/:regNo/treatment-status",
  authenticateUser,
  (req: Request, res: Response) => {
    updateTreatmentStatusController(req, res);
  },
);

export default doctorRouter;

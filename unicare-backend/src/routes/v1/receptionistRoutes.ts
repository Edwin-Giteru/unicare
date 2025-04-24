import express, { Request, Response } from "express";
import {
  assignPatientRoom,
  bookDoctorAppointment,
  dischargePatient,
  getRooms,
  getStudent,
} from "../../controllers/receptionist/receptionistController";
import validateRequest from "../../middleware/validateRequest";
import {
  receptionistAppointmentSchema,
  receptionistSchema,
} from "../../validation/receptionist";

const receptionistRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Receptionist
 *   description: Receptionist management routes
 */

/**
 * @swagger
 * /v1/receptionist/student/{regNo}:
 *   get:
 *     summary: Get student details by registration number
 *     tags: [Receptionist]
 *     parameters:
 *       - in: path
 *         name: regNo
 *         schema:
 *           type: string
 *         required: true
 *         description: Registration number of the student
 *     responses:
 *       200:
 *         description: Student details retrieved successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /v1/receptionist/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Receptionist]
 *     responses:
 *       200:
 *         description: List of rooms retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /v1/receptionist/room:
 *   post:
 *     summary: Assign a room to a patient
 *     tags: [Receptionist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regNo:
 *                 type: string
 *                 description: Registration number of the student
 *               roomId:
 *                 type: string
 *                 description: ID of the room to assign
 *     responses:
 *       200:
 *         description: Room assigned successfully
 *       404:
 *         description: Room or student not found
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update room details for a patient
 *     tags: [Receptionist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regNo:
 *                 type: string
 *                 description: Registration number of the student
 *               roomId:
 *                 type: string
 *                 description: ID of the new room
 *     responses:
 *       200:
 *         description: Room details updated successfully
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Discharge a patient and reassign their room
 *     tags: [Receptionist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regNo:
 *                 type: string
 *                 description: Registration number of the student
 *     responses:
 *       201:
 *         description: Patient discharged successfully
 *       500:
 *         description: Failed to reassign room or internal server error
 */

/**
 * @swagger
 * /v1/receptionist/appointment:
 *   post:
 *     summary: Book an appointment for a student with a doctor
 *     tags: [Receptionist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - regNo
 *               - doctorId
 *               - date
 *             properties:
 *               regNo:
 *                 type: string
 *                 description: Registration number of the student
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               doctorId:
 *                 type: string
 *                 description: ID of the doctor
 *                 example: "987e6543-e89b-21d3-a456-426614174111"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Appointment date in YYYY-MM-DD format
 *                 example: "2025-04-25"
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment booked successfully"
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     regNo:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     doctorId:
 *                       type: string
 *                       example: "987e6543-e89b-21d3-a456-426614174111"
 *                     appointmentDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-04-25"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

receptionistRouter
  .get(
    "/student/:regNo",
    validateRequest(receptionistSchema),
    (req: Request, res: Response) => {
      getStudent(req, res);
    },
  )
  .get(
    "/rooms",
    validateRequest(receptionistSchema),
    (req: Request, res: Response) => {
      getRooms(req, res);
    },
  )
  .post(
    "/room",
    validateRequest(receptionistSchema),
    (req: Request, res: Response) => {
      assignPatientRoom(req, res);
    },
  )
  .post(
    "/appointment",
    validateRequest(receptionistAppointmentSchema),
    (req: Request, res: Response) => {
      bookDoctorAppointment(req, res);
    },
  )
  .patch(
    "/room",
    validateRequest(receptionistSchema),
    (req: Request, res: Response) => {
      res.send("receptionist updates student room details");
    },
  )
  .delete(
    "/room",
    validateRequest(receptionistSchema),
    (req: Request, res: Response) => {
      dischargePatient(req, res);
    },
  );

export default receptionistRouter;

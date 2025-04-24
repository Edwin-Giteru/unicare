import express, { Response, Request } from "express";
import { createLabResults } from "../../controllers/labTech/labTechController";

const labTechRouter = express.Router();

/**
 * @swagger
 * /v1/lab-tech/students/{regNo}/lab-results:
 *   post:
 *     summary: Create lab results for a student
 *     tags:
 *       - Lab Technician
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
 *               labResults:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     test_name:
 *                       type: string
 *                       description: Name of the lab test
 *                       example: Blood Test
 *                     test_description:
 *                       type: string
 *                       description: Description of the lab test
 *                       example: Routine blood test for anemia
 *                     test_status:
 *                       type: string
 *                       enum: [pending, completed, in-progress]
 *                       description: Status of the lab test
 *                       example: completed
 *                     test_result:
 *                       type: string
 *                       description: Result of the lab test
 *                       example: Normal
 *                     requested_at:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the test was requested
 *                       example: 2025-04-22T10:00:00Z
 *                     completed_at:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the test was completed
 *                       example: 2025-04-23T15:00:00Z
 *     responses:
 *       201:
 *         description: Lab results created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lab results created successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the lab result
 *                       test_name:
 *                         type: string
 *                         description: Name of the lab test
 *                       test_result:
 *                         type: string
 *                         description: Result of the lab test
 *       400:
 *         description: Validation error or failed to create lab results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error or failed to create lab results
 *       403:
 *         description: Unauthorized access (only lab technicians can access this route)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server failed to create lab results
 */
labTechRouter.post("/", (req: Request, res: Response) => {
  createLabResults(req, res);
});

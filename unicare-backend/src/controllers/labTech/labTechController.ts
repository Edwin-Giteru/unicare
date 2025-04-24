import { Request, Response } from "express";
import { getStudentByregNo } from "../../services/studentService";
import { validateCreateLabResults } from "../../validation/labTechValidation";
import { createLabResultsInDB } from "../../services/labTechService";

export const createLabResults = async (
  req: Request & { user?: { role: string; id: string | null } },
  res: Response,
) => {
  const { regNo, labResults } = req.body;

  const { role, id } = req.user || {};
  if (!role && role !== "lab_technician") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    // Validate the lab results adn regNo
    const { error } = validateCreateLabResults.validate(regNo, labResults);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the student exists
    const student = await getStudentByregNo(regNo);
    if (student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Logic to create lab results
    const result = await createLabResultsInDB(labResults, id as string, regNo);
    if (result.length === 0) {
      return res.status(400).json({ message: "Failed to create lab results" });
    }
    return res.status(201).json({
      message: "Lab results created successfully",
      data: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server failed to create lab results", error });
  }
};

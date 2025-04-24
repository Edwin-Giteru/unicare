import Joi from "joi";

// Validation for regNo (student registration number)
const regNoValidation = Joi.string()
  .required()
  .pattern(/^[A-Za-z]{2}\d{4}\/\d{3}$/) // Example: CS2020/007
  .messages({
    "string.empty": "Registration number is required",
    "string.pattern.base":
      "Invalid registration number format. Example: CS2020/007",
  });

// Validation for individual lab result
const labResultValidation = Joi.object({
  test_name: Joi.string().required().max(100).messages({
    "string.empty": "Test name is required",
    "string.max": "Test name must not exceed 100 characters",
  }),
  test_description: Joi.string().required().max(200).messages({
    "string.empty": "Test description is required",
    "string.max": "Test description must not exceed 200 characters",
  }),
  test_status: Joi.string()
    .required()
    .valid("pending", "completed", "in-progress")
    .messages({
      "string.empty": "Test status is required",
      "any.only":
        "Test status must be one of 'pending', 'completed', or 'in-progress'",
    }),
  test_result: Joi.string().allow(null).max(200).messages({
    "string.max": "Test result must not exceed 200 characters",
  }),
  requested_at: Joi.date().required().messages({
    "date.base": "Requested date must be a valid date",
    "any.required": "Requested date is required",
  }),
  completed_at: Joi.date().allow(null).messages({
    "date.base": "Completed date must be a valid date",
  }),
});

// Validation for labResults array
export const validateLabResults = Joi.array()
  .items(labResultValidation)
  .min(1)
  .required()
  .messages({
    "array.base": "Lab results must be an array",
    "array.min": "At least one lab result is required",
    "any.required": "Lab results are required",
  });

// Validation schema for the entire request body
export const validateCreateLabResults = Joi.object({
  regNo: regNoValidation,
  labResults: validateLabResults,
});

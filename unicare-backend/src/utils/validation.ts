import Joi, { Schema } from "joi";

/**
 * Validates the given data against the provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @throws Will throw an error if validation fails.
 */
export const validate = (data: any, schema: Schema) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }
};

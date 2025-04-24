import Joi from "joi";

// ensuring we get data that is clean
export const registerSchema = Joi.object({
  name: Joi.string().min(6).max(40).required(),
  phone_number: Joi.string().min(9).max(13).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  work_id: Joi.string().required(),
  department: Joi.string().required(),
  role: Joi.string()
    .valid("doctor", "nurse", "receptionist", "lab_technician", "pharmacist", "admin")
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(5).max(30).email().required(),
  password: Joi.string().min(5).required(),
});

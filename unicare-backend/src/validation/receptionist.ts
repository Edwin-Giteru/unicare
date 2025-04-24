import Joi from "joi";

export const receptionistSchema = Joi.object({
  regNo: Joi.string(),
  roomId: Joi.string(),
});

export const receptionistAppointmentSchema = Joi.object({
  regNo: Joi.string()
    .required()
    .description("Registration number of the student"),
  roomId: Joi.string().optional().description("ID of the room to assign"),
  doctorId: Joi.string()
    .required()
    .description("ID of the doctor for the appointment"),
  date: Joi.date()
    .required()
    .description("Appointment date in YYYY-MM-DD format"),
});

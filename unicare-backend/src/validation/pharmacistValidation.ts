import Joi from "joi";

export const drugSchema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().integer().min(1).positive().required(),
});

export const administerDrugSchema = Joi.object({
  id: Joi.string().required(),
  amount: Joi.number().integer().min(1).required(),
});
export const dispenseDrugSchema = Joi.object({
  prescriptionId: Joi.string().required(),
  drugs: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        amount: Joi.number().integer().min(1).required(),
      }),
    )
    .required(),
});

export const updateInventorySchema = Joi.object({
  id: Joi.string().required(),
  quantityChange: Joi.number().integer().required(),
});

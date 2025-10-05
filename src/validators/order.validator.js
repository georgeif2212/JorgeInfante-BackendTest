import Joi from "joi";
import { uidSchema } from "./user.validator.js"; // para validar ObjectId
import { tidSchema as truckIdSchema } from "./truck.validator.js"; // si tienes algo similar
import { lidSchema as locationIdSchema } from "./location.validator.js"; // idem

// Crear una orden
export const orderSchema = Joi.object({
  user: uidSchema.extract("uid").required(), // user ObjectId
  truck: truckIdSchema.extract("tid").required(), // truck ObjectId
  status: Joi.string().valid("created", "in transit", "completed"),
  pickup: locationIdSchema.extract("lid").required(), // origin location
  dropoff: locationIdSchema.extract("lid").required(), // destination location
});

// Actualizar una orden (todos opcionales pero se requiere al menos uno)
export const updateOrderSchema = Joi.object({
  user: uidSchema.extract("uid").optional(),
  truck: truckIdSchema.extract("tid").optional(),
  status: Joi.string().valid("created", "in transit", "completed").optional(),
  pickup: locationIdSchema.extract("lid").optional(),
  dropoff: locationIdSchema.extract("lid").optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update the order",
  });

/**
 * Esquema de validación para el parámetro `oid`
 * Valida que cumpla con el formato de un ObjectId de MongoDB
 */
export const oidSchema = Joi.object({
  oid: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid MongoDB ObjectId format",
      "string.empty": "Location ID cannot be empty",
      "any.required": "Location ID is required",
    }),
});

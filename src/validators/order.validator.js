import Joi from "joi";
import { uidSchema } from "./user.validator.js";
import { tidSchema as truckIdSchema } from "./truck.validator.js";
import { lidSchema as locationIdSchema } from "./location.validator.js";

// Crear una orden
export const orderSchema = Joi.object({
  user: uidSchema.extract("uid").required(), // user ObjectId
  truck: truckIdSchema.extract("tid").required(), // truck ObjectId
  status: Joi.string().valid("created", "in transit", "completed").required(),
  pickup: locationIdSchema.extract("lid").required(), // origin location
  dropoff: locationIdSchema.extract("lid").required(), // destination location
});

// // Actualizar una orden (todos opcionales pero se requiere al menos uno)
// export const updateOrderSchema = Joi.object({
//   user: uidSchema.extract("uid").optional(),
//   truck: truckIdSchema.extract("uid").optional(),
//   status: Joi.string().valid("created", "in transit", "completed").optional(),
//   pickup: locationIdSchema.extract("uid").optional(),
//   dropoff: locationIdSchema.extract("uid").optional(),
// })
//   .min(1)
//   .messages({
//     "object.min": "At least one field must be provided to update the order",
//   });

/**
 * @file truck.validator.js
 * @description Validaciones para la entidad Truck usando Joi.
 *              Incluye validaciones para creación, actualización y validación de IDs.
 */

import Joi from "joi";
import { uidSchema } from "./user.validator.js";

/**
 * Validación de ID de camión (tid) en formato MongoDB ObjectId.
 */
export const tidSchema = Joi.object({
  tid: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid MongoDB ObjectId format",
      "string.empty": "Truck ID cannot be empty",
      "any.required": "Truck ID is required",
    }),
});

/**
 * Validación de datos para creación de un camión.
 * Incluye año, color, placas y usuario asociado.
 */
export const truckSchema = Joi.object({
  year: Joi.string().required(),
  color: Joi.string().required(),
  plates: Joi.string().alphanum().min(6).max(10).required(),
  user: Joi.string().required(),
}).keys({
  user: uidSchema.extract("uid"), // Extrae la validación del uid del usuario
});

/**
 * Validación de datos para actualización de un camión.
 * Todos los campos son opcionales, pero se requiere al menos uno.
 */
export const updateTruckSchema = Joi.object({
  user: uidSchema.extract("uid").optional(),
  year: Joi.string().trim().messages({
    "string.empty": "Year cannot be empty",
  }),
  color: Joi.string().trim().messages({
    "string.empty": "Color cannot be empty",
  }),
  plates: Joi.string().alphanum().min(6).max(10).uppercase().trim().messages({
    "string.min": "Plates must be at least 6 characters",
    "string.max": "Plates must be at most 10 characters",
    "string.alphanum": "Plates must only contain letters and numbers",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update the truck",
  });

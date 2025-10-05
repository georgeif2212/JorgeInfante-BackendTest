import Joi from "joi";

/**
 * Esquema de validación para crear una ubicación (Location).
 * Valida que el objeto recibido contenga un `place_id` obligatorio.
 */
export const locationSchema = Joi.object({
  place_id: Joi.string().required().messages({
    "string.empty": "Place ID cannot be empty",
    "any.required": "Place ID is required",
  }),
});

/**
 * Esquema de validación para el parámetro `lid` en rutas que
 * reciben un Location ID. Valida que cumpla con el formato de
 * un ObjectId de MongoDB
 */
export const lidSchema = Joi.object({
  lid: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid MongoDB ObjectId format",
      "string.empty": "Location ID cannot be empty",
      "any.required": "Location ID is required",
    }),
});

/**
 * Esquema de validación para actualización de una ubicación
 * Es necesario un campo.
 * Solo se requiere el place_id porque los demas campos se actualizan
 * por la api de Google
 */
export const updateLocationSchema = Joi.object({
  place_id: Joi.string().trim().messages({
    "string.empty": "Place ID cannot be empty",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update the location",
  });

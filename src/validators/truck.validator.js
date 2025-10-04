import Joi from "joi";
import { uidSchema } from "./user.validator.js";

export const truckSchema = Joi.object({
  year: Joi.string().required(),
  color: Joi.string().required(),
  plates: Joi.string().alphanum().min(6).max(10).required(),
  user: Joi.string().required(),
}).keys({
  user: uidSchema.extract("uid"),
});

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

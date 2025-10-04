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

import Joi from "joi";

export const locationSchema = Joi.object({
  place_id: Joi.string().required(),
});

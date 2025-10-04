import { CustomError } from "../utils/CustomError.js";
import EnumsError from "../utils/EnumsError.js";

const validateInfoMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    CustomError.create({
      name: "ValidationError",
      cause: error.details.map((d) => d.message).join(", "),
      message: "Invalid request data",
      code: EnumsError.BAD_REQUEST_ERROR,
    });
  }
  next();
};

export default validateInfoMiddleware;

import { CustomError } from "../utils/CustomError.js";
import EnumsError from "../utils/EnumsError.js";

const validateInfoMiddleware =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
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

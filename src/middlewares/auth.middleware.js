import { CustomError } from "../utils/CustomError.js";
import EnumsError from "../utils/EnumsError.js";
import messageError from "../utils/ErrorCauseMessage.js";
import { validateToken } from "../utils/utils.js";

export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    CustomError.create({
      name: "Unauthorized",
      cause: messageError.generatorPermissionError(),
      message: "You are not authorized to perform this action",
      code: EnumsError.UNAUTHORIZED_ERROR,
    });
  }

  const token = auth.split(" ")[1];

  const payload = await validateToken(token);

  if (!payload) {
    CustomError.create({
      name: "Unauthorized",
      cause: messageError.generatorPermissionError(),
      message: "Invalid or expired token",
      code: EnumsError.UNAUTHORIZED_ERROR,
    });
  }

  req.user = payload;
  next();
};

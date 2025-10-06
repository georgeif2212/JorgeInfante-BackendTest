import EnumsError from "../utils/errors/EnumsError.js";

export const errorHandlerMiddleware = (error, req, res, next) => {
  console.error(error.cause || error.message);
  switch (error.code) {
    case EnumsError.NOT_FOUND_ERROR:
      res.status(error.code).json({
        status: `error ${error.code}`,
        name: error.name,
        message: error.message,
        cause: error.cause,
      });
      break;

    case EnumsError.BAD_REQUEST_ERROR:
      res.status(error.code).json({
        status: `error ${error.code}`,
        name: error.name,
        message: error.message,
        cause: error.cause,
      });
      break;

    case EnumsError.CONFLICT:
      res.status(error.code).json({
        status: `error ${error.code}`,
        name: error.name,
        message: error.message,
        cause: error.cause,
      });
      break;

    case EnumsError.UNAUTHORIZED_ERROR:
      res.status(error.code).json({
        status: `error ${error.code}`,
        name: error.name,
        message: error.message,
        cause: error.cause,
      });
      break;

    default:
      return res.status(500).json({
        status: `error 500`,
        name: error.name || "InternalServerError",
        message: error.message || "Ha ocurrido un error inesperado",
      });
  }
};

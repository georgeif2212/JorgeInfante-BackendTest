import EnumsError from "../utils/EnumsError.js";

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
    
  }
};

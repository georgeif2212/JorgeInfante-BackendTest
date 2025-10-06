/**
 * @file auth.middleware.js
 * @description Middleware de autenticación que valida tokens JWT en las peticiones.
 * Se utiliza para proteger rutas que requieren que el usuario esté autenticado.
 */

import { CustomError } from "../utils/errors/CustomError.js";
import EnumsError from "../utils/errors/EnumsError.js";
import messageError from "../utils/errors/ErrorCauseMessage.js";
import { validateToken } from "../utils/utils.js";

/**
 * authMiddleware
 * @function
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @throws 401 - Si no se envía el token o no tiene el formato "Bearer <token>".
 * @throws 401 - Si el token es inválido o ha expirado.
 * @description Valida el encabezado `Authorization` de la petición, verifica el token JWT
 * y añade la información del usuario (`req.user`) para su uso en las rutas protegidas.
 */
export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;

  // Validar que exista encabezado Authorization con formato Bearer
  if (!auth || !auth.startsWith("Bearer ")) {
    CustomError.create({
      name: "Unauthorized",
      cause: messageError.generatorPermissionError(),
      message: "You are not authorized to perform this action",
      code: EnumsError.UNAUTHORIZED_ERROR,
    });
  }

  const token = auth.split(" ")[1];

  // Validar el token JWT
  const payload = await validateToken(token);

  if (!payload) {
    CustomError.create({
      name: "Unauthorized",
      cause: messageError.generatorPermissionError(),
      message: "Invalid or expired token",
      code: EnumsError.UNAUTHORIZED_ERROR,
    });
  }

  // Guardar información del usuario en la request
  req.user = payload;

  // Continuar al siguiente middleware o ruta
  next();
};

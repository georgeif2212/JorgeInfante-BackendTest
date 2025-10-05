/**
 * @file auth.routes.js
 * @description Rutas de autenticación para la aplicación. Maneja login y registro de usuarios.
 */

import { Router } from "express";
import AuthController from "../../controllers/auth.controller.js";
import { generateToken } from "../../utils/utils.js";
import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../../validators/user.validator.js";

const router = Router();

/**
 * POST /login
 * @description Autentica a un usuario usando email y password. Devuelve un token JWT al usuario autenticado.
 * Valida el cuerpo de la petición con `loginSchema`.
 *
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @returns {Object} 200 - Mensaje de éxito y token JWT.
 * @throws 400 - Si los datos no cumplen con el esquema de validación.
 * @throws 401 - Si las credenciales son incorrectas.
 */
router.post(
  "/login",
  validateInfoMiddleware(loginSchema),
  async (req, res, next) => {
    try {
      const { body } = req;
      const user = await AuthController.login(body);
      const token = generateToken(user);
      res.status(200).json({
        message: "Logged in successfully",
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /register
 * @description Registra un nuevo usuario en la base de datos. Valida el cuerpo de la petición con `registerSchema`.
 *
 * @param {string} req.body.first_name - Nombre del usuario.
 * @param {string} req.body.last_name - Apellido del usuario.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @returns {Object} 201 - Usuario creado.
 * @throws 400 - Si los datos no cumplen con el esquema de validación.
 * @throws 409 - Si ya existe un usuario con el mismo email.
 */
router.post(
  "/register",
  validateInfoMiddleware(registerSchema),
  async (req, res, next) => {
    try {
      const { body } = req;
      const user = await AuthController.register(body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

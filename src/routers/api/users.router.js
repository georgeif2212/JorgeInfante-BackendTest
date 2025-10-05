/**
 * @file users.router.js
 * @description Rutas de la entidad User. Permite operaciones CRUD de usuarios.
 * Todas las rutas requieren autenticación mediante `authMiddleware`.
 */

import { Router } from "express";
import {
  registerSchema,
  uidSchema,
  updateUserSchema,
} from "../../validators/user.validator.js";
import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import UsersController from "../../controllers/users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

/**
 * GET /users
 * @description Obtiene todos los usuarios. Se puede filtrar con query params.
 * @param {Object} req.query - Parámetros opcionales de filtrado.
 * @returns {Object[]} 200 - Lista de usuarios.
 * @throws 401 - Si el usuario no está autenticado.
 */
router.get("", async (req, res, next) => {
  try {
    const { query } = req;
    const users = await UsersController.get(query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /users
 * @description Crea un nuevo usuario. Valida los datos con `registerSchema`.
 * @param {string} req.body.name - Nombre del usuario.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @returns {Object} 201 - Usuario creado.
 * @throws 400 - Si los datos no cumplen con el esquema de validación.
 * @throws 409 - Si ya existe un usuario con el mismo email.
 */
router.post(
  "",
  validateInfoMiddleware(registerSchema),
  async (req, res, next) => {
    try {
      const { body } = req;
      const user = await UsersController.create(body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /users/:uid
 * @description Obtiene un usuario por su ID.
 * Valida el parámetro `uid` con `uidSchema`.
 * @param {string} req.params.uid - ID del usuario (MongoDB ObjectId).
 * @returns {Object} 200 - Usuario encontrado.
 * @throws 400 - Si el parámetro no cumple con el esquema de validación.
 * @throws 404 - Si no existe un usuario con el ID especificado.
 */
router.get(
  "/:uid",
  validateInfoMiddleware(uidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { uid },
      } = req;
      const user = await UsersController.getById(uid);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /users/:uid
 * @description Actualiza un usuario existente.
 * Valida el parámetro `uid` con `uidSchema` y el cuerpo con `updateUserSchema`.
 * @param {string} req.params.uid - ID del usuario (MongoDB ObjectId).
 * @param {Object} req.body - Campos a actualizar.
 * @returns {Object} 200 - Usuario actualizado.
 * @throws 400 - Si los datos no cumplen con los esquemas de validación.
 * @throws 404 - Si no existe un usuario con el ID especificado.
 */
router.put(
  "/:uid",
  validateInfoMiddleware(uidSchema, "params"),
  validateInfoMiddleware(updateUserSchema),
  async (req, res, next) => {
    try {
      const {
        body,
        params: { uid },
      } = req;
      const updatedUser = await UsersController.updateById(uid, body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /users/:uid
 * @description Elimina un usuario existente.
 * Valida el parámetro `uid` con `uidSchema`.
 * @param {string} req.params.uid - ID del usuario (MongoDB ObjectId).
 * @returns {204} - Usuario eliminado.
 * @throws 400 - Si el parámetro no cumple con el esquema de validación.
 * @throws 404 - Si no existe un usuario con el ID especificado.
 */
router.delete(
  "/:uid",
  validateInfoMiddleware(uidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { uid },
      } = req;
      await UsersController.deleteById(uid);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;

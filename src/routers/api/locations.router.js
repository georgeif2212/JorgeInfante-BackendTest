/**
 * @file locations.router.js
 * @description Rutas para la gestión de ubicaciones (CRUD) usando Express.
 *              Incluye validación de datos con Joi y manejo de errores.
 */

import { Router } from "express";
import {
  lidSchema,
  locationSchema,
  updateLocationSchema,
} from "../../validators/location.validator.js";
import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

import LocationsController from "../../controllers/locations.controller.js";

const router = Router();

router.use(authMiddleware);

/**
 * GET /locations
 * @description Obtiene todas las ubicaciones. Soporta query params para filtrado.
 */
router.get("", async (req, res, next) => {
  try {
    const { query } = req;
    const locations = await LocationsController.get(query);
    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /locations
 * @description Crea una ubicación en la base de datos validando el `place_id` con `locationSchema`.
 * Obtiene la dirección y coordenadas desde Google Places API.
 * @param {string} req.body.place_id - ID del lugar en Google Maps
 * @returns {Object} 201 - Ubicación creada con address, latitude y longitude
 * @throws 400 - Si los datos no cumplen con el esquema de validación
 * @throws 409 - Si ya existe una ubicación con el mismo place_id
 * @throws 404 - Si Google Places no devuelve información válida
 */
router.post(
  "",
  validateInfoMiddleware(locationSchema),
  async (req, res, next) => {
    try {
      const { body } = req;
      const location = await LocationsController.create(body);
      res.status(201).json(location);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /locations/:lid
 * @description Busca una ubicación en la base de datos a partir de su identificador único.
 * Valida los parámetros con `lidSchema`.
 * @param {string} req.params.lid - ID de la ubicación en formato MongoDB ObjectId
 * @returns {Object} 200 - Ubicación encontrada
 * @throws 400 - Si el parámetro no cumple con el esquema de validación
 * @throws 404 - Si no existe una ubicación con el ID especificado
 */
router.get(
  "/:lid",
  validateInfoMiddleware(lidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { lid },
      } = req;
      const location = await LocationsController.getById(lid);
      res.status(200).json(location);
    } catch (error) {
      next(error);
    }
  }
);
/**
 * PUT /locations/:lid
 * @description Actualiza una ubicación existente en la base de datos.
 * Valida el parámetro `lid` con `lidSchema` y el cuerpo de la petición con `updateLocationSchema`.
 *
 * @param {string} req.params.lid - ID de la ubicación (MongoDB ObjectId).
 * @param {string} req.body.place_id - ID del lugar en Google Maps.
 * @returns {Object} 200 - Ubicación actualizada.
 * @throws 400 - Si los datos no cumplen con los esquemas de validación.
 * @throws 404 - Si no existe la ubicación con el ID especificado.
 * @throws 409 - Si ya existe otra ubicación con el mismo place_id.
 */
router.put(
  "/:lid",
  validateInfoMiddleware(lidSchema, "params"),
  validateInfoMiddleware(updateLocationSchema),
  async (req, res, next) => {
    try {
      const {
        body,
        params: { lid },
      } = req;
      const updatedLocation = await LocationsController.updateById(lid, body);
      res.status(200).json(updatedLocation);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /locations/:lid
 * @description Elimina una ubicación existente de la base de datos.
 * Valida el parámetro `lid` con `lidSchema`.
 *
 * @param {string} req.params.lid - ID de la ubicación (MongoDB ObjectId).
 * @returns {Object} 200 - Ubicación eliminada.
 * @throws 400 - Si el parámetro no cumple con el esquema de validación.
 * @throws 404 - Si no existe la ubicación con el ID especificado.
 */
router.delete(
  "/:lid",
  validateInfoMiddleware(lidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { lid },
      } = req;
      const deletedLocation = await LocationsController.deleteById(lid);
      res.status(200).json(deletedLocation);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

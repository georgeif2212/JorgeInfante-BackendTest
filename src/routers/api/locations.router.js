/**
 * @file locations.router.js
 * @description Rutas para la gestión de ubicaciones (CRUD) usando Express.
 *              Incluye validación de datos con Joi y manejo de errores.
 */

import { Router } from "express";
import {
  lidSchema,
  locationSchema,
} from "../../validators/location.validator.js";
import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import LocationsController from "../../controllers/locations.controller.js";

const router = Router();

/**
 * GET /locations
 * @description Obtiene todas las ubicaciones. Soporta query params para filtrado.
 */
router.get("/locations", async (req, res, next) => {
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
  "/locations",
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
  "/locations/:lid",
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

export default router;

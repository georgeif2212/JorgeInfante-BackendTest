/**
 * @file locations.router.js
 * @description Rutas para la gestión de ubicaciones (CRUD) usando Express.
 *              Incluye validación de datos con Joi y manejo de errores.
 */

import { Router } from "express";
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

export default router;

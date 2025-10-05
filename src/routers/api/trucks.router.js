/**
 * @file trucks.router.js
 * @description Rutas para la gestión de camiones (CRUD) usando Express.
 *              Incluye validación de datos con Joi y manejo de errores.
 */

import { Router } from "express";
import {
  truckSchema,
  updateTruckSchema,
  tidSchema,
} from "../../validators/truck.validator.js";
import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import TrucksController from "../../controllers/trucks.controller.js";

const router = Router();

router.use(authMiddleware);
/**
 * GET /trucks
 * @description Obtiene todos los camiones. Soporta query params para filtrado.
 */
router.get("", async (req, res, next) => {
  try {
    const { query } = req;
    const trucks = await TrucksController.get(query);
    res.status(200).json(trucks);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /trucks
 * @description Crea un nuevo camión. Valida los datos del body con truckSchema.
 */
router.post("", validateInfoMiddleware(truckSchema), async (req, res, next) => {
  try {
    const { body } = req;
    const truck = await TrucksController.create({
      ...body,
      user: req.user._id,
    });
    res.status(201).json(truck);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /trucks/:tid
 * @description Obtiene un camión por su ID (tid). Valida params con tidSchema.
 */
router.get(
  "/:tid",
  validateInfoMiddleware(tidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { tid },
      } = req;
      const truck = await TrucksController.getById(tid);
      res.status(200).json(truck);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /trucks/:tid
 * @description Actualiza un camión existente. Valida params y body con schemas correspondientes.
 */
router.put(
  "/:tid",
  validateInfoMiddleware(tidSchema, "params"),
  validateInfoMiddleware(updateTruckSchema),
  async (req, res, next) => {
    try {
      const {
        body,
        params: { tid },
      } = req;
      const updatedTruck = await TrucksController.updateById(tid, {
        ...body,
        user: req.user._id,
      });
      res.status(200).json(updatedTruck);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /trucks/:tid
 * @description Elimina un camión por su ID. Valida params con tidSchema.
 */
router.delete(
  "/:tid",
  validateInfoMiddleware(tidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { tid },
      } = req;
      const deletedTruck = await TrucksController.deleteById(tid);
      res.status(200).json(deletedTruck);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

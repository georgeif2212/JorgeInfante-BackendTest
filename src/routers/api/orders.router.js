/**
 * @file orders.router.js
 * @description Rutas para la gestión de ordenes (CRUD) usando Express.
 *              Incluye validación de datos con Joi y manejo de errores.
 */

import { Router } from "express";

import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import OrdersController from "../../controllers/orders.controller.js";

const router = Router();

/**
 * GET /orders
 * @description Obtiene todas las ubicaciones. Soporta query params para filtrado.
 */
router.get("/orders", async (req, res, next) => {
  try {
    const { query } = req;
    const orders = await OrdersController.get(query);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

export default router;

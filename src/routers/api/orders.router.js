/**
 * @file orders.router.js
 * @description Rutas para la gestión de ordenes (CRUD) usando Express.
 *              Incluye validación de datos con Joi y manejo de errores.
 */

import { Router } from "express";

import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import OrdersController from "../../controllers/orders.controller.js";
import {
  oidSchema,
  orderSchema,
  updateOrderSchema,
  updateStatusSchema,
} from "../../validators/order.validator.js";

const router = Router();

/**
 * GET /orders
 * @description Obtiene todas las ubicaciones. Soporta query params para filtrado.
 */
router.get("/orders", async (req, res, next) => {
  try {
    const { query } = req;
    const orders = await OrdersController.list(query);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /orders
 * @description Crea una nueva orden de transporte.
 * Valida que los IDs de usuario, camión y ubicaciones existan y cumplan los esquemas de validación con `orderSchema`.
 *
 * @param {string} req.body.user - ID del usuario que crea la orden.
 * @param {string} req.body.truck - ID del camión asignado.
 * @param {string} req.body.pickup - ID de la ubicación de recogida.
 * @param {string} req.body.dropoff - ID de la ubicación de entrega.
 * @returns {Object} 201 - Orden creada con todos los datos relacionados.
 * @throws 400 - Si los datos no cumplen con los esquemas de validación.
 * @throws 404 - Si alguno de los IDs relacionados (usuario, camión, pickup, dropoff) no existe.
 */
router.post(
  "/orders",
  validateInfoMiddleware(orderSchema),
  async (req, res, next) => {
    try {
      const { body } = req;
      const order = await OrdersController.create(body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /orders/:oid
 * @description Busca una orden en la base de datos a partir de su identificador único.
 * Valida los parámetros con `oidSchema`.
 *
 * @param {string} req.params.oid - ID de la orden en formato MongoDB ObjectId.
 * @returns {Object} 200 - Orden encontrada.
 * @throws 400 - Si el parámetro no cumple con el esquema de validación.
 * @throws 404 - Si no existe una orden con el ID especificado.
 */
router.get(
  "/orders/:oid",
  validateInfoMiddleware(oidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { oid },
      } = req;
      const order = await OrdersController.getById(oid);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /orders/:oid
 * @description Actualiza una orden existente en la base de datos.
 * Valida el parámetro `oid` con `oidSchema` y el cuerpo de la petición con `updateOrderSchema`.
 *
 * @param {string} req.params.oid - ID de la orden (MongoDB ObjectId).
 * @param {string} req.body.user - ID del usuario asociado a la orden.
 * @param {string} req.body.truck - ID del camión asociado a la orden.
 * @param {string} req.body.status - Estado de la orden.
 * @param {string} req.body.pickup - ID de la ubicación de recogida.
 * @param {string} req.body.dropoff - ID de la ubicación de entrega.
 *
 * @returns {Object} 200 - Orden actualizada.
 * @throws 400 - Si los datos no cumplen con los esquemas de validación.
 * @throws 404 - Si no existe la orden con el ID especificado.
 */
router.put(
  "/orders/:oid",
  validateInfoMiddleware(oidSchema, "params"),
  validateInfoMiddleware(updateOrderSchema),
  async (req, res, next) => {
    try {
      const {
        body,
        params: { oid },
      } = req;
      const updatedOrder = await OrdersController.updateById(oid, body);
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /orders/:oid/status
 * @description Actualiza únicamente el estado (`status`) de una orden en la base de datos.
 * Valida el parámetro `oid` con `oidSchema` y el cuerpo de la petición con `updateStatusSchema`.
 *
 * @param {string} req.params.oid - ID de la orden (MongoDB ObjectId).
 * @param {string} req.body.status - Nuevo estado de la orden (ej. "created", "in transit", "completed").
 * @returns {Object} 200 - Orden actualizada con el nuevo estado.
 * @throws 400 - Si los datos no cumplen con los esquemas de validación.
 * @throws 404 - Si no existe una orden con el ID especificado.
 */
router.patch(
  "/orders/:oid/status",
  validateInfoMiddleware(oidSchema, "params"),
  validateInfoMiddleware(updateStatusSchema),
  async (req, res, next) => {
    try {
      const {
        body,
        params: { oid },
      } = req;

      const updatedOrder = await OrdersController.updateById(oid, {
        status: body.status,
      });
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /orders/:oid
 * @description Elimina una orden existente de la base de datos.
 * Valida el parámetro `oid` con `oidSchema`.
 *
 * @param {string} req.params.oid - ID de la orden (MongoDB ObjectId).
 * @returns {Object} 200 - Orden eliminada.
 * @throws 400 - Si el parámetro no cumple con el esquema de validación.
 * @throws 404 - Si no existe una orden con el ID especificado.
 */
router.delete(
  "/orders/:oid",
  validateInfoMiddleware(oidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { oid },
      } = req;
      const deletedOrder = await OrdersController.deleteById(oid);
      res.status(200).json(deletedOrder);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

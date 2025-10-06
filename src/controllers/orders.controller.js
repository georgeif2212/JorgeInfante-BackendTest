/**
 * @file orders.controller.js
 * @description Controlador para la entidad Order. Incluye operaciones CRUD
 *              y manejo de errores personalizado usando CustomError.
 */

import OrderModel from "../models/order.model.js";
import { checkRelations } from "../validators/relations.validator.js";
import { CustomError } from "../utils/errors/CustomError.js";
import EnumsError from "../utils/errors/EnumsError.js";
import messageError from "../utils/errors/ErrorCauseMessage.js";
import { getOrdersWithAggregation } from "../services/orders.services.js";
export default class OrdersController {
  /**
   * Obtener todas las ordenes que cumplen con un query opcional.
   * @param {Object} query - Filtro opcional para la búsqueda.
   * @returns {Promise<Array>} Lista de ordenes.
   */
  static get(query = {}) {
    return OrderModel.find(query);
  }

  /**
   * Crear una nueva orden de transporte.
   * Valida la existencia de los recursos relacionados: usuario, camión, ubicación de origen y destino.
   *
   * @param {Object} data - Datos de la orden.
   * @param {string} data.user - ID del usuario que crea la orden.
   * @param {string} data.truck - ID del camión asignado.
   * @param {string} data.pickup - ID de la ubicación de recogida.
   * @param {string} data.dropoff - ID de la ubicación de entrega.
   * @returns {Promise<Object>} Orden creada en la base de datos.
   * @throws CustomError Si alguno de los IDs relacionados no existe.
   */
  static async create(data) {
    const { user, truck, pickup, dropoff } = data;

    await checkRelations(user, truck, pickup, dropoff);

    return OrderModel.create(data);
  }

  static async list(query = {}) {
    return getOrdersWithAggregation(query);
  }

  /**
   * Obtener una orden por su ID.
   * @param {string} oid - ID único de la orden (MongoDB ObjectId).
   * @returns {Promise<Object>} Orden encontrada en la base de datos.
   * @throws CustomError Si no existe una orden con el ID especificado.
   */
  static async getById(oid) {
    const order = await OrderModel.findById(oid);
    if (!order) {
      CustomError.create({
        name: "Order not found",
        cause: messageError.generatorIdError(oid),
        message: `Order with '${oid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return order;
  }
  /**
   * Actualizar una orden por su ID.
   * Valida que existan las relaciones (usuario, camión, ubicaciones) antes de actualizar.
   *
   * @param {string} oid - ID de la orden a actualizar (MongoDB ObjectId).
   * @param {Object} data - Datos de la orden a actualizar.
   * @param {string} data.user - ID del usuario asociado.
   * @param {string} data.truck - ID del camión asociado.
   * @param {string} data.status - Estado de la orden.
   * @param {string} data.pickup - ID de la ubicación de recogida.
   * @param {string} data.dropoff - ID de la ubicación de entrega.
   *
   * @returns {Promise<Object>} Orden actualizada.
   * @throws CustomError Si la orden no existe o si alguna relación es inválida.
   */
  static async updateById(oid, data) {
    const { user, truck, status, pickup, dropoff } = data;

    await checkRelations(user, truck, pickup, dropoff);

    const updatedOrder = await OrderModel.findByIdAndUpdate(oid, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      CustomError.create({
        name: "Order not found",
        cause: messageError.generatorIdError(oid),
        message: `Order with '${oid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }

    return updatedOrder;
  }

  /**
   * Eliminar una orden por su ID.
   *
   * @param {string} oid - ID único de la orden (MongoDB ObjectId).
   * @returns {Promise<Object>} Orden eliminada de la base de datos.
   * @throws CustomError Si no existe una orden con el ID especificado.
   */
  static async deleteById(oid) {
    const result = await OrderModel.findByIdAndDelete(oid);
    if (!result) {
      CustomError.create({
        name: "Order not found",
        cause: messageError.generatorIdError(oid),
        message: `Order with '${oid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return result;
  }
}

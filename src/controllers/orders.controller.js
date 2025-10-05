/**
 * @file orders.controller.js
 * @description Controlador para la entidad Order. Incluye operaciones CRUD
 *              y manejo de errores personalizado usando CustomError.
 */

import OrderModel from "../models/order.model.js";
import LocationsController from "./locations.controller.js";
import TrucksController from "./trucks.controller.js";
import UsersController from "./users.controller.js";

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

    const checkRelations = async (userId, truckId, originId, destinationId) => {
      await Promise.all([
        UsersController.getById(userId),
        TrucksController.getById(truckId),
        LocationsController.getById(originId),
        LocationsController.getById(destinationId),
      ]);
    };

    await checkRelations(user, truck, pickup, dropoff);

    return OrderModel.create(data);
  }
}

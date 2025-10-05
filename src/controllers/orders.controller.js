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
   * Crear un nuevo camión.
   * Valida que las placas sean únicas y que el usuario exista.
   * @param {Object} data - Datos del camión a crear.
   * @returns {Promise<Object>} Camión creado.
   * @throws CustomError si ya existe un camión con las mismas placas o usuario inválido.
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

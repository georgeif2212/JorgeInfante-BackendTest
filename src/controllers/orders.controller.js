/**
 * @file orders.controller.js
 * @description Controlador para la entidad Order. Incluye operaciones CRUD
 *              y manejo de errores personalizado usando CustomError.
 */

import OrderModel from "../models/order.model.js";
import { checkRelations } from "../validators/relations.validator.js";
import { CustomError } from "../utils/CustomError.js";
import EnumsError from "../utils/EnumsError.js";
import messageError from "../utils/ErrorCauseMessage.js";
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

  /**
   * Listar órdenes con información embebida de camión y ubicaciones.
   *
   * Este método permite filtrar órdenes por `status`, paginar los resultados y
   * obtener los datos completos del camión (`truck`) y las ubicaciones de
   * recogida (`pickup`) y entrega (`dropoff`) usando agregaciones de MongoDB.
   *
   * @param {Object} [query={}] - Parámetros de consulta opcionales.
   * @param {string} [query.status] - Filtra las órdenes por estado: `"created"`, `"in transit"`, `"completed"`.
   * @param {number} [query.page=1] - Número de página para paginación.
   * @param {number} [query.limit=10] - Cantidad de órdenes por página.
   *
   * @returns {Promise<Object[]>} Array de órdenes con datos embebidos:
   *  - `_id`: ID de la orden
   *  - `user`: ID del usuario
   *  - `truck`: objeto con información del camión asignado
   *  - `pickup`: objeto con la ubicación de recogida
   *  - `dropoff`: objeto con la ubicación de entrega
   *  - `status`: estado de la orden
   *  - `createdAt`: fecha de creación
   *  - `updatedAt`: fecha de actualización
   *
   * @example
   * const orders = await OrdersController.list({ status: "created", page: 2, limit: 5 });
   */
  static async list(query = {}) {
    const { status, page = 1, limit = 10 } = query;
    const match = {};
    if (status) match.status = status;

    const pipeline = [
      // Filtrar por el estado (status) si fue enviado en query
      { $match: match },

      // Ordenar las órdenes más recientes primero (descendente por createdAt)
      { $sort: { createdAt: -1 } },

      // Saltar documentos según la página actual (paginación)
      { $skip: (page - 1) * limit },

      // Limitar la cantidad de documentos devueltos según el "limit"
      { $limit: parseInt(limit) },

      // === Relaciones con otras colecciones ===

      // Unir los datos completos del usuario asociado a la orden
      {
        $lookup: {
          from: "users", // colección de destino
          localField: "user", // campo en la orden
          foreignField: "_id", // campo en la colección "users"
          as: "user", // nombre del campo embebido
        },
      },
      // Convertir el array "user" en un objeto (puede ser null si no existe)
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      // Unir los datos del camión asignado a la orden
      {
        $lookup: {
          from: "trucks",
          localField: "truck",
          foreignField: "_id",
          as: "truck",
        },
      },
      { $unwind: { path: "$truck", preserveNullAndEmptyArrays: true } },

      // Unir la ubicación de recogida (pickup)
      {
        $lookup: {
          from: "locations",
          localField: "pickup",
          foreignField: "_id",
          as: "pickup",
        },
      },
      { $unwind: { path: "$pickup", preserveNullAndEmptyArrays: true } },

      // Unir la ubicación de entrega (dropoff)
      {
        $lookup: {
          from: "locations",
          localField: "dropoff",
          foreignField: "_id",
          as: "dropoff",
        },
      },
      { $unwind: { path: "$dropoff", preserveNullAndEmptyArrays: true } },
    ];

    const results = await OrderModel.aggregate(pipeline);
    return results;
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
}

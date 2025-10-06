/**
 * @file orders.services.js
 * @description Pipeline para la agregación de MongoDB en Orders
 */
import OrderModel from "../models/order.model.js";

/**
 * Listar órdenes con información embebida de camión y ubicaciones.
 *
 * Este método permite filtrar órdenes por `status`, paginar los resultados y
 * obtener los datos completos del camión (`truck`) y las ubicaciones de
 * recogida (`pickup`) y entrega (`dropoff`) usando agregaciones de MongoDB.
 *
 * @param {string} [status] - Filtra las órdenes por estado: `"created"`, `"in transit"`, `"completed"`.
 * @param {number} [page=1] - Número de página para paginación.
 * @param {number} [limit=10] - Cantidad de órdenes por página.
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

const buildOrdersAggregation = ({ status, page = 1, limit = 10 }) => {
  const match = {};
  if (status) match.status = status;

  return [
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
};

export const getOrdersWithAggregation = async (query) => {
  const pipeline = buildOrdersAggregation(query);
  return OrderModel.aggregate(pipeline);
};

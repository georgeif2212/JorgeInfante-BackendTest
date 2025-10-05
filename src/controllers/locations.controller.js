/**
 * @file locations.controller.js
 * @description Controlador para la entidad Location. Incluye operaciones CRUD
 *              y manejo de errores personalizado usando CustomError.
 */

import LocationModel from "../models/location.model.js";

export default class LocationsController {
  /**
   * Obtener todas las ubicaciones que cumplen con un query opcional.
   * @param {Object} query - Filtro opcional para la búsqueda.
   * @returns {Promise<Array>} Lista de camiones.
   */
  static get(query = {}) {
    return LocationModel.find(query);
  }
}

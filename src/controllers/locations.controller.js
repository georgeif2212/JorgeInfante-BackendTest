/**
 * @file locations.controller.js
 * @description Controlador para la entidad Location. Incluye operaciones CRUD
 *              y manejo de errores personalizado usando CustomError.
 */

import { CustomError } from "../utils/CustomError.js";
import LocationModel from "../models/location.model.js";
import EnumsError from "../utils/EnumsError.js";
import messageError from "../utils/ErrorCauseMessage.js";
import GooglePlacesService from "../services/googlePlaces.services.js";

export default class LocationsController {
  /**
   * Obtener todas las ubicaciones que cumplen con un query opcional.
   * @param {Object} query - Filtro opcional para la búsqueda.
   * @returns {Promise<Array>} Lista de camiones.
   */
  static get(query = {}) {
    return LocationModel.find(query);
  }

  /**
   * Crear una nueva ubicación (Location).
   * Valida que el place_id sea único y obtiene los detalles desde Google Places.
   * @param {Object} data - Datos de la ubicación a crear.
   * @param {string} data.place_id - ID del lugar en Google Maps.
   * @returns {Promise<Object>} Ubicación creada con address, latitude y longitude.
   * @throws CustomError si ya existe una ubicación con el mismo place_id
   *         o si Google Places no devuelve información válida.
   */
  static async create(data) {
    const { place_id } = data;

    const existing = await LocationModel.findOne({ place_id });
    if (existing)
      CustomError.create({
        name: "Invalid location data",
        cause: messageError.generatorLocationAlreadyExistsError(data),
        message: `Location already exists`,
        code: EnumsError.CONFLICT,
      });

    const locationDataFromGoogle = await GooglePlacesService.getPlaceDetails(
      place_id
    );

    const location = await LocationModel.create({
      place_id,
      ...locationDataFromGoogle,
    });

    return location;
  }
}

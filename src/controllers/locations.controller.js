/**
 * @file locations.controller.js
 * @description Controlador para la entidad Location. Incluye operaciones CRUD
 *              y manejo de errores personalizado usando CustomError.
 */

import { CustomError } from "../utils/errors/CustomError.js";
import LocationModel from "../models/location.model.js";
import EnumsError from "../utils/errors/EnumsError.js";
import messageError from "../utils/errors/ErrorCauseMessage.js";
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

  static getByPlaceId(place_id) {
    return LocationModel.findOne({ place_id });
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

    const existing = await LocationsController.getByPlaceId(place_id);
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

  /**
   * Obtener una ubicación por su ID.
   * @param {string} lid - ID único de la ubicación (MongoDB ObjectId).
   * @returns {Promise<Object>} Ubicación encontrada en la base de datos.
   * @throws CustomError Si no existe una ubicación con el ID especificado.
   */
  static async getById(lid) {
    const location = await LocationModel.findById(lid);
    if (!location) {
      CustomError.create({
        name: "Location not found",
        cause: messageError.generatorIdError(lid),
        message: `Location with '${lid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return location;
  }

  /**
   * Actualizar una ubicación por su ID.
   * Valida que no exista otra ubicación con el mismo place_id
   * y obtiene los datos actualizados desde Google Places.
   *
   * @param {string} lid - ID de la ubicación a actualizar (MongoDB ObjectId).
   * @param {string} data.place_id - ID del lugar en Google Maps.
   * @returns {Promise<Object>} Ubicación actualizada.
   * @throws CustomError Si la ubicación no existe o si los datos son inválidos (ej. place_id duplicado).
   */
  static async updateById(lid, data) {
    const { place_id } = data;

    const location = await LocationsController.getByPlaceId(place_id);
    if (location) {
      CustomError.create({
        name: "Invalid location data",
        cause: messageError.generatorLocationAlreadyExistsError(data),
        message: `Location already exists`,
        code: EnumsError.CONFLICT,
      });
    }

    const locationDataFromGoogle = await GooglePlacesService.getPlaceDetails(
      place_id
    );

    const updatedLocation = await LocationModel.findByIdAndUpdate(
      lid,
      { place_id, ...locationDataFromGoogle },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedLocation) {
      CustomError.create({
        name: "Location not found",
        cause: messageError.generatorIdError(lid),
        message: `Location with '${lid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }

    return updatedLocation;
  }

  /**
   * Eliminar una ubicación por su ID.
   *
   * @param {string} lid - ID único de la ubicación (MongoDB ObjectId).
   * @returns {Promise<Object>} Ubicación eliminada de la base de datos.
   * @throws CustomError Si no existe una ubicación con el ID especificado.
   */
  static async deleteById(lid) {
    const result = await LocationModel.findByIdAndDelete(lid);
    if (!result) {
      CustomError.create({
        name: "Location not found",
        cause: messageError.generatorIdError(lid),
        message: `Location with '${lid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return result;
  }
}

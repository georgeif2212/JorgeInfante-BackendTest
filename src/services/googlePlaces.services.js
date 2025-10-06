/**
 * @file GooglePlacesService.js
 * @description Servicio para interactuar con la API de Google Places.
 *              Permite obtener detalles de un lugar a partir de su place_id.
 */

import axios from "axios";
import { CustomError } from "../utils/errors/CustomError.js";
import messageError from "../utils/errors/ErrorCauseMessage.js";
import EnumsError from "../utils/errors/EnumsError.js";
import config from "../config/config.js";

const GOOGLE_API_KEY = config.googleAK;

export default class GooglePlacesService {
  /**
   * Obtiene los detalles de un lugar usando Google Places API.
   * Valida que el place_id sea proporcionado y maneja errores si no se encuentra.
   * @param {string} place_id - ID del lugar en Google Maps.
   * @returns {Promise<Object>} Objeto con dirección, latitud y longitud del lugar.
   * @throws CustomError si no se proporciona place_id o el lugar no se encuentra.
   */
  static async getPlaceDetails(place_id) {
    if (!place_id)
      CustomError.create({
        name: "Place ID required",
        cause: messageError.generatorGoogleMapsError(),
        message: `Place google ID is required`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);
    const result = response.data.result;

    if (!result)
      CustomError.create({
        name: "Place Not Found",
        cause: messageError.generatorIdError(place_id),
        message: `The id doesn't match any location`,
        code: EnumsError.NOT_FOUND_ERROR,
      });

    return {
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  }
}

import axios from "axios";
import { CustomError } from "../utils/CustomError.js";
import messageError from "../utils/ErrorCauseMessage.js";
import EnumsError from "../utils/EnumsError.js";
import config from "../config/config.js";

const GOOGLE_API_KEY = config.googleAK;

export default class GooglePlacesService {
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
        cause: messageError.generatorUserIdError(place_id),
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

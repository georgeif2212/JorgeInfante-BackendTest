import { CustomError } from "../utils/CustomError.js";
import TruckModel from "../models/truck.model.js";
import EnumsError from "../utils/EnumsError.js";
import messageError from "../utils/ErrorCauseMessage.js";
import { createPasswordHash } from "../utils/utils.js";
import UsersController from "./users.controller.js";

export default class TrucksController {
  static get(query = {}) {
    return TruckModel.find(query);
  }

  static async create(data) {
    const { plates, user } = data;

    const truck = await TrucksController.get({ plates: plates });
    if (truck.length > 0) {
      CustomError.create({
        name: "Invalid truck data",
        cause: messageError.generatorTruckAlreadyExistsError(data),
        message: `Truck already exists`,
        code: EnumsError.CONFLICT,
      });
    }

    await UsersController.getById(user);

    return TruckModel.create(data);
  }
}

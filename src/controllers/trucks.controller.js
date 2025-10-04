import TruckModel from "../models/truck.model.js";

export default class TrucksController {
  static get(query = {}) {
    return TruckModel.find(query);
  }
}

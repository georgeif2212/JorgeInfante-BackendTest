/**
 * @file trucks.controller.js
 * @description Controlador para la entidad Truck. Incluye operaciones CRUD
 *              y manejo de errores personalizado usando CustomError.
 */

import { CustomError } from "../utils/errors/CustomError.js";
import TruckModel from "../models/truck.model.js";
import EnumsError from "../utils/errors/EnumsError.js";
import messageError from "../utils/errors/ErrorCauseMessage.js";
import UsersController from "./users.controller.js";

export default class TrucksController {
  /**
   * Obtener todos los camiones que cumplen con un query opcional.
   * @param {Object} query - Filtro opcional para la búsqueda.
   * @returns {Promise<Array>} Lista de camiones.
   */
  static get(query = {}) {
    return TruckModel.find(query);
  }

  static getByPlates(plates) {
    return TruckModel.findOne({ plates });
  }
  /**
   * Crear un nuevo camión.
   * Valida que las placas sean únicas y que el usuario exista.
   * @param {Object} data - Datos del camión a crear.
   * @returns {Promise<Object>} Camión creado.
   * @throws CustomError si ya existe un camión con las mismas placas o usuario inválido.
   */
  static async create(data) {
    const { plates, user } = data;

    const truck = await TrucksController.getByPlates(plates);
    if (truck) {
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

  /**
   * Obtener un camión por su ID.
   * @param {String} tid - ID del camión.
   * @returns {Promise<Object>} Camión encontrado.
   * @throws CustomError si no existe el camión.
   */
  static async getById(tid) {
    const truck = await TruckModel.findById(tid);
    if (!truck) {
      CustomError.create({
        name: "Truck not found",
        cause: messageError.generatorIdError(tid),
        message: `Truck with '${tid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return truck;
  }

  /**
   * Actualizar un camión por su ID.
   * Valida placas duplicadas y existencia de usuario si se proporciona.
   * @param {String} tid - ID del camión.
   * @param {Object} data - Datos a actualizar.
   * @returns {Promise<Object>} Camión actualizado.
   * @throws CustomError si el camión no existe o datos inválidos.
   */
  static async updateById(tid, data) {
    const { plates, user } = data;

    const truck = await TrucksController.getByPlates(plates);
    if (truck) {
      CustomError.create({
        name: "Invalid truck data",
        cause: messageError.generatorTruckAlreadyExistsError(data),
        message: `Truck already exists`,
        code: EnumsError.CONFLICT,
      });
    }

    if (user) await UsersController.getById(user);

    const updatedTruck = await TruckModel.findByIdAndUpdate(tid, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedTruck) {
      CustomError.create({
        name: "Truck not found",
        cause: messageError.generatorIdError(tid),
        message: `Truck with '${tid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }

    return updatedTruck;
  }

  /**
   * Eliminar un camión por su ID.
   * @param {String} tid - ID del camión.
   * @returns {Promise<Object>} Camión eliminado.
   * @throws CustomError si no existe el camión.
   */
  static async deleteById(tid) {
    const result = await TruckModel.findByIdAndDelete(tid);
    if (!result) {
      CustomError.create({
        name: "Truck not found",
        cause: messageError.generatorIdError(tid),
        message: `Truck with '${tid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return result;
  }
}

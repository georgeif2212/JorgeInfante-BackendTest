/**
 * @file trucks.controller.js
 * @description Controlador para la entidad Truck. Incluye operaciones CRUD
 *              y manejo de errores personalizado usando CustomError.
 */

import { CustomError } from "../utils/CustomError.js";
import UserModel from "../models/user.model.js";
import EnumsError from "../utils/EnumsError.js";
import messageError from "../utils/ErrorCauseMessage.js";
import { createPasswordHash } from "../utils/utils.js";

export default class UsersController {
  /**
   * Obtener usuarios según filtros opcionales.
   *
   * @param {Object} query - Filtros para la búsqueda de usuarios.
   * @returns {Promise<Array>} Lista de usuarios que cumplen con el filtro.
   */
  static get(query = {}) {
    return UserModel.find(query);
  }

  static getByEmail(email) {
    return UserModel.findOne({ email });
  }

  /**
   * Crear un nuevo usuario.
   * Valida que no exista un usuario con el mismo email y encripta la contraseña.
   * @param {string} data.email - Correo electrónico del usuario.
   * @param {string} data.password - Contraseña en texto plano.
   * @param {string} data.name - Nombre del usuario.
   * @returns {Promise<Object>} Usuario creado en la base de datos.
   * @throws CustomError si ya existe un usuario con el mismo email.
   */
  static async create(data) {
    const { email } = data;

    const user = await UsersController.getByEmail(email);

    if (user) {
      CustomError.create({
        name: "Invalid user data",
        cause: messageError.generatorUserAlreadyExistsError(data),
        message: `User already exists`,
        code: EnumsError.CONFLICT,
      });
    }

    return UserModel.create({
      ...data,
      password: await createPasswordHash(data.password),
    });
  }

  /**
   * Obtener un usuario por su ID.
   *
   * @param {string} uid - ID único del usuario (MongoDB ObjectId).
   * @returns {Promise<Object>} Usuario encontrado.
   * @throws CustomError Si no existe un usuario con el ID especificado.
   */
  static async getById(uid) {
    const user = await UserModel.findById(uid);
    if (!user) {
      CustomError.create({
        name: "User not found",
        cause: messageError.generatorIdError(uid),
        message: `User with '${uid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return user;
  }

  /**
   * Actualizar un usuario por su ID.
   *
   * @param {string} uid - ID único del usuario (MongoDB ObjectId).
   * @param {Object} data - Campos a actualizar del usuario.
   * @returns {Promise<Object>} Usuario actualizado.
   * @throws CustomError Si no existe un usuario con el ID especificado.
   */
  static async updateById(uid, data) {
    const updatedUser = await UserModel.findByIdAndUpdate(uid, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      CustomError.create({
        name: "User not found",
        cause: messageError.generatorIdError(uid),
        message: `User with '${uid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }

    return updatedUser;
  }

  /**
   * Eliminar un usuario por su ID.
   *
   * @param {string} uid - ID único del usuario (MongoDB ObjectId).
   * @returns {Promise<Object>} Usuario eliminado de la base de datos.
   * @throws CustomError Si no existe un usuario con el ID especificado.
   */
  static async deleteById(uid) {
    const result = await UserModel.findByIdAndDelete(uid);
    if (!result) {
      CustomError.create({
        name: "User not found",
        cause: messageError.generatorIdError(uid),
        message: `User with '${uid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return result;
  }
}

/**
 * @file auth.controller.js
 * @description Controlador de autenticación. Maneja login y registro de usuarios,
 * validando credenciales, generando errores personalizados y encriptando contraseñas.
 */

import { CustomError } from "../utils/errors/CustomError.js";
import EnumsError from "../utils/errors/EnumsError.js";
import messageError from "../utils/errors/ErrorCauseMessage.js";
import UsersController from "./users.controller.js";
import { isValidPassword } from "../utils/utils.js";
import UserModel from "../models/user.model.js";
import { createPasswordHash } from "../utils/utils.js";

export default class AuthController {
  /**
   * Autentica a un usuario usando email y password.
   * Verifica que el usuario exista y que la contraseña sea correcta.
   * 
   * @param {string} data.email - Correo electrónico del usuario.
   * @param {string} data.password - Contraseña del usuario.
   * @returns {Promise<Object>} Usuario autenticado.
   * @throws CustomError 401 - Si el usuario no existe o la contraseña es incorrecta.
   */
  static async login(data) {
    const { email, password } = data;

    const user = await UsersController.getByEmail(email);

    if (!user) {
      CustomError.create({
        name: "Invalid user data",
        cause: messageError.generatorUserLoginDataError(),
        message: `Correo o contraseña inválidos`,
        code: EnumsError.UNAUTHORIZED_ERROR,
      });
    }

    if (!isValidPassword(password, user.password)) {
      CustomError.create({
        name: "Invalid user data",
        cause: messageError.generatorUserLoginDataError(),
        message: `Correo o contraseña inválidos`,
        code: EnumsError.UNAUTHORIZED_ERROR,
      });
    }
    return user;
  }

  /**
   * Registra un nuevo usuario en la base de datos.
   * Verifica que no exista un usuario con el mismo email y encripta la contraseña.
   *
   * @param {Object} data - Datos del usuario a registrar.
   * @param {string} data.first_name - Nombre del usuario.
   * @param {string} data.last_name - Apellido del usuario.
   * @param {string} data.email - Correo electrónico del usuario.
   * @param {string} data.password - Contraseña del usuario.
   * @returns {Promise<Object>} Usuario creado.
   * @throws CustomError 409 - Si ya existe un usuario con el mismo email.
   */
  static async register(data) {
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
}

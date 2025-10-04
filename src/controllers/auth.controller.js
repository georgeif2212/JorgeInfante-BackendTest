import { CustomError } from "../utils/CustomError.js";
import EnumsError from "../utils/EnumsError.js";
import messageError from "../utils/ErrorCauseMessage.js";
import UsersController from "./users.controller.js";
import { isValidPassword } from "../utils/utils.js";
import UserModel from "../models/user.model.js";
import { createPasswordHash } from "../utils/utils.js";

export default class AuthController {
  
  static async login(data) {
    const { email, password } = data;
    console.log(email, password);
    if (!email || !password) {
      CustomError.create({
        name: "Invalid user data",
        cause: messageError.generatorUserLoginError(data),
        message: `"There must be an email and password"`,
        code: EnumsError.BAD_REQUEST_ERROR,
      });
    }

    const user = await UsersController.get({ email: email });

    if (!user) {
      CustomError.create({
        name: "Invalid user data",
        cause: messageError.generatorUserLoginDataError(),
        message: `Correo o contraseña inválidos`,
        code: EnumsError.UNAUTHORIZED_ERROR,
      });
    }

    if (!isValidPassword(password, user[0].password)) {
      CustomError.create({
        name: "Invalid user data",
        cause: messageError.generatorUserLoginDataError(),
        message: `Correo o contraseña inválidos`,
        code: EnumsError.UNAUTHORIZED_ERROR,
      });
    }
    return user;
  }


}

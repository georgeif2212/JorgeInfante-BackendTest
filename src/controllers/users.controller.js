// import { createPasswordHash } from "../utils/utils.js";
// import { getFilterAndOpts } from "../utils/utils.js";
import { CustomError } from "../utils/CustomError.js";
import UserModel from "../models/user.model.js";
import EnumsError from "../utils/EnumsError.js";
import messageError from "../utils/ErrorCauseMessage.js";

export default class UsersController {
  static get(query = {}) {
    // const { filter, opts } = getFilterAndOpts(query);
    return UserModel.find();
  }

  static async create(data) {
    return UserModel.create(data);
  }

  static async getById(uid) {
    const user = await UserModel.findById(uid);
    if (!user) {
      CustomError.create({
        name: "User not found",
        cause: messageError.generatorUserIdError(uid),
        message: `User with '${uid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }
    return user;
  }

  static async updateById(uid, data) {
    const updatedUser = await UserModel.findByIdAndUpdate(uid, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      CustomError.create({
        name: "User not found",
        cause: messageError.generatorUserIdError(uid),
        message: `User with '${uid}' not found`,
        code: EnumsError.NOT_FOUND_ERROR,
      });
    }

    return updatedUser;
  }

}

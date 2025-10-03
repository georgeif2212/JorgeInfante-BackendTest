// import UsersService from "../services/users.service.js";
import { createPasswordHash } from "../utils/utils.js";
import { getFilterAndOpts } from "../utils/utils.js";
// import { NotFoundException } from "../utils/exception.js";

import UserModel from "../models/user.model.js";

export default class UsersController {
  static get(query = {}) {
    // const { filter, opts } = getFilterAndOpts(query);
    return UserModel.find();
  }

  static async create(data) {
    return UserModel.create(data);
  }

  
}

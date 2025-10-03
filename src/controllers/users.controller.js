// import UsersService from "../services/users.service.js";
import { createPasswordHash } from "../utils/utils.js";
import { getFilterAndOpts } from "../utils/utils.js";
// import { NotFoundException } from "../utils/exception.js";

import UserModel from "../models/user.model.js";

export default class UsersController {
  static get(query = {}) {
    return UserModel.find(query);
  }
}

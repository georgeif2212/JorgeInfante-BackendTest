import { Router } from "express";

// import { bodyUsersValidator } from "../../middlewares/body-users-validator.middleware.js";
// import { emailUserValidator } from "../../middlewares/email-user-validator.middleware.js";
import UserController from "../../controllers/users.controller.js";

const router = Router();

router.get("/users", async (req, res, next) => {
  try {
    const users = await UserController.get({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});


export default router;

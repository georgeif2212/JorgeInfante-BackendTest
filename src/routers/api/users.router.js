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

router.post("/users", async (req, res, next) => {
  try {
    const { body } = req;
    const user = await UserController.create(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/users/:uid", async (req, res, next) => {
  try {
    const {
      params: { uid },
    } = req;
    const user = await UserController.getById(uid);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/users/:uid", async (req, res, next) => {
  try {
    const {
      body,
      params: { uid },
    } = req;

    const updatedUser = await UserController.updateById(uid, body);

    res.status(200).json(updatedUser); 
  } catch (error) {
    next(error);
  }
});

export default router;

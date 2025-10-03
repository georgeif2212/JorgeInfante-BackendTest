import { Router } from "express";

// import { bodyUsersValidator } from "../../middlewares/body-users-validator.middleware.js";
// import { emailUserValidator } from "../../middlewares/email-user-validator.middleware.js";
import UsersController from "../../controllers/users.controller.js";

const router = Router();

router.get("/users", async (req, res, next) => {
  try {
    const { query } = req;
    const users = await UsersController.get(query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});


router.post("/users", async (req, res, next) => {
  try {
    const { body } = req;
    const user = await UsersController.create(body);
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
    const user = await UsersController.getById(uid);
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

    const updatedUser = await UsersController.updateById(uid, body);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:uid", async (req, res, next) => {
  try {
    const {
      params: { uid },
    } = req;
    await UsersController.deleteById(uid);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router
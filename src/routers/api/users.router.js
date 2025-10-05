import { Router } from "express";
import {
  registerSchema,
  uidSchema,
  updateUserSchema,
} from "../../validators/user.validator.js";
import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import UsersController from "../../controllers/users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("", async (req, res, next) => {
  try {
    const { query } = req;
    const users = await UsersController.get(query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.post(
  "",
  validateInfoMiddleware(registerSchema),
  async (req, res, next) => {
    try {
      const { body } = req;
      const user = await UsersController.create(body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:uid",
  validateInfoMiddleware(uidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { uid },
      } = req;
      const user = await UsersController.getById(uid);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:uid",
  validateInfoMiddleware(uidSchema, "params"),
  validateInfoMiddleware(updateUserSchema),
  async (req, res, next) => {
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
  }
);

router.delete(
  "/:uid",
  validateInfoMiddleware(uidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { uid },
      } = req;
      await UsersController.deleteById(uid);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;

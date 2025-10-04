import { Router } from "express";
import AuthController from "../../controllers/auth.controller.js";
import { generateToken } from "../../utils/utils.js";

const router = Router();

router.post("/auth/login", async (req, res, next) => {
  try {
    const { body } = req;
    const user = await AuthController.login(body);
    const token = generateToken(user);
    res.status(200).json({
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
});


router.post("/auth/register", async (req, res, next) => {
  try {
    const { body } = req;
    const user = await AuthController.register(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});


export default router;

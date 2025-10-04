import { Router } from "express";
import { truckSchema } from "../../validators/truck.validator.js";
import { uidSchema } from "../../validators/user.validator.js";
import validateInfoMiddleware from "../../middlewares/validateInfo.middleware.js";
import TrucksController from "../../controllers/trucks.controller.js";

const router = Router();

router.get("/trucks", async (req, res, next) => {
  try {
    const { query } = req;
    const trucks = await TrucksController.get(query);
    res.status(200).json(trucks);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/trucks",
  validateInfoMiddleware(truckSchema),
  async (req, res, next) => {
    try {
      const { body } = req;
      const truck = await TrucksController.create(body);
      res.status(201).json(truck);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/trucks/:uid",
  validateInfoMiddleware(uidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { uid },
      } = req;
      const truck = await TrucksController.getById(uid);
      res.status(200).json(truck);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

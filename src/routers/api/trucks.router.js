import { Router } from "express";
import {
  truckSchema,
  updateTruckSchema,
  tidSchema,
} from "../../validators/truck.validator.js";
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
  "/trucks/:tid",
  validateInfoMiddleware(tidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { tid },
      } = req;
      const truck = await TrucksController.getById(tid);
      res.status(200).json(truck);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/trucks/:tid",
  validateInfoMiddleware(tidSchema, "params"),
  validateInfoMiddleware(updateTruckSchema),
  async (req, res, next) => {
    try {
      const {
        body,
        params: { tid },
      } = req;

      const updatedTruck = await TrucksController.updateById(tid, body);

      res.status(200).json(updatedTruck);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/trucks/:tid",
  validateInfoMiddleware(tidSchema, "params"),
  async (req, res, next) => {
    try {
      const {
        params: { tid },
      } = req;
      const deletedTruck = await TrucksController.deleteById(tid);
      res.status(200).json(deletedTruck);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

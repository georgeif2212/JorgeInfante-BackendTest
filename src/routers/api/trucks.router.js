import { Router } from "express";
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



export default router;

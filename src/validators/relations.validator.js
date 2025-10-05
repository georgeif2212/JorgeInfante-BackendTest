import UsersController from "../controllers/users.controller.js";
import TrucksController from "../controllers/trucks.controller.js";
import LocationsController from "../controllers/locations.controller.js";

export const checkRelations = async (
  userId,
  truckId,
  originId,
  destinationId
) => {
  const checks = [];

  if (userId) checks.push(UsersController.getById(userId));
  if (truckId) checks.push(TrucksController.getById(truckId));
  if (originId) checks.push(LocationsController.getById(originId));
  if (destinationId) checks.push(LocationsController.getById(destinationId));

  await Promise.all(checks);
};

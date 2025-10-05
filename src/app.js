import express from "express";
import path from "path";
import { __dirname } from "./utils/utils.js";
import usersRouter from "./routers/api/users.router.js";
import authRouter from "./routers/api/auth.router.js";
import trucksRouter from "./routers/api/trucks.router.js";
import locationsRouter from "./routers/api/locations.router.js";
import ordersRouter from "./routers/api/orders.router.js";

import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// * Ruta base de prueba
app.get("/", (req, res) => {
  res.send("Server funcionando ");
});

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/trucks", trucksRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/orders", ordersRouter);

// ! Middleware de error
app.use(errorHandlerMiddleware);

export default app;

import express from "express";
import path from "path";
import { __dirname } from "./utils/utils.js";
import usersRouter from "./routers/api/users.router.js";
import authRouter from "./routers/api/auth.router.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// * Ruta base de prueba
app.get("/", (req, res) => {
  res.send("Server funcionando ");
});

app.use("/api", usersRouter, authRouter);

// ! Middleware de error
app.use(errorHandlerMiddleware);

export default app;

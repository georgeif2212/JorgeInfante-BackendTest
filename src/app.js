import express from "express";
import path from "path";
import { __dirname } from "./utils/utils.js";
import usersRouter from "./routers/api/users.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// * Ruta base de prueba
app.get("/", (req, res) => {
  res.send("Server funcionando ");
});

app.use("/api", usersRouter);

// * Middleware de manejo de errores
app.use((error, req, res, next) => {
  const message =
    error instanceof Error
      ? error.message
      : `Ha ocurrido un error desconocido 😨: ${error}`;
  res.status(error.statusCode || 500).json({ status: "error", message });
});

export default app;

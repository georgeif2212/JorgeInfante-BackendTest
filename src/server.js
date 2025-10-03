import http from "http";
import config from "./config/config.js";
import app from "./app.js";
import { initDB } from "./db/mongodb.js";

// * Creamos el servidor HTTP usando Express
const server = http.createServer(app);
const PORT = config.port;

// * Inicializamos la base de datos antes de levantar el servidor
await initDB();

// * Iniciamos el servidor en el puerto configurado
server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT} 🚀`);
});

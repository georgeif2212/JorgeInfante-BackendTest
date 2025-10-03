import mongoose from "mongoose";
import config from "../config/config.js";

// Función para inicializar la conexión a MongoDB usando Mongoose
export const initDB = async () => {
  try {
    const URI = config.mongoUri; // Tomamos la URI de la configuración
    await mongoose.connect(URI); // Conectamos a la base de datos
    console.log("Database connected ");
  } catch (error) {
    // Mostramos un error si no se puede conectar
    console.error("Error connecting to database:", error.message);
  }
};

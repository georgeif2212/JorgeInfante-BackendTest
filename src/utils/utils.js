// Importamos módulos nativos de Node
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Convierte la URL del módulo actual en una ruta de archivo normal
const __filename = fileURLToPath(import.meta.url);

// Obtenemos la carpeta donde está el archivo actual
// Esto recrea __dirname en ES Modules, que no existe por defecto
export const __dirname = path.dirname(__filename);

const JWT_SECRET = config.jwtSecret;

export const createPasswordHash = (password) =>
  bcrypt.hash(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user_password) =>
  bcrypt.compareSync(password, user_password);

export const generateToken = (user, type = "auth") => {
  const { _id, name, email } = user;
  const payload = { _id, name, email, type };
  const expiresIn = type === "auth" ? "30m" : "1h";
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * @file user.model.js
 * @description Esquema de Mongoose para la colección de usuarios.
 * Define la estructura, tipos y restricciones de los documentos de usuario.
 */

import mongoose, { Schema } from "mongoose";

/**
 * UserSchema
 * @type {Schema}
 * @property {string} name - Nombre completo del usuario. Requerido.
 * @property {string} email - Correo electrónico del usuario. Requerido, único, en minúsculas e indexado.
 * @property {string} password - Contraseña del usuario. Requerido, se almacena en formato hash.
 * @property {Date} createdAt - Fecha de creación del documento (generada automáticamente por timestamps).
 * @property {Date} updatedAt - Fecha de última actualización del documento (generada automáticamente por timestamps).
 */
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

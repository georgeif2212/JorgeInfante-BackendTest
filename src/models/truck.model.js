/**
 * @file truck.model.js
 * @description Modelo Mongoose para la entidad Truck.
 *              Define la estructura de un camión, sus campos, tipos, validaciones y referencias.
 */

import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * Esquema para camiones.
 * - `user`: referencia al usuario propietario del camión (ObjectId de la colección User).
 * - `year`: año del camión, requerido.
 * - `color`: color del camión, requerido.
 * - `plates`: placas del camión, único, mayúsculas y sin espacios innecesarios.
 *
 * Configuración adicional:
 * - timestamps: crea campos `createdAt` y `updatedAt` automáticamente.
 * - versionKey: deshabilita `__v`.
 */
const TruckSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    plates: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Truck", TruckSchema);

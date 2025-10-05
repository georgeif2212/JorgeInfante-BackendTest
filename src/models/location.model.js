/**
 * @file location.model.js
 * @description Modelo Mongoose para la entidad Location.
 *              Representa un lugar con dirección, coordenadas y place_id único.
 */

import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * Esquema para ubicaciones.
 * - `address`: dirección completa del lugar, requerida.
 * - `place_id`: ID único de Google Places, requerido y único.
 * - `latitude`: coordenada latitud, requerida.
 * - `longitude`: coordenada longitud, requerida.
 *
 * Configuración adicional:
 * - timestamps: crea campos `createdAt` y `updatedAt` automáticamente.
 * - versionKey: deshabilita `__v`.
 */
const LocationSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    place_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model("Location", LocationSchema);

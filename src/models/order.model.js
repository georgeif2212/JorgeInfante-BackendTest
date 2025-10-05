import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * Esquema de la colección Order.
 * Representa una orden de transporte, vinculando un usuario, un camión y ubicaciones de origen y destino.
 *
 * @typedef {Object} Order
 * @property {mongoose.Types.ObjectId} user - ID del usuario que creó la orden. Referencia al modelo `User`.
 * @property {mongoose.Types.ObjectId} truck - ID del camión asignado a la orden. Referencia al modelo `Truck`.
 * @property {String} status - Estado actual de la orden. Valores posibles: `"created"`, `"in transit"`, `"completed"`. Por defecto `"created"`.
 * @property {mongoose.Types.ObjectId} pickup - Ubicación de recogida. Referencia al modelo `Location`.
 * @property {mongoose.Types.ObjectId} dropoff - Ubicación de entrega. Referencia al modelo `Location`.
 * @property {Date} createdAt - Fecha de creación del documento (generada automáticamente).
 * @property {Date} updatedAt - Fecha de última actualización del documento (generada automáticamente).
 */
const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    truck: {
      type: Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "in transit", "completed"],
      default: "created",
      required: true,
    },
    pickup: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    dropoff: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default model("Order", OrderSchema);

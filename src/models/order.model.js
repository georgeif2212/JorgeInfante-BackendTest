import mongoose from "mongoose";

const { Schema, model } = mongoose;

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

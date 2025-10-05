import mongoose from "mongoose";

const { Schema, model } = mongoose;

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

import mongoose from "mongoose";
import db from "./db.js";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
  role: { type: String, default: "user" },
  source: { type: String },
  documents: { type: Array, default: [] },
  last_connection: { type: String },
});

export const usersModel = db.model(usersCollection, usersSchema);

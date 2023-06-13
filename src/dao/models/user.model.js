import mongoose from "mongoose";
import db from "./db.js";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  age: Number,
  password: String,
  role: String,
});

export const usersModel = db.model(usersCollection, usersSchema);

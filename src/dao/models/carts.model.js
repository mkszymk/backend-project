import mongoose from "mongoose";
import db from "./db.js";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: { type: Array },
});

export const cartsModel = db.model(cartsCollection, cartsSchema);

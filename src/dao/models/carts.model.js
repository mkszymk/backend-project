import mongoose from "mongoose";
import db from "./db.js";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: { type: Array },
});

cartsSchema.plugin(mongoosePaginate);

export const cartsModel = db.model(cartsCollection, cartsSchema);

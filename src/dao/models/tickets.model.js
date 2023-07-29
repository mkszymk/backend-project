import mongoose from "mongoose";
import db from "./db.js";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  purchase_datetime: { type: String },
  amount: Number,
  purchaser: String,
});

export const ticketsModel = db.model(ticketsCollection, ticketsSchema);

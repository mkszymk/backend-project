import mongoose from "mongoose";
import db from "./db.js";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
  user: String,
  message: String,
});

export const messagesModel = db.model(messagesCollection, messagesSchema);

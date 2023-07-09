import mongoose from "mongoose";
import config from "../../config/config.js";

mongoose.connect(config.mongoUrl);

const db = mongoose.connection;

db.on("error", console.log.bind(console, "Error connecting to db"));
db.once("open", () => {
  console.log("Conexión exitosa a MongoDB.");
});

export default db;

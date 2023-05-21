import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://admin:admindb@ecommercebackend.frngmnt.mongodb.net/?retryWrites=true&w=majority"
);

const db = mongoose.connection;

db.on("error", console.log.bind(console, "Error connecting to db"));
db.once("open", () => {
  console.log("Conexión exitosa a MongoDB.");
});

export default db;

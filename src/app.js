import productsRouter from "../routes/products.router.js";
import cartsRouter from "../routes/carts.router.js";
import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080, () => {
  console.log("Escuchando en 8080");
});

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import session from "express-session";

const app = express();

app.engine("handlebars", handlebars.engine());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "0X848fd%!fds",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/static", express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Escuchando en 8080");
});

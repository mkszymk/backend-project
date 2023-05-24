import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import ProductManager from "./dao/managers/FileSystem/ProductManager.js";
import { Server } from "socket.io";
import DBMessageManager from "./dao/managers/DB/MessageManager.db.js";

const productManager = new ProductManager();
const messageManager = new DBMessageManager();

const app = express();

app.engine("handlebars", handlebars.engine());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Escuchando en 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  socket.emit("updateList", await productManager.getProducts());
  socket.emit("updateChat", await messageManager.getChats());

  socket.on("addProduct", async (data) => {
    const addProdResponse = await productManager.addProduct(
      data.title,
      data.description,
      data.price,
      data.thumbnail,
      data.code,
      data.stock,
      data.status,
      data.category
    );
    socket.emit("updateList", await productManager.getProducts());
  });

  socket.on("sendMessage", async (data) => {
    await messageManager.addChat(data.user, data.message);
    socketServer.emit("updateChat", await messageManager.getChats());
  });
});

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";

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

initializePassport();

app.use(passport.initialize());
app.use(passport.session());

app.use("/static", express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(config.port, () => {
  console.log("Escuchando en " + config.port);
});

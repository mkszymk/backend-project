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
import errorMiddleware from "./middlewares/errors/index.js";
import { addLogger } from "./utils/logger.js";

const app = express();

app.use("/static", express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(addLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();

app.use(passport.initialize());
app.use(
  session({
    secret: "0X848fd%!fds",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use("/loggerTest", (req, res) => {
  req.logger.debug(`${new Date().toLocaleTimeString()} - Testing debug log.`);
  req.logger.info(`${new Date().toLocaleTimeString()} - Testing info log.`);
  req.logger.warning(
    `${new Date().toLocaleTimeString()} - Testing warning log.`
  );
  req.logger.error(`${new Date().toLocaleTimeString()} - Testing error log.`);
  req.logger.fatal(`${new Date().toLocaleTimeString()} - Testing fatal log.`);
  res.send("Testing logger.");
});

app.use(errorMiddleware);

const httpServer = app.listen(config.port, () => {
  console.log("Escuchando en " + config.port);
});

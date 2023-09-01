import sessionsRouter from "./routes/sessions.router.js";
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import errorMiddleware from "./middlewares/errors/index.js";
import { addLogger } from "./utils/logger.js";
import ViewsRouter from "./routes/views.js";
import CartsRouter from "./routes/carts.js";
import ProductsRouter from "./routes/products.js";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();

app.use(cookieParser());

app.use("/static", express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(addLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();

app.use(passport.initialize());

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "FastMarket",
      description: "API Fastmarket para ecommerces.",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/api/carts", CartsRouter);
app.use("/api/products", ProductsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", ViewsRouter);
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

import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import passport from "passport";
import config from "./config/config.js";
import errorMiddleware from "./middlewares/errors/index.js";
import { addLogger } from "./utils/logger.js";
import ViewsRouter from "./routes/views.router.js";
import CartsRouter from "./routes/carts.router.js";
import ProductsRouter from "./routes/products.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import UsersRouter from "./routes/users.router.js";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import initializePassport from "./config/passport.config.js";
import privateAPI from "./middlewares/sessions/privateAPI.js";

const app = express();

app.use(cookieParser());

app.use("/static", express.static(__dirname + "/public"));
app.use("/private", privateAPI, express.static(__dirname + "/private"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(addLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
initializePassport();

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
app.use("/api/users", UsersRouter);
app.use("/", ViewsRouter);

app.use(errorMiddleware);

const httpServer = app.listen(config.port, () => {
  console.log("Escuchando en " + config.port);
});

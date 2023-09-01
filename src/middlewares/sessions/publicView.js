import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import { loggerOutput } from "../../utils/logger.js";
export default async (req, res, next) => {
  const token = req.cookies["authToken"];
  if (token) {
    try {
      jwt.verify(token, config.jwtToken);
      return res.redirect("/products");
    } catch (e) {
      res.clearCookie("authToken");
      return next();
    }
  } else {
    loggerOutput("debug", `[PublicViewMiddlew] No token found, next.`);
    next();
  }
};

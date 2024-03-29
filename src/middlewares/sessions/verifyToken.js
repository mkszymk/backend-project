import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import { loggerOutput } from "../../utils/logger.js";

export default async (req, res, next) => {
  let token;
  if (req.cookies["authToken"]) {
    token = req.cookies["authToken"];
  } else if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    loggerOutput("debug", `[VerifyToken] No token found, redirecting...`);
    return res.redirect("/login");
  }
  loggerOutput("debug", `[VerifyToken] Token: ${token.slice(0, 5)}`);
  try {
    req.user = jwt.verify(token, config.jwtToken).user;
    next();
  } catch (e) {
    res.clearCookie("authToken");
    res.redirect("/login");
  }
};

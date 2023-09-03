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
    loggerOutput("debug", `[PrivateAPI] No token found, redirecting...`);
    return res
      .status(401)
      .send({ success: false, message: "Auth token must be valid" });
  }
  loggerOutput("debug", `[PrivateAPI] Token: ${token.slice(0, 5)}`);
  try {
    req.user = jwt.verify(token, config.jwtToken).user;
    next();
  } catch (e) {
    res.clearCookie("authToken");
    return res
      .status(401)
      .send({ success: false, message: "Auth token must be valid" });
  }
};

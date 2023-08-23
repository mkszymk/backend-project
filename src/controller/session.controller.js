import UserDTO from "../dao/DTOs/user.dto.js";
import { generateUserToken } from "../utils.js";
import { loggerOutput } from "../utils/logger.js";

const github = async (req, res) => {};

const githubcallback = async (req, res) => {
  const user = req.user;
  loggerOutput("info", `[SessionController] Github user login`);
  const token = generateUserToken(user);
  try {
    res.cookie("authToken", token, { httpOnly: true });
  } catch (e) {
    loggerOutput("error", `[SessionController] Cookie error: ${e}`);
  }
  res.redirect("/products");
};

const current = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const user = new UserDTO(req.user);
  return res.status(200).send(user.getRelevantInfo());
};

const adminRoute = (req, res, next) => {
  if (!req.session.user)
    return res.status(400).send({ error: "400 - No session found." });
  if (req.session.user.role == "user") {
    return res.status(403).send({ error: "403 - Forbidden" });
  } else {
    return next();
  }
};

const userRoute = (req, res, next) => {
  if (!req.session.user)
    return res.status(400).send({ error: "400 - No session found." });
  if (req.session.user.role == "admin") {
    return res.status(403).send({ error: "403 - Forbidden" });
  } else {
    return next();
  }
};

export { github, githubcallback, current, adminRoute, userRoute };

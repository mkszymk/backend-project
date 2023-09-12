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
  if (!req.user) return res.status(404).send({ error: "User not found" });
  const user = new UserDTO(req.user);
  return res.status(200).send(user.getRelevantInfo());
};

export { github, githubcallback, current };

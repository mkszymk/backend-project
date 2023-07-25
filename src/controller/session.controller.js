import UserDTO from "../dao/DTOs/user.dto.js";

const github = async (req, res) => {};

const githubcallback = async (req, res) => {
  req.session.user = new UserDTO(req.user).getRelevantInfo();
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

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

export { github, githubcallback, current };

import UserDTO from "../dao/DTOs/user.dto.js";

const github = async (req, res) => {};

const githubcallback = async (req, res) => {
  req.session.user = req.user;
  res.redirect("/products");
};

const current = async (req, res) => {
  const user = new UserDTO(req.user);
  res.status(200).send(user.getRelevantInfo());
};

export { github, githubcallback, current };

const github = async (req, res) => {};

const githubcallback = async (req, res) => {
  req.session.user = req.user;
  res.redirect("/products");
};

const current = async (req, res) => {
  res.status(200).send(req.session.user);
};

export { github, githubcallback, current };

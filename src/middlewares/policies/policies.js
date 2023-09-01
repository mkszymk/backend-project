export const usePolicies = (policies) => async (req, res, next) => {
  const role = req.user.role;
  if (policies.includes(role)) {
    return next();
  } else {
    return res
      .status(403)
      .send({ success: false, message: "User must be: " + policies });
  }
};

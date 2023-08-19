import { Router } from "express";
import { loggerOutput } from "../utils/logger.js";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (e) {
        loggerOutput("error", e);
        params[1].status(500).send(e);
      }
    });
  }

  getRouter() {
    return this.router;
  }

  handlePolicies = (policies) => (req, res, next) => {
    loggerOutput("debug", `POLICY required: ${policies}`);
    const user = req.user;
    loggerOutput("debug", `auth headers: ${req.headers.authorization}`);
    if (policies.includes("PUBLIC")) {
      //if (user) return res.redirect("http://localhost:8080/products");
      return next();
    }
    if (!user) return res.send({ success: false, message: "Forbidden" });
    loggerOutput(
      "debug",
      `POLICY:::${policies} // ROL:::${user.role.toUpperCase()}`
    );
    if (!policies.includes(user.role.toUpperCase()))
      return res.status(403).send({ success: false, message: "Forbidden" });
    next();
  };

  init() {}

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
}

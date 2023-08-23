import { Router } from "express";
import { loggerOutput } from "../utils/logger.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import passport from "passport";

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
        loggerOutput("error", `[Router] applyCallbacks error: ${e}`);
        params[1].status(500).send(e);
      }
    });
  }

  getRouter() {
    return this.router;
  }

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === "BYPASS") {
      return next();
    }
    loggerOutput("debug", `[Router policies] --- Start ---`);
    let token = null;
    if (req.cookies["authToken"] || req.headers.authorization) {
      if (
        req.cookies["authToken"] &&
        req.headers.authorization &&
        req.cookies["authToken"] == req.headers.authorization.split(" ")[1]
      ) {
        loggerOutput(
          "warning",
          `[RouterPolicies] Two different tokens received`
        );
        return res.status(401).send({
          success: false,
          message: "Tokens does not match, unauthorized.",
        });
      }

      if (req.cookies["authToken"] == undefined) {
        token = req.headers.authorization.split(" ")[1];
        loggerOutput(
          "debug",
          `[RouterPolicies] Saved token from header: ${token.slice(0, 5)}...`
        );
      } else {
        token = req.cookies["authToken"];
        loggerOutput(
          "debug",
          `[RouterPolicies] Saved token from cookie: ${token.slice(0, 5)}...`
        );
      }
    }

    if (policies.includes("PUBLIC")) {
      loggerOutput("debug", "[Router policies] Public policy");
      if (policies.includes("PVIEW")) {
        loggerOutput("debug", "[Router policies] Public view, redirecting...");
        if (token) return res.redirect("/products");
      }
      return next();
    }

    if (!token) return res.status(401).redirect("/");
    req.headers.authorization = `Bearer ${token}`;
    let { user } = jwt.verify(token, config.jwtToken);
    loggerOutput(
      "debug",
      `[RouterPolicies] User role: ${user.role} / Policies: ${policies}`
    );
    if (!policies.includes(user.role.toUpperCase()))
      return res.status(403).send({ success: false, message: "Forbidden" });
    loggerOutput("debug", `[Router policies] User logged: ${user._id}`);
    req.user = user;
    next();
    loggerOutput("debug", `[Router policies] --- End ---`);
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

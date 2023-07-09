import { Router } from "express";
import { createHash } from "../utils.js";
import UserManager from "../dao/managers/DB/UserManager.db.js";
import passport from "passport";

const router = Router();

const userManager = new UserManager();

const privateRoute = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const publicRoute = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    res.redirect("/products");
  }
};

router.get("/products", privateRoute, async (req, res) => {
  const { email } = req.session.user;
  const userData = await userManager.getUserData(email);
  if (!userData.success) return;
  const { page } = req.query || 1;
  const products = await (
    await fetch("http://localhost:8080/api/products?page=" + page)
  ).json();
  res.render("home", {
    style: "style.css",
    products: await products,
    ...userData.payload,
    admin: userData.payload.role === "admin" ? true : false,
  });
});

router.get("/cart/", privateRoute, async (req, res) => {
  const cartId = req.session.user.cart;
  const cart = await (
    await fetch("http://localhost:8080/api/carts/" + cartId)
  ).json();
  res.render("cart", { style: "style.css", cart: await cart });
});

router.get("/login", publicRoute, async (req, res) => {
  res.render("login", {
    style: "credentials.css",
    code: req.query.e,
    message: req.query.m,
  });
});

router.get("/register", publicRoute, async (req, res) => {
  res.render("register", { style: "credentials.css" });
});

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login?e=400&m=Credenciales inválidas",
  }),
  async (req, res) => {
    if (!req.user) return res.redirect("/login?e=400&m=Credenciales inválidas");
    req.session.user = {
      name: req.user.name,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
      cart: req.user.cart,
    };
    res.redirect("/products");
  }
);

router.get("/", publicRoute, async (req, res) => {
  res.redirect("/login");
});

router.get("/logout", privateRoute, async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/lostpassword", publicRoute, async (req, res) => {
  res.render("lostpassword", {
    style: "credentials.css",
    code: req.query.e,
    message: req.query.m,
  });
});

router.post(
  "/lostpassword",
  passport.authenticate("restorePassword", {
    failureRedirect: "/lostpassword?e=404&m=Email not found",
  }),
  async (req, res) => {
    res.redirect("/login");
  }
);

export default router;

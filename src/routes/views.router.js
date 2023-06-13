import { Router } from "express";
import UserManager from "../dao/managers/DB/UserManager.db.js";

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
    res.redirect("/profile");
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

router.get("/cart/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await (
    await fetch("http://localhost:8080/api/carts/" + cartId)
  ).json();
  res.render("cart", { style: "style.css", cart: await cart });
});

router.get("/login", publicRoute, (req, res) => {
  res.render("login", {
    style: "credentials.css",
    code: req.query.e,
    message: req.query.m,
  });
});

router.get("/register", publicRoute, (req, res) => {
  res.render("register", { style: "credentials.css" });
});

router.post("/register", publicRoute, async (req, res) => {
  const { name, lastName, age, email, password } = req.body;

  const apiResponse = await userManager.registerUser(
    email,
    password,
    name,
    lastName,
    parseInt(age)
  );

  if (!apiResponse.success) return res.redirect("/register");
  return res.redirect("/login");
});

router.post("/login", publicRoute, async (req, res) => {
  const { email, password } = req.body;
  const apiResponse = await userManager.loginUser(email, password);
  if (apiResponse.login) {
    req.session.user = apiResponse.user;
    res.redirect("/products");
  } else {
    res.redirect("/login?e=" + apiResponse.code + "&m=" + apiResponse.message);
  }
});

router.get("/", publicRoute, async (req, res) => {
  res.redirect("/login");
});

router.get("/logout", privateRoute, (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default router;

import { Router } from "express";
import passport from "passport";
import {
  privateRoute,
  publicRoute,
  getProductsPage,
  getCartPage,
  getLoginPage,
  getRegisterPage,
  postRegister,
  postLogin,
  getMainPage,
  getLogoutPage,
  getLostPasswordPage,
  postLostPassword,
} from "../controller/views.controller.js";

const router = Router();

router.get("/products", privateRoute, getProductsPage);

router.get("/cart/", privateRoute, getCartPage);

router.get("/login", publicRoute, getLoginPage);

router.get("/register", publicRoute, getRegisterPage);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  postRegister
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login?e=400&m=Credenciales inválidas",
  }),
  postLogin
);

router.get("/", publicRoute, getMainPage);

router.get("/logout", privateRoute, getLogoutPage);

router.get("/lostpassword", publicRoute, getLostPasswordPage);

router.post(
  "/lostpassword",
  passport.authenticate("restorePassword", {
    failureRedirect: "/lostpassword?e=404&m=Email not found",
  }),
  postLostPassword
);

export default router;

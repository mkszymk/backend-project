import CustomRouter from "./router.js";
import passport from "passport";
import * as views from "../controller/views.controller.js";
import * as sessions from "../controller/session.controller.js";

export default class ViewsRouter extends CustomRouter {
  init() {
    this.get(
      "/products",
      ["USER", "ADMIN"],
      views.privateRoute,
      views.getProductsPage
    );

    this.get(
      "/cart/",
      ["USER", "ADMIN"],
      views.privateRoute,
      views.getCartPage
    );

    this.get("/login", ["PUBLIC"], views.getLoginPage);

    this.get("/register", ["PUBLIC"], views.getRegisterPage);

    this.post(
      "/register",
      ["PUBLIC"],
      passport.authenticate("register", { failureRedirect: "/register" }),
      views.postRegister
    );

    this.post(
      "/login",
      ["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "/login?e=400&m=Credenciales inválidas",
      }),
      views.postLogin
    );

    this.get("/", ["PUBLIC"], views.getMainPage);

    this.get("/logout", ["USER", "ADMIN"], views.getLogoutPage);

    this.get(
      "/lostpassword",
      ["PUBLIC"],

      views.getLostPasswordPage
    );

    this.post("/lostpassword", ["PUBLIC"], views.postLostPassword);

    this.get(
      "/manageproducts",
      ["ADMIN"],
      views.privateRoute,
      views.getManageProductsPage
    );

    this.post("/manageproducts", ["USER", "ADMIN"], views.postAddProduct);

    this.get("/ticket/:tid", ["USER"], views.getTicketPage);

    this.post("/cart/purchase", ["USER"], views.postPurchase);

    this.delete("/cart/empty", ["USER"], views.deleteEmptyCart);

    this.get("/mockingproducts", ["PUBLIC"], views.getMockingProducts);

    this.get("/restorepassword", ["PUBLIC"], views.getRestorePassword);

    this.post("/restorepassword", ["PUBLIC"], views.postRestorePassword);
  }
}

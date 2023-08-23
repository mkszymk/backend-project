import CustomRouter from "./router.js";
import passport from "passport";
import * as views from "../controller/views.controller.js";
import { usersModel } from "../dao/models/user.model.js";
import { loggerOutput } from "../utils/logger.js";

export default class ViewsRouter extends CustomRouter {
  init() {
    this.get("/products", ["USER", "ADMIN", "PREMIUM"], views.getProductsPage);

    this.get("/cart/", ["USER", "ADMIN", "PREMIUM"], views.getCartPage);

    this.get("/login", ["PUBLIC", "PVIEW"], views.getLoginPage);

    this.get("/register", ["PUBLIC", "PVIEW"], views.getRegisterPage);

    this.post(
      "/register",
      ["PUBLIC", "PVIEW"],
      passport.authenticate("register", {
        failureRedirect: "/register",
        session: false,
      }),
      views.postRegister
    );

    this.post(
      "/login",
      ["PUBLIC", "PVIEW"],
      passport.authenticate("login", {
        session: false,
        failureRedirect: "/login?e=400&m=Credenciales inválidas",
      }),
      views.postLogin
    );

    this.get("/", ["PUBLIC", "PVIEW"], views.getMainPage);

    this.get("/logout", ["USER", "ADMIN", "PREMIUM"], views.getLogoutPage);

    this.get(
      "/lostpassword",
      ["PUBLIC", "PVIEW"],

      views.getLostPasswordPage
    );

    this.post("/lostpassword", ["PUBLIC", "PVIEW"], views.postLostPassword);

    this.get(
      "/manageproducts",
      ["ADMIN", "PREMIUM"],
      views.getManageProductsPage
    );

    this.post("/manageproducts", ["ADMIN", "PREMIUM"], views.postAddProduct);

    this.get("/ticket/:tid", ["USER", "PREMIUM"], views.getTicketPage);

    this.post("/cart/purchase", ["USER", "PREMIUM"], views.postPurchase);

    this.delete("/cart/empty", ["USER", "PREMIUM"], views.deleteEmptyCart);

    this.get("/mockingproducts", ["PUBLIC", "PVIEW"], views.getMockingProducts);

    this.get("/restorepassword", ["PUBLIC", "PVIEW"], views.getRestorePassword);

    this.post(
      "/restorepassword",
      ["PUBLIC", "PVIEW"],
      views.postRestorePassword
    );

    this.get("/api/users/premium/:uid", ["BYPASS"], async (req, res) => {
      loggerOutput("debug", `Changing user role...`);
      const uid = req.params.uid;
      try {
        const user = await usersModel.findOne({ _id: uid });
        if (!user) {
          return res
            .status(404)
            .send({ success: false, message: "User not found" });
        }
        if (user.role == "premium") {
          user.role = "user";
        } else {
          user.role = "premium";
        }
        await user.save();
        loggerOutput("info", `Role changed!`);
        res.send("Se actualizó el rol para: " + user.email);
      } catch (e) {
        loggerOutput("error", `Role change error: ${e}`);
      }
    });
  }
}

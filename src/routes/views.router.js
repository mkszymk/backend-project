import passport from "passport";
import * as views from "../controller/views.controller.js";
import { usersModel } from "../dao/models/user.model.js";
import { loggerOutput } from "../utils/logger.js";
import { Router } from "express";
import verifyToken from "../middlewares/sessions/verifyToken.js";
import publicView from "../middlewares/sessions/publicView.js";
import { usePolicies } from "../middlewares/policies/policies.js";

const router = Router();

router.get("/products", verifyToken, views.getProductsPage);

router.get("/cart/", verifyToken, views.getCartPage);

router.get("/login", publicView, views.getLoginPage);

router.get("/register", publicView, views.getRegisterPage);

router.post("/register", views.postRegister);

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/login?e=400&m=Credenciales inválidas",
  }),
  views.postLogin
);

router.get("/", publicView, views.getMainPage);

router.get("/logout", verifyToken, views.getLogoutPage);

router.get("/lostpassword", publicView, views.getLostPasswordPage);

router.post("/lostpassword", publicView, views.postLostPassword);

router.get(
  "/manageproducts",
  verifyToken,
  usePolicies(["admin", "premium"]),
  views.getManageProductsPage
);

router.post(
  "/manageproducts",
  verifyToken,
  usePolicies(["admin", "premium"]),
  views.postAddProduct
);

router.get("/ticket/:tid", verifyToken, views.getTicketPage);

router.post("/cart/purchase", verifyToken, views.postPurchase);

router.delete("/cart/empty", verifyToken, views.deleteEmptyCart);

router.get("/mockingproducts", views.getMockingProducts);

router.get("/restorepassword", publicView, views.getRestorePassword);

router.post("/restorepassword", publicView, views.postRestorePassword);

router.get("/api/users/premium/:uid", async (req, res) => {
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

export default router;

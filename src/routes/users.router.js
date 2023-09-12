import { Router } from "express";
import passport from "passport";
import {
  postRegister,
  uploadDocument,
  changeRole,
} from "../controller/users.controller.js";
import privateAPI from "../middlewares/sessions/privateAPI.js";
import { uploader } from "../middlewares/multer/uploader.js";
import { usePolicies } from "../middlewares/policies/policies.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  postRegister
);

router.post(
  "/:uid/documents",
  privateAPI,
  uploader.single("docs"),
  uploadDocument
);

router.get("/premium/:uid", privateAPI, usePolicies(["admin"]), changeRole);

export default router;

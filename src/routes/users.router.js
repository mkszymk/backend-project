import { Router } from "express";
import passport from "passport";
import {
  postRegister,
  uploadDocument,
  changeRole,
  getUsers,
  deleteUsers,
  getUser,
  deleteUser,
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

router.get("/", privateAPI, usePolicies(["admin"]), getUsers);

router.delete("/", privateAPI, usePolicies(["admin"]), deleteUsers);

router.get("/:uid", privateAPI, usePolicies(["admin"]), getUser);

router.delete("/:uid", privateAPI, usePolicies(["admin"]), deleteUser);

export default router;

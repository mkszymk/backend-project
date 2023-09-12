import { Router } from "express";
import passport from "passport";
import {
  github,
  githubcallback,
  current,
} from "../controller/session.controller.js";

const router = Router();

router.get(
  "/github",
  passport.authenticate(
    "github",
    { scope: ["user:email"], session: false },
    github
  )
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  githubcallback
);

router.get("/current", current);

export default router;

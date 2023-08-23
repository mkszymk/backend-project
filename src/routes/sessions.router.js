import { Router } from "express";
import passport from "passport";
import { github, githubcallback } from "../controller/session.controller.js";

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

export default router;

import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { usersModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import DBCartManager from "../dao/managers/DB/CartManager.db.js";
import config from "./config.js";

const cartManager = new DBCartManager();
const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { name, lastName, email, age } = req.body;
        try {
          let user = await usersModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const newUser = {
            name,
            lastName,
            email,
            age,
            password: createHash(password),
            cart: (await cartManager.addCart()).cartId,
          };
          let result = await usersModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "restorePassword",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, newPassword, done) => {
        try {
          const user = await usersModel.findOne({ email: username });
          if (!user) return done(null, false);
          user.password = createHash(newPassword);
          await user.save();
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await usersModel.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user =
            (await usersModel.findOne({ email: profile._json.email })) ||
            (await usersModel.findOne({ email: profile.username }));
          if (!user) {
            let newUser = {
              name: profile._json.name,
              lastName: "",
              age: 0,
              email: profile._json.email
                ? profile._json.email
                : profile.username,
              password: "",
              cart: (await cartManager.addCart()).cartId,
            };
            let result = await usersModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await usersModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;

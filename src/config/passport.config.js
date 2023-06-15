import passport from "passport";
import local from "passport-local";
import { usersModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

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
            return done(null, flase);
          }
          const newUser = {
            name,
            lastName,
            email,
            age,
            password: createHash(password),
          };
          let result = await usersModel.create(newUser);
          return done(null, result);
        } catch (e) {
          return done("Error al obtener el user: " + error);
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

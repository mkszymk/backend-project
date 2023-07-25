import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { usersModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { CartManager } from "../services/factory.js";
import config from "./config.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import nodemailer from "nodemailer";

const cartManager = new CartManager();
const LocalStrategy = local.Strategy;

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmailUser,
    pass: config.gmailPassword,
  },
});

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
          const newUser = new UserDTO({
            name,
            lastName,
            email,
            age,
            password,
            cart: (await cartManager.addCart()).cartId,
            source: "register",
          });
          let result = await usersModel.create(newUser);
          await transport.sendMail({
            from: "eCommerce",
            to: email,
            subject: "Usuario creado",
            html: `
            <div>
              <h1>Usuario creado!</h1>
              <h3>Hola ${name}, se ha creado tu usuario en ecommerce.</h3>
            </div>
            `,
            attachments: [],
          });
          console.log("Correo enviado!");
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
            let newUser = new UserDTO({
              name: profile._json.name,
              lastName: "",
              age: 0,
              email: profile._json.email
                ? profile._json.email
                : profile.username,
              password: "",
              cart: (await cartManager.addCart()).cartId,
              source: "github",
            });
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

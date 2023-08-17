import jwt from "jsonwebtoken";
import config from "../config/config.js";
import nodemailer from "nodemailer";
import { loggerOutput } from "./logger.js";

const secret = config.jwtToken;

export const generateToken = (email) => {
  loggerOutput("debug", "Generando token de restauración de contraseña.");
  const token = jwt.sign(email, secret, { expiresIn: "1h" });
  loggerOutput(
    "debug",
    "Token generado de restauración de contraseña: " + token
  );
  return token;
};

export const validateToken = (token) => {
  loggerOutput("debug", "Validando token de restauración de contraseña.");
  const tokenValidation = jwt.verify(token, secret, (error) =>
    error ? false : true
  );
  loggerOutput(
    "debug",
    "Validación de token de restauración de contraseña: " + tokenValidation
  );
  return tokenValidation;
};

export const decryptToken = (token) => {
  loggerOutput("debug", "Desecriptando token...");
  const result = jwt.decode(token);
  return result;
};

export const sendRestoreMail = async (email, token) => {
  loggerOutput("info", "Enviando correo de restauración a " + email);
  const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: config.gmailUser,
      pass: config.gmailPassword,
    },
  });

  const link = "http://localhost:8080/restorepassword?token=" + token;

  loggerOutput("debug", `Link de restauración de contraseña: ${link}`);

  const message = `
  <h1>Recuperar contrasñea</h1>
  <p>Has intentado restaurar tu contraseña. Por favor, <a href='${link}' target='_blank'>haz click aquí para actualizarla</a></p>

  `;

  try {
    await transport.sendMail({
      to: email,
      subject: "Restaurar contraseña",
      html: message,
    });
    return true;
  } catch (e) {
    loggerOutput(
      "warning",
      "No se pudo enviar el correo de restauración de contraseña."
    );
    loggerOutput("warning", e);
    return false;
  }
};

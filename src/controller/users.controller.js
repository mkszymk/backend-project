import { loggerOutput } from "../utils/logger.js";
import { usersService } from "../repositories/index.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import config from "../config/config.js";

const { baseUrl } = config;

export const postRegister = async (req, res) => {
  loggerOutput("debug", `[PostRegisterAPISessions] User registered..`);
  return res.send({ success: true });
};

export const uploadDocument = async (req, res) => {
  loggerOutput("debug", `[UsersController] Received: ${req.body.docType}`);
  const docType = req.body.docType;
  const userId = req.user._id;
  if (!req.file)
    return res
      .status(500)
      .send({ error: 500, message: "File/s not uploaded." });
  const path = `${baseUrl}/${
    docType == "productImg" ? "static" : "private"
  }/${userId}/${
    docType == "productImg"
      ? `products/${req.file.filename}`
      : docType == "profilePic"
      ? `profile/${req.file.filename}`
      : `documents/${req.file.filename}`
  }`;
  const response = await usersService.addDocument(
    userId,
    req.file.filename,
    path
  );
  if (response.success) return res.redirect("/profile");
  return res
    .status(response.error || 500)
    .send({ success: false, info: response });
};

export const changeRole = async (req, res) => {
  loggerOutput("debug", `Changing user role...`);
  const uid = req.params.uid;
  const response = await usersService.changeRole(uid);
  return res.status(response.status).send(response);
};

export const getUsers = async (req, res) => {
  const response = await usersService.getUsers();
  return res.status(response.status).send(response);
};

export const deleteUsers = async (req, res) => {
  const response = await usersService.deleteUsers();
  return res.status(response.status).send(response);
};

export const getUser = async (req, res) => {
  const response = await usersService.getUserById(req.params.uid);
  const user = new UserDTO(response.payload).getRelevantInfo();
  return res.status(response.status).send(user);
};

export const deleteUser = async (req, res) => {
  const response = await usersService.deleteUserById(req.params.uid);
  return res.status(response.status).send(response);
};

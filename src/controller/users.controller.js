import { loggerOutput } from "../utils/logger.js";
import { usersService } from "../repositories/index.js";
import { usersModel } from "../dao/models/user.model.js";

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
  const path = `http://localhost:8080/${
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
  try {
    const user = await usersModel.findOne({ _id: uid });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    if (user.role == "premium") {
      user.role = "user";
      loggerOutput("info", `Role from premium to user!`);
      await user.save();
      return res.send({
        success: true,
        message: "Se actualizó el rol para: " + user.email,
      });
    } else {
      const documents = user.documents;
      let docControl = 0;
      documents.forEach((doc) => {
        const _name = doc.name.split(".")[0];
        if (_name == "doc_id" || _name == "doc_add" || _name == "doc_acc")
          docControl += 1;
      });

      if (docControl === 3) {
        user.role = "premium";
        await user.save();
        return res.send("Se actualizó el rol para: " + user.email);
      } else {
        return res.status(401).send({
          success: false,
          message: "El usuario no terminó de procesar la información.",
        });
      }
    }
  } catch (e) {
    loggerOutput("error", `Role change error: ${e}`);
    return res.status(500).send({ success: false, userApiError: e });
  }
};

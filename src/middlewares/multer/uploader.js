import multer from "multer";
import __dirname from "../../utils.js";
import { loggerOutput } from "../../utils/logger.js";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    loggerOutput("debug", `[Multer] Received: ${req.body.docType}`);
    switch (req.body.docType) {
      case "profilePic": {
        const path = __dirname + `/private/${req.user._id}/profile`;
        loggerOutput("debug", `[Multer] Path: ${path}`);
        if (!fs.existsSync(path)) {
          try {
            fs.mkdirSync(path, { recursive: true });
          } catch (e) {
            loggerOutput("error", `[MulterError] ${e}`);
          }
        }
        cb(null, path);
        break;
      }
      case "productImg": {
        loggerOutput("debug", `[Multer] Switch case: productImg`);
        const path = __dirname + `/public/${req.user._id}/products/`;
        loggerOutput("debug", `[Multer] Path: ${path}`);
        if (!fs.existsSync(path)) {
          try {
            fs.mkdirSync(path, { recursive: true });
          } catch (e) {
            loggerOutput("error", `[MulterError] ${e}`);
          }
        }
        cb(null, path);
        break;
      }
      case "document_id":
      case "document_addr":
      case "document_acc": {
        loggerOutput("debug", `[Multer] Switch case: document`);
        const path = __dirname + `/private/${req.user._id}/documents/`;
        loggerOutput("debug", `[Multer] Path: ${path}`);
        if (!fs.existsSync(path)) {
          try {
            fs.mkdirSync(path, { recursive: true });
          } catch (e) {
            loggerOutput("error", `[MulterError] ${e}`);
          }
        }
        cb(null, path);
        break;
      }
      default: {
        loggerOutput("error", `[Multer] Path error`);
        cb({ error: 400 });
        break;
      }
    }
  },
  filename: function (req, file, cb) {
    loggerOutput("debug", `[Multer] Mimetype: ${file.mimetype}`);
    switch (req.body.docType) {
      case "profilePic": {
        cb(
          null,
          "avatar." +
            file.mimetype.split("/")[file.mimetype.split("/").length - 1]
        );
        break;
      }
      case "productImg":
        cb(
          null,
          Date.now().toString() +
            "." +
            file.mimetype.split("/")[file.mimetype.split("/").length - 1]
        );
        break;
      case "document_id":
        cb(
          null,
          "doc_id." +
            file.mimetype.split("/")[file.mimetype.split("/").length - 1]
        );
        break;
      case "document_addr":
        cb(
          null,
          "doc_add." +
            file.mimetype.split("/")[file.mimetype.split("/").length - 1]
        );
        break;
      case "document_acc":
        cb(
          null,
          "doc_acc." +
            file.mimetype.split("/")[file.mimetype.split("/").length - 1]
        );
        break;
    }
  },
});

export const checkUserAndToken = async (req, res, next) => {
  const urlId = req.params.uid;
  const idInToken = req.user._id;
  if (urlId === idInToken) {
    return next();
  } else {
    return res.status(400).send({
      success: false,
      message: "User token is different from user in URL",
    });
  }
};

export const uploader = multer({ storage });

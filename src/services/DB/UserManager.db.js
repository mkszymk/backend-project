import UserDTO from "../../dao/DTOs/user.dto.js";
import { usersModel } from "../../dao/models/user.model.js";
import { loggerOutput } from "../../utils/logger.js";
import DBCartManager from "./CartManager.db.js";

const cartManager = new DBCartManager();

export default class DBUserManager {
  async createUser({ name, lastName, age, email, password }) {
    if (!email || !password)
      return {
        sucess: false,
        error: 400,
        message: "Email and password are required.",
      };
    try {
      const checkUser = await usersModel.findOne({ email });
      if (checkUser)
        return { success: false, error: 405, message: "Email already taken." };

      const newCart = (await cartManager.addCart()).cartId;
      const newUser = new UserDTO({
        name,
        lastName,
        age,
        email,
        password,
        source: "register",
        cart: newCart,
      });
      const response = await usersModel.create(newUser);
      return { success: true };
    } catch (e) {
      return { success: false, error: 500, message: "Mongo Error: " + e };
    }
  }

  async addDocument(userId, documentName, documentLink) {
    loggerOutput("debug", `[AddDocument] UserID: ${userId}`);
    const user = await usersModel.findOne({ _id: userId });
    if (!user)
      return { success: false, error: 404, message: "User not found." };
    if (
      user.documents.includes({ name: documentName, reference: documentLink })
    )
      return {
        success: false,
        error: 400,
        message: "Document already uploaded",
      };
    try {
      user.documents.push({
        name: documentName,
        reference: documentLink,
      });
      await user.save();
      return { success: true };
    } catch (e) {
      loggerOutput("error", `[UserManagerAddDocument] ${e}`);
      return { success: false, error: 500, mongoError: e };
    }
  }
}

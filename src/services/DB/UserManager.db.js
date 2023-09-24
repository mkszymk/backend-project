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

  async changeRole(userId) {
    try {
      const user = await usersModel.findOne({ _id: userId });
      if (!user)
        return { success: false, status: 404, message: "User not found" };

      const currentRole = user.role;

      if (currentRole == "user") {
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
          return {
            success: true,
            status: 200,
            message: "Changed role from User to Premium",
          };
        } else {
          return {
            success: false,
            status: 401,
            message: "User did not fully process the information.",
          };
        }
      } else {
        user.role = "user";
        await user.save();
        return {
          success: true,
          status: 200,
          message: "Changed role from Premium to User",
        };
      }
    } catch (e) {
      loggerOutput("error", `Role change error: ${e}`);
      return { success: false, status: 500, message: e };
    }
  }

  async getUsers() {
    try {
      const users = await usersModel.find();
      if (!users)
        return { success: false, status: 404, message: "No users found." };
      return { success: true, status: 200, payload: users };
    } catch (e) {
      return { success: false, status: 500, error: e };
    }
  }

  async deleteUsers() {
    const now = Date.now();
    // 2 días
    const twoDays = 60000 * 60 * 24 * 2;
    const time = now - twoDays;
    try {
      loggerOutput("debug", `[DeleteUsers] Time ${time}`);
      const users = await usersModel.deleteMany({
        $or: [
          { last_connection: { $lt: time } },
          { last_connection: { $exists: false } },
        ],
      });
      return { success: true, status: 200, payload: users };
    } catch (e) {
      return { success: false, status: 500, error: e };
    }
  }

  async getUserById(userId) {
    try {
      const user = await usersModel.findOne({ _id: userId });
      if (!user)
        return { success: false, status: 404, message: "User not found." };
      return { success: true, status: 200, payload: user };
    } catch (e) {
      return { success: false, status: 500, error: e };
    }
  }

  async getUserByEmail(userEmail) {
    try {
      const user = await usersModel.findOne({ email: userEmail });
      if (!user)
        return { success: false, status: 404, message: "User not found." };
      return { success: true, status: 200, payload: user };
    } catch (e) {
      return { success: false, status: 500, error: e };
    }
  }

  async deleteUserById(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user.success)
        return { success: false, status: 404, message: "User not found" };
      await usersModel.deleteOne({ _id: userId });
      return {
        success: true,
        status: 200,
        message: `User with ID ${userId} deleted.`,
      };
    } catch (e) {
      return { success: false, status: 500, error: e };
    }
  }
}

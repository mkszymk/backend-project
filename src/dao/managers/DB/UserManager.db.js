import { usersModel } from "../../models/user.model.js";
import { isValidPassword } from "../../../utils.js";

class UserManager {
  adminData = {
    name: "Coderhouse",
    lastName: "Coderhouse",
    email: "adminCoder@coder.com",
    age: 0,
    role: "admin",
  };

  async registerUser(email, password, name, lastName, age) {
    if (await usersModel.findOne({ email })) {
      return {
        success: false,
        error: 409,
        message: "El email ya está en uso.",
      };
    } else {
      try {
        await usersModel.create({
          name,
          lastName,
          email,
          age,
          password,
          role: "user",
        });
        return {
          success: true,
          message: `Creado el usuario con email ${email}`,
        };
      } catch (error) {
        return { success: false, error: 500, mongoError: error };
      }
    }
  }

  async loginUser(email, password) {
    if (email && password) {
      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        return {
          login: true,
          code: 200,
          user: this.adminData,
        };
      } else {
        try {
          const user = await usersModel.findOne({ email });
          if (!user) {
            return {
              login: false,
              code: 404,
              message: "Error en usuario o contraseña.",
            };
          } else {
            if (!isValidPassword(user, password))
              return {
                login: false,
                code: 403,
                message: "Contraseña incorrecta",
              };
            return { login: true, code: 200, user };
          }
        } catch (error) {
          return { login: false, error };
        }
      }
    } else {
      return { login: false, code: 422, message: "Faltan argumentos" };
    }
  }

  async getUserData(email) {
    if (email === this.adminData.email) {
      return {
        success: true,
        payload: this.adminData,
      };
    } else {
      try {
        const user = await usersModel.findOne({ email });
        if (!user) {
          return {
            success: false,
            code: 404,
            message: "Not found.",
          };
        } else {
          console.log(user);
          return {
            success: true,
            payload: {
              name: user.name,
              lastName: user.lastName,
              email: user.email,
              age: user.age,
              role: user.role,
              cart: user.cart,
            },
          };
        }
      } catch (error) {
        return { success: false, error };
      }
    }
  }

  async restorePassword(email, newPassword) {
    try {
      const user = await usersModel.findOne({ email });
      if (!user)
        return { success: false, code: 404, message: "Email incorrecto." };
      user.password = newPassword;
      await user.save();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export default UserManager;

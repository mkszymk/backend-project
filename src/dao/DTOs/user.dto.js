import { createHash } from "../../utils.js";

export default class UserDTO {
  constructor(user) {
    this.name = user.name;
    this.lastName = user.lastName;
    this.email = user.email ? user.email : "NO-EMAIL";
    this.age = user.age ? user.age : 0;
    this.role = user.role ? user.role : "user";
    this.source = user.source;
    this.password = createHash(user.password);
    this.cart = user.cart;
  }

  getRelevantInfo() {
    return {
      email: this.email,
      role: this.role,
      source: this.source,
      cart: this.cart,
      age: this.age,
      name: this.name,
      lastName: this.lastName,
    };
  }
}

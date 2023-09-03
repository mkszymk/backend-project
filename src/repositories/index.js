import {
  CartManager,
  ProductManager,
  UserManager,
} from "../services/factory.js";
import CartRepository from "./Cart.repository.js";
import ProductRepository from "./Product.repository.js";
import UserRepository from "./User.repository.js";

export const cartsService = new CartRepository(new CartManager());
export const productsService = new ProductRepository(new ProductManager());
export const usersService = new UserRepository(new UserManager());

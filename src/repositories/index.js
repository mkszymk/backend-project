import { CartManager, ProductManager } from "../services/factory.js";
import CartRepository from "./Cart.repository.js";
import ProductRepository from "./Product.repository.js";

export const cartsService = new CartRepository(new CartManager());
export const productsService = new ProductRepository(new ProductManager());

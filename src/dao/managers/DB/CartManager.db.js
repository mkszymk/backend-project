import { cartsModel } from "../../models/carts.model.js";

class DBCartManager {
  async addCart() {
    try {
      await cartsModel.create({ products: [] });
      return { success: true };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async addProductToCart(id, productId, productQuantity) {
    if (!productQuantity >= 1)
      return {
        error: 422,
        message: "La cantidad debe ser mayor o igual a 1",
      };

    try {
      const cart = await cartsModel.findOne({ _id: id });
      cart.products.push({ productId, quantity: productQuantity });
      await cart.save();
      return { success: true, addedProduct: productId };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async getCartById(id) {
    try {
      return await cartsModel.findById(id);
    } catch (error) {
      return { error: 404 };
    }
  }

  async getCarts() {
    try {
      return { success: true, payload: await cartsModel.find() };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }
}

export default DBCartManager;

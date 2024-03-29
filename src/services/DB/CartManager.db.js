import { cartsModel } from "../../dao/models/carts.model.js";
import { loggerOutput } from "../../utils/logger.js";

class DBCartManager {
  async addCart() {
    try {
      let cart = await cartsModel.create({});
      return { success: true, cartId: cart._id };
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
      if (await this.containsProduct(id, productId)) {
        const productIndex = cart.products
          .map((p) => p.product.toString())
          .indexOf(productId);
        cart.products[productIndex] = {
          product: productId,
          quantity: productQuantity + cart.products[productIndex].quantity,
        };
        await cart.save();
      } else {
        cart.products.push({ product: productId, quantity: productQuantity });
        await cart.save();
      }

      return { success: true, addedProduct: productId };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await cartsModel.findOne({ _id: cartId });
      cart.products = [];
      await cart.save();
      return { success: true, message: "The cart has been emptied." };
    } catch (error) {
      return { success: false, error: 500, mongoError: error };
    }
  }

  async getCartById(id) {
    loggerOutput("debug", `[cartManager/cartById] Trying to get cart by ID.`);
    try {
      return await cartsModel.findById(id).populate("products.product");
    } catch (m_error) {
      loggerOutput("warning", `[cartManager/cartById] Cart error`);
      return { error: 404, mongoError: m_error };
    }
  }

  async getCarts() {
    try {
      return { success: true, payload: await cartsModel.find() };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async deleteCart(id) {
    try {
      await cartsModel.deleteOne({ _id: id });
      return { success: true, message: `Deleted cart with ID: ${id}` };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async containsProduct(cartId, productId) {
    const cart = await cartsModel.findOne({ _id: cartId });
    let boolResult = false;
    cart.products.forEach((product) => {
      if (product.product._id.toString() == productId) boolResult = true;
    });
    return boolResult;
  }

  async removeProductOfCart(cartId, productId) {
    try {
      if (await this.containsProduct(cartId, productId)) {
        const cart = await cartsModel.findOne({
          _id: cartId,
        });
        const productIndex = cart.products
          .map((p) => p.product._id.toString())
          .indexOf(productId);
        cart.products.splice(productIndex, 1);
        await cart.save();
        return {
          success: true,
          message: `Cart ${cartId}: Removed product ID ${productId}`,
        };
      } else {
        return { error: 404, message: "Product not found in this cart." };
      }
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async replaceProducts(cartId, newProducts) {
    try {
      await this.emptyCart(cartId);
      await newProducts.forEach(async (newProduct) => {
        await this.addProductToCart(
          cartId,
          newProduct.productId,
          newProduct.quantity ? newProduct.quantity : 1
        );
      });
      return {
        success: true,
        message: `Cart ${cartId}: All products replaced.`,
      };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async getCartTotal(cartId) {
    const cart = await this.getCartById(cartId);
    const products = await cart.products;
    const total = products.reduce(
      (subtotal, product) =>
        subtotal + product.quantity * product.product.price,
      0
    );
    return total;
  }

  async getProductsWithStock(cartId) {
    let productsStocks = [];
    let productsWithStock = [];
    let productsWithoutStock = [];

    const cart = await this.getCartById(cartId);

    const products = cart.products;
    products.forEach((product) => {
      productsStocks.push({
        [product.product._id]: {
          productStock: product.product.stock,
          purchased: product.quantity,
        },
      });
    });

    productsStocks.forEach((product) => {
      const productId = Object.keys(product)[0];
      if (product[productId].productStock >= product[productId].purchased) {
        productsWithStock.push({
          id: productId,
          amount: product[productId].purchased,
        });
      } else {
        productsWithoutStock.push(productId);
      }
    });

    return { productsWithStock, productsWithoutStock };
  }
}

export default DBCartManager;

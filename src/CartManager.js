import fs from "fs";

class CartManager {
  constructor() {
    this.path = "./src/data/carts.json";
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "[]");
    }
  }

  async addCart() {
    let carts = await this.getCarts();
    const lastId = carts.length > 0 ? carts[carts.length - 1].id : -1;
    const newCart = {
      id: lastId + 1,
      products: [],
    };
    carts.push(newCart);
    console.log(`Carrito agregado, ID: ${lastId + 1}`);
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return { success: true, addedCartId: lastId + 1 };
  }

  async addProductToCart(id, productId, productQuantity) {
    if (!(productId >= 0 && productQuantity >= 1 && id >= 0))
      return {
        error: 422,
        message: "Faltan argumentos o argumentos inválidos",
      };
    let carts = await this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === id);
    if (cartIndex < 0) return { error: 404, message: "ID Not Found.", id };

    if (carts[cartIndex].products.some((p) => p.productId == productId)) {
      carts[cartIndex].products.forEach((p, i) => {
        if (p.productId == productId) {
          carts[cartIndex].products[i].quantity =
            carts[cartIndex].products[i].quantity + productQuantity;
        }
      });
    } else {
      carts[cartIndex].products.push({ productId, quantity: productQuantity });
    }
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    console.log(`Producto ${productId} agregado al carrito con Id ${id}`);
    return {
      success: true,
      message: `Producto ${productId} agregado al carrito con Id ${id}`,
    };
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    if (carts.some((c) => c.id === id)) {
      return carts.filter((cart) => cart.id === id);
    } else {
      return { error: 404 };
    }
  }

  async getCarts() {
    const fileContent = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(fileContent);
  }

  //   async deleteProduct(id) {
  //     let products = await this.getProducts();
  //     const productIndex = products.findIndex((p) => p.id === id);
  //     if (productIndex < 0) {
  //       return { error: 404, message: "ID No encontrado" };
  //     } else {
  //       products.splice(productIndex, 1);
  //       await fs.promises.writeFile(this.path, JSON.stringify(products));
  //       console.log("Producto eliminado");
  //       return { success: true, message: "Producto eliminado con éxito." };
  //     }
  //   }
}

export default CartManager;

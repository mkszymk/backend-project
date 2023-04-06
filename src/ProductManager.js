const fs = require("fs");

class ProductManager {
  constructor() {
    this.path = "./src/data/products.json";
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "[]");
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!(title && description && price && thumbnail && code && stock)) {
      console.log("Error: Debes completar todos los datos.");
    } else {
      let products = await this.getProducts();
      if (products.some((p) => p.code === code)) {
        console.log("Error: Ya existe un producto con ese código");
      } else {
        const lastId =
          products.length > 0 ? products[products.length - 1].id : -1;
        const newProduct = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          id: lastId + 1,
        };
        products.push(newProduct);
        console.log("Producto agregado: " + title);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
      }
    }
  }

  async updateProduct(id, updatedProduct) {
    let products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex < 0) {
      console.log("Error: id not found.");
    } else {
      products[productIndex] = {
        ...products[productIndex],
        ...updatedProduct,
      };
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log("Producto actualizado");
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    if (products.some((p) => p.id === id)) {
      return products.filter((product) => product.id === id);
    } else {
      return { error: 404 };
    }
  }

  async getProducts() {
    const fileContent = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(fileContent);
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex < 0) {
      console.log("Error: id not found.");
    } else {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log("Producto eliminado");
    }
  }
}

module.exports = { ProductManager };

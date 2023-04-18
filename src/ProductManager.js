import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "./src/data/products.json";
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "[]");
    }
  }

  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category
  ) {
    if (
      !(
        title &&
        description &&
        price &&
        thumbnail &&
        code &&
        stock &&
        status &&
        category
      )
    ) {
      return { error: 422, message: "Faltan argumentos" };
    } else {
      let products = await this.getProducts();
      if (products.some((p) => p.code === code)) {
        return { error: 409, message: "El código ya existe" };
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
          status,
          category,
          id: lastId + 1,
        };
        products.push(newProduct);
        console.log("Producto agregado: " + title);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return { success: true, addedProduct: newProduct };
      }
    }
  }

  async updateProduct(id, updatedProduct) {
    if (updatedProduct.id)
      return { error: 422, message: "No se puede enviar el dato ID" };
    let products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex < 0) {
      return { error: 404, message: "ID Not Found.", id };
    } else {
      products[productIndex] = {
        ...products[productIndex],
        ...updatedProduct,
      };
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log(`Producto ${products[productIndex].title} actualizado.`);
      return {
        success: true,
        message: `Producto ${products[productIndex].title} actualizado.`,
      };
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
      return { error: 404, message: "ID No encontrado" };
    } else {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log("Producto eliminado");
      return { success: true, message: "Producto eliminado con éxito." };
    }
  }
}

export default ProductManager;

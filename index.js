const fs = require("fs");

class ProductManager {
  constructor() {
    this.path = "./products.json";
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
      return "ID not found";
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

//-----------------------------------------Testing:-----------------------------------------
const prod = new ProductManager();
const tests = async () => {
  await prod.getProducts().then((r) => console.log(r));
  await prod.addProduct(
    "Product title 1",
    "Product test 1",
    800,
    "URL-TEST1",
    "test1",
    15
  );
  await prod.getProducts().then((r) => console.log(r));
  await prod.addProduct(
    "Product title 2",
    "Product test 2",
    200,
    "URL-TEST2",
    "test2",
    20
  );
  await prod.addProduct(
    "Product title 3",
    "Product test 3",
    100,
    "URL-TEST3",
    "test3",
    80
  );
  await prod.getProductById(1).then((r) => console.log(r));
  await prod.updateProduct(0, { stock: 1 });
  await prod.deleteProduct(99);
};

tests();

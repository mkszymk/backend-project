class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!(title && description && price && thumbnail && code && stock)) {
      console.log("ERROR: Debes completar todos los campos");
    } else {
      if (this.products.some((p) => p.code === code)) {
        console.log("ERROR: Ya existe un producto con ese código.");
      } else {
        this.products.push({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          id: this.products.length,
        });
      }
    }
  }

  getProductById(id) {
    if (this.products.some((p) => p.id === id)) {
      return this.products.filter((product) => product.id === id);
    } else {
      return "Not found";
    }
  }

  getProducts() {
    return this.products;
  }
}

//Testing:
const prod = new ProductManager();
console.log(prod.getProducts());
prod.addProduct(
  "Producto Prueba",
  "Este es un producto de prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);
console.log(prod.getProducts());
prod.addProduct(
  "Producto Prueba",
  "Este es un producto de prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);
console.log(prod.getProductById(0));
console.log(prod.getProductById(5));

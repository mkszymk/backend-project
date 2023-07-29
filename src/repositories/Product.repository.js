import ProductDTO from "../dao/DTOs/product.dto.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async addProduct(product) {
    const newProduct = new ProductDTO(product);
    const result = await this.dao.addProduct(newProduct);
    return result;
  }

  async updateProduct(id, updatedProduct) {
    const result = await this.dao.updateProduct(id, updatedProduct);
    return result;
  }

  async getProductById(id) {
    const result = await this.dao.getProductById(id);
    return result;
  }

  async getProducts(limit, pageNumber, query, sort) {
    const result = await this.dao.getProducts(limit, pageNumber, query, sort);
    return result;
  }

  async deleteProduct(id) {
    const result = await this.dao.deleteProduct(id);
    return result;
  }

  async getProductsTotal(products) {
    const result = await this.dao.getProductsTotal(products);
    return result;
  }
}

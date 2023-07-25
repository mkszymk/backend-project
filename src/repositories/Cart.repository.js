export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async addCart() {
    return await this.dao.addCart();
  }

  async addProductToCart(cartId, productId, productQuantity) {
    return await this.dao.addProductToCart(cartId, productId, productQuantity);
  }

  async emptyCart(cartId) {
    return await this.dao.emptyCart(cartId);
  }

  async getCartById(cartId) {
    return await this.dao.getCartById(cartId);
  }

  async getCarts() {
    return await this.dao.getCarts();
  }

  async deleteCart(cartId) {
    return await this.dao.deleteCart(cartId);
  }

  async containsProduct(cartId, productId) {
    return await this.dao.containsProduct(cartId, productId);
  }

  async removeProductOfCart(cartId, productId) {
    return await this.dao.removeProductOfCart(cartId, productId);
  }

  async replaceProducts(cartId, newProducts) {
    return await this.dao.replaceProducts(cartId, newProducts);
  }
}

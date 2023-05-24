import { productsModel } from "../../models/products.model.js";

class DBProductManager {
  async addProduct({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  }) {
    try {
      const mongoResponse = await productsModel.create({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      });
      return {
        success: true,
        message: "Added product to DB",
        productAdded: {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category,
        },
      };
    } catch (error) {
      return {
        error: 500,
        mongoError: { error },
      };
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const mongoResponse = await productsModel.findOneAndUpdate(
        { _id: id },
        updatedProduct
      );
      return { success: true, message: `Product with ID ${id} updated.` };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async getProductById(id) {
    try {
      const product = await productsModel.findById(id);
      return { success: true, payload: product };
    } catch (error) {
      return { error };
    }
  }

  async getProducts(limit) {
    const _limit = parseInt(limit);
    let products = await productsModel.find().limit(_limit);
    return { result: "success", payload: products };
  }

  async deleteProduct(id) {
    try {
      await productsModel.deleteOne({ _id: id });
      return { success: true, message: `Deleted product with ID ${id}` };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }
}

export default DBProductManager;

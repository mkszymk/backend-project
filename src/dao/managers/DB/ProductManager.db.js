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

  async getProducts(_limit, _page, _query, _sort) {
    if (_sort != "asc" && _sort != "desc" && _sort != undefined && _sort != "")
      return { error: 422, message: "422 - Sort query must be asc or desc." };
    let {
      docs,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await productsModel.paginate(_query ? { category: _query } : {}, {
      limit: _limit,
      page: _page,
      sort: { price: _sort },
    });
    if (_page > totalPages || parseInt(_page) < 1) {
      return { error: 404, message: "404 - Page not found or empty." };
    }
    return {
      result: "success",
      payload: docs,
      limit: _limit,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage
        ? `http://localhost:8080/api/products/?page=${prevPage}&limit=${
            _limit ? _limit : ""
          }&query=${_query ? _query : ""}&sort=${_sort ? _sort : ""}`
        : null,
      nextLink: hasNextPage
        ? `http://localhost:8080/api/products/?page=${nextPage}&limit=${
            _limit ? _limit : ""
          }&query=${_query ? _query : ""}&sort=${_sort ? _sort : ""}`
        : null,
    };
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

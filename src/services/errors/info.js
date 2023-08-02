export const generateProductErrorInfo = (product) => {
  return `One or more arguments were incomplete or not valid.
    List of arguments required to create a new product:
        * title: String, received ${product.title} - ${typeof product.title}
        * description: String, received ${
          product.description
        } - ${typeof product.description}
        * price: Number, received ${product.price} - ${typeof product.price}
        * thumbnail: [ OPTIONAL ] String, received ${
          product.thumbnail
        } - ${typeof product.thumbnail}
        * code: String, received ${product.code} - ${typeof product.code}
        * stock: Number, received ${product.stock} - ${typeof product.stock}
        * status: [ OPTIONAL ] Boolean, received ${
          product.status
        } - ${typeof product.status}
        * category: String, received ${
          product.category
        } - ${typeof product.category}
    `;
};

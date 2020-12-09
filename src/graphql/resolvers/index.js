const { getAllProducts, createProduct, removeProduct, updateProduct, createImageOnProduct, removeImageOnProduct } = require('./products');

const resolvers = {
  Query: {
    getAllProducts
  },
  Mutation: {
    createProduct,
    removeProduct,
    updateProduct,
    createImageOnProduct,
    removeImageOnProduct
  }
}

module.exports = resolvers;
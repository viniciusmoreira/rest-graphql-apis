const { AuthenticationError } = require('apollo-server-express');
const { getAllProducts, createProduct, removeProduct, updateProduct, createImageOnProduct, removeImageOnProduct } = require('./products');

const auth = resolver => {
  return async(parent, args, context ) => {
    if(!context.user){
      throw new AuthenticationError('User not allowed at GraphQL');
    }
    return resolver(parent, args, context);
  }
}

const resolvers = {
  Query: {
    getAllProducts: auth(getAllProducts)
  },
  Mutation: {
    createProduct: auth(createProduct),
    removeProduct: auth(removeProduct),
    updateProduct: auth(updateProduct),
    createImageOnProduct: auth(createImageOnProduct),
    removeImageOnProduct: auth(removeImageOnProduct)
  }
}

module.exports = resolvers;
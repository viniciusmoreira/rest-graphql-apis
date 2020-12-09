const db = require('../../db');
const productModel = require('../../models/product')(db);
const { ApolloError } = require("apollo-server-express");

const getAllProducts = async (context, { filter }) => {
  let products = null;
  
  if(filter && filter.categoryId)   {
    products = await productModel.findAllByCategory(filter.categoryId);
  } else {
    products = await productModel.findAll();
  }

  return products;
}
  

const createProduct = async (context, {input}) => {
  const { product, price } = input;

  const newProduct = await productModel.create([product, price])

  return newProduct;
}

const removeProduct = async(context, { id }) => {
  const success = await productModel.remove(id);
  return success;
}

const updateProduct = async(context, { id, input }) => {
  let success = true;
  const productExists = await productModel.findById(productId);

  if(!productExists){
    // Para lançar os erros
    throw new ApolloError('Produto não encontrado!');
  }

  if(input){
    console.log('aqui 1')
    const updateFields = { ...productExists, ...input };
    success = await productModel.update(id, [updateFields.product, updateFields.price])
  } 

  if(success && input.categories && input.categories.length > 0){
    console.log('aqui 2')
    success = await productModel.updateCategories(id, input.categories);
  }

  return success;
}

const createImageOnProduct = async (context, { productId, input }) => {
  const { description, url } = input;
  const productExists = await productModel.findById(productId);

  if(!productExists){
    // Para lançar os erros
    throw new ApolloError('Produto não encontrado!');
  }

  const success = await productModel.addImage(productId, [description, url])

  return success;
}

const removeImageOnProduct = async (context, { id, productId }) => {
  const success = await productModel.removeImage(productId, id);

  return success;
}

module.exports = {
  getAllProducts,
  createProduct,
  removeProduct,
  updateProduct,
  createImageOnProduct,
  removeImageOnProduct
}
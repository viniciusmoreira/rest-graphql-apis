const db = require('../../db');
const productModel = require('../../models/product')(db);
const { ApolloError } = require("apollo-server-express");

const getAllProducts = async (parent, { filter }, context) => {
  let products = null;
  
  if(filter && filter.categoryId)   {
    products = await productModel.findAllByCategory(filter.categoryId);
  } else {
    products = await productModel.findAll();
  }

  return products;
}
  

const createProduct = async (parent, {input}, context) => {
  const { product, price } = input;

  const newProduct = await productModel.create([product, price])

  return newProduct;
}

const removeProduct = async(parent, { id }, context) => {
  const success = await productModel.remove(id);
  return success;
}

const updateProduct = async(parent, { id, input }, context) => {
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

const createImageOnProduct = async (parent, { productId, input }, context) => {
  const { description, url } = input;
  const productExists = await productModel.findById(productId);

  if(!productExists){
    // Para lançar os erros
    throw new ApolloError('Produto não encontrado!');
  }

  const success = await productModel.addImage(productId, [description, url])

  return success;
}

const removeImageOnProduct = async (parent, { id, productId }, context) => {
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
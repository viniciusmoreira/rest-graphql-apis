const db = require('../db');
const productModel = require('../models/product')(db);

const getAll = async (req, res) => {
  const { categoryId } = req.query;
  let products = null;

  if(categoryId)   {
    products = await productModel.findAllByCategory(categoryId);
  } else {
    products = await productModel.findAll();
  }
  res.json({
    products
  })
}

const getById = async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findById(id);

  res.json(product)
}

const create = async (req, res) => {
  const { product, price } = req.body;

  const newProduct = await productModel.create([product, price])

  res.json(newProduct)
}

const createImage = async (req, res) => {
  const { productId } = req.params;
  const { description, url } = req.body;

  const success = await productModel.addImage(productId, [description, url])

  res.json({
    success
  })
}

const removeImage = async (req, res) => {
  const { productId, id } = req.params;

  const success = await productModel.removeImage(productId, id);

  res.json({
    success
  })
}

const update = async (req, res) => {
  const { id } = req.params;
  const { product, price } = req.body;

  const success = await productModel.update(id, [product, price])

  res.json({
    success
  })
}

const updateCategories = async (req, res) => {
  const { id } = req.params;
  const { categories } = req.body;
  const productExists = await productModel.findById(id);

  if(!productExists){
    return res.json({
      success: false,
      error: 'Produto não encontrado.'
    })
  }

  const success = await productModel.updateCategories(id, categories);

  res.json({
    success
  })
}

const patch = async (req, res) => {
  const { id } = req.params;
  const productExists = await productModel.findById(id);
  let success = false;

  if(productExists){
    const updateFields = { ...productExists, ...req.body };
    success = await productModel.update(id, [updateFields.product, updateFields.price])
  } 

  res.json({ success });  
}

const remove = async (req, res) => {
  const { id } = req.params;

  const success = await productModel.remove(id);

  res.json({
    success
  })
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  patch,
  updateCategories,
  createImage,
  removeImage
}
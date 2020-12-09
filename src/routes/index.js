const express = require('express');
const productsRouter = require('./products');

const routes = express.Router();

routes.use('/products', productsRouter);

module.exports = routes;
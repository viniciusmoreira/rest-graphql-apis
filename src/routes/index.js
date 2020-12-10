const express = require('express');
const productsRouter = require('./products');
const authRouter = require('./auth');
const { checkUserAuth } = require('../midlewares/auth');

const routes = express.Router();

routes.use('/auth', authRouter);

routes.use(checkUserAuth);
routes.use('/products', productsRouter);

module.exports = routes;
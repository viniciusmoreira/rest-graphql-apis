const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);
router.post('/', productsController.create);
router.post('/:productId/image', productsController.createImage);
router.delete('/:productId/image/:id', productsController.removeImage);
router.put('/:id', productsController.update);
router.put('/:id/categories', productsController.updateCategories);
router.patch('/:id', productsController.patch);
router.delete('/:id', productsController.remove);

module.exports = router;
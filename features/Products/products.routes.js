let express = require('express');
let router = express.Router();
let productHandler = require('./products.handler');
let productTypes = require('./products.types')
const validator=require('../../common/validator')

router.route(`/`).post(validator(productTypes.createProduct), productHandler.createProduct);
router.route(`/:id`).put(validator(productTypes.updateProductById), productHandler.updateProduct);
router.route(`/`).get(productHandler.getProducts);
router.route(`/categories`).get(productHandler.getCategories);
router.route(`/`).delete(validator(productTypes.deleteProduct), productHandler.deleteProduct);



module.exports = router;

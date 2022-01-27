const validator = require('./products.types')
const ProductCtrl = require('./products.ctrl')
const Boom = require('boom')

const productCtrl = ProductCtrl()
module.exports.createProduct = async (req, res, next) => {
	try {
		const { body } = req;
		const product = await productCtrl.createProduct(body);
		const populatedProduct = await productCtrl.populateFields(product, 'category');
		// console.log(product)
		res.json({
			success: true,
			data: populatedProduct
		});
	} catch (e) {
		// console.log(e)
		return next(e);
	}
}

module.exports.getProducts = async (req, res, next) => {
	try {
		const { query } = req;
		let products = [];
		if (query.user) {
			products = await productCtrl.getAllProducts({ user: query.user });
		} else {
			products = await productCtrl.getAllProducts({ user: { $exists: false } });
		}
		res.json({
			success: true,
			data: products
		});
	} catch (e) {
		return next(e);
	}
}

module.exports.updateProduct = async (req, res, next) => {
	try {
		const { body, params } = req;
		const products = await productCtrl.updateProduct(params.id, body);
		res.json({
			success: true,
			data: products
		});
	} catch (e) {
		return next(e);
	}
}

module.exports.deleteProduct = async (req, res, next) => {
	try {
		const { query } = req;
		await productCtrl.deleteProduct(query.id);
		res.json({
			success: true,
			data: 'Product has been deleted'
		});
	} catch (e) {
		return next(e);
	}
}
module.exports.getCategories = async (req, res, next) => {
	try {
		const { query } = req;
		const categories = await productCtrl.getAllCategories(query.id);
		res.json({
			success: true,
			data: categories
		});
	} catch (e) {
		return next(e);
	}
}
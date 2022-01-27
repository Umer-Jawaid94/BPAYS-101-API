const ProductSchema = require('./products.model')
const CategorySchema = require('./categories.model')


module.exports = () => {
  async function populateFields(document, path = '') {
    return await ProductSchema.populate(document, path);
  }
  function createProduct(data) {
    return ProductSchema.create(data);
  }
  function getAllProducts(data) {
    return ProductSchema.find({ ...data }).populate('category').lean();
  }
  function deleteProduct(id) {
    return ProductSchema.findByIdAndDelete(id);
  }
  function updateProduct(id, body) {
    return ProductSchema.findByIdAndUpdate(id, body, { new: true }).populate('category').lean();
  }
  function getAllCategories(data) {
    return CategorySchema.find({ ...data }).lean();
  }
  return {
    createProduct,
    getAllProducts,
    deleteProduct,
    updateProduct,
    populateFields,
    getAllCategories
  }
}
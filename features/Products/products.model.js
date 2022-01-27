const mongoose = require('mongoose');
const shortid = require('shortid');

const { Schema } = mongoose;

const TABLENAME = 'Products';

const ProductSchema = new Schema({
  sid: {
    type: String,
    default: shortid.generate,
    index: true
  },
  name: String,
  price: Number,
  image: String,
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Categories'
  },
  user: String

}, { timestamps: true });


module.exports = mongoose.models[TABLENAME] ?
  mongoose.model(TABLENAME) :
  mongoose.model(TABLENAME, ProductSchema);


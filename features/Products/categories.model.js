const mongoose = require('mongoose');
const shortid = require('shortid');

const { Schema } = mongoose;

const TABLENAME = 'Categories';


const CategorySchema = new Schema({
  sid: {
    type: String,
    default: shortid.generate,
    index: true
  },
  name: String,

}, { timestamps: true });


module.exports = mongoose.models[TABLENAME] ?
  mongoose.model(TABLENAME) :
  mongoose.model(TABLENAME, CategorySchema);
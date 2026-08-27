const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  setNum: { 
    type: String,
     required: true,
      unique: true }, 
  name: { 
    type: String,
     required: true },
  theme: {
     type: String, 
    default: null }, 
  year: {
     type: Number,
     required: true },
  pieceCount: { 
    type: Number, 
    required: true },
  image: {
     type: String,
     required: true } 
}, { timestamps: true });

const Set = mongoose.model('Set', setSchema)
module.exports = Set
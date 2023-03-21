const mongoose = require('mongoose');
const ebookSchema = require("../schemas/ebookSchema");

const ebook = mongoose.model('Ebook', ebookSchema);

module.exports = ebook;

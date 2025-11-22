const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: String,
  genre: String,
  year: Number,
  description: String, 
  content: String       
});

module.exports = mongoose.model("Book", bookSchema);

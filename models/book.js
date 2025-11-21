const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true }, 
  title: { type: String, required: true },
  author: String,
  genre: String,
  year: Number,
  content: String, 
  //available: { type: Boolean, default: true }
});

module.exports = mongoose.model("Book", bookSchema);

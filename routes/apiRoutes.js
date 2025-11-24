const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/books", async (req, res) => {
  const books = await Book.find().sort({ bookId: 1 });
  res.json(books);
});

router.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

router.post("/books", async (req, res) => {
  const lastBook = await Book.findOne().sort({ bookId: -1 }).exec();
  let nextId = "B0001";

  if (lastBook) {
    const lastNum = parseInt(lastBook.bookId.substring(1));
    nextId = "B" + String(lastNum + 1).padStart(4, "0");
  }

  const newBook = await Book.create({
    bookId: nextId,
    ...req.body
  });

  res.json(newBook);
});

router.put("/books/:id", async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(updated);
});

router.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

//find by author
router.get("/books/author/:author", async (req, res) => {
  const author = req.params.author;
  const books = await Book.find({
    author: { $regex: author, $options: "i" }
  }).sort({ bookId: 1 });

  res.json(books);
});

//find by title
router.get("/books/title/:title", async (req, res) => {
  const title = req.params.title;
  const books = await Book.find({
    title: { $regex: title, $options: "i" }
  }).sort({ bookId: 1 });

  res.json(books);
});

//find by genre
router.get("/books/genre/:genre", async (req, res) => {
  const genre = req.params.genre;
  const books = await Book.find({
    genre: { $regex: genre, $options: "i" }
  });

  res.json(books);
});

//find by title or author or genre
router.get("/books/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;

  const books = await Book.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { author: { $regex: keyword, $options: "i" } },
      { genre: { $regex: keyword, $options: "i" } }
    ]
  });

  res.json(books);
});

//Add the contact to description
router.put("/books/append/:id", async (req, res) => {
  const { extraText } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  book.description = (book.description || "") + "\n" + extraText;
  await book.save();

  res.json(book);
});

//Add the contact to Content
router.put("/books/appendContent/:id", async (req, res) => {
  const { extraText } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  book.content = (book.content || "") + "\n" + extraText;

  await book.save();
  res.json(book);
});




module.exports = router;

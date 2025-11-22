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

module.exports = router;

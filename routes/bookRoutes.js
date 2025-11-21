const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// List + Search
router.get("/", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const keyword = req.query.keyword;
  let query = {};

  if (keyword && keyword.trim() !== "") {
    const regex = new RegExp(keyword.trim(), "i");
    query = {
      $or: [
        { title: regex },
        { author: regex },
        { genre: regex },
        { bookId: regex }
      ]
    };
  }

  const books = await Book.find(query).sort({ bookId: 1, title: 1 });
  res.render("list", { books, keyword });
});

// Show create page
router.get("/create", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("create");
});

// Handle create with auto bookId
router.post("/create", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  // 搵到而家最大嗰個 bookId
  const lastBook = await Book.findOne({ bookId: { $exists: true } })
    .sort({ bookId: -1 })
    .exec();

  let nextNumber = 1;
  if (lastBook && lastBook.bookId) {
    const num = parseInt(lastBook.bookId.slice(1), 10); // 由 "A00001" 取 "00001"
    if (!Number.isNaN(num)) {
      nextNumber = num + 1;
    }
  }

  const bookId = "A" + String(nextNumber).padStart(5, "0");

  const newBook = {
    bookId,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    year: req.body.year,
    content: req.body.content,
    available: req.body.available === "on" || req.body.available === "true"
  };

  await Book.create(newBook);
  res.redirect("/");
});

// Show edit page
router.get("/edit/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const book = await Book.findById(req.params.id);
  res.render("edit", { book });
});

// Handle edit
router.post("/edit/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const updatedData = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    year: req.body.year,
    content: req.body.content,
    available: req.body.available === "on" || req.body.available === "true"
  };

  await Book.findByIdAndUpdate(req.params.id, updatedData);
  res.redirect("/");
});

// Delete
router.get("/delete/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;


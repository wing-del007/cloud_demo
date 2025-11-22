const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter = {
      $or: [
        { bookId: q },
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } }
      ]
    };
  }
  const books = await Book.find(filter).sort({ bookId: 1 });
  res.render("index", { 
  books,
  search: q || "",
  session: req.session
  });
});

router.get("/add", (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  res.render("add", {session: req.session });
});

router.post("/add", async (req, res) => {
  const lastBook = await Book.findOne().sort({ bookId: -1 }).exec();

  let nextId = "B0001";  
  if (lastBook) {
    const lastNum = parseInt(lastBook.bookId.substring(1));  
    const newNum = lastNum + 1;
    nextId = "B" + String(newNum).padStart(4, "0");  
  }

  const { title, author, genre, year, description, content } = req.body;

  await Book.create({
    bookId: nextId,
    title,
    author,
    genre,
    year,
    description,
    content
  });

  res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  const book = await Book.findById(req.params.id);
  res.render("edit", { book, session: req.session });
});

router.post("/edit/:id", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  const { title, author, genre, year, description, content } = req.body;
  await Book.findByIdAndUpdate(req.params.id, {
    title,
    author,
    genre,
    year,
    description,
    content
  });
  res.redirect("/");
});

router.post("/delete/:id", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

router.get("/view/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("view", { book, session: req.session });
});

module.exports = router;

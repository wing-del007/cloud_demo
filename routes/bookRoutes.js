const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const books = await Book.find();
  res.render("list", { books });
});

router.get("/create", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("create");
});

router.post("/create", async (req, res) => {
  await Book.create(req.body);
  res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("edit", { book });
});

router.post("/edit/:id", async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

router.get("/delete/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;

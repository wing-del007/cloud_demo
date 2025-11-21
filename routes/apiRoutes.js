const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/books", async (req, res) => {
  res.json(await Book.find());
});

router.get("/books/:id", async (req, res) => {
  res.json(await Book.findById(req.params.id));
});

router.post("/books", async (req, res) => {
  res.json(await Book.create(req.body));
});

router.put("/books/:id", async (req, res) => {
  res.json(await Book.findByIdAndUpdate(req.params.id, req.body));
});

router.delete("/books/:id", async (req, res) => {
  res.json(await Book.findByIdAndDelete(req.params.id));
});

module.exports = router;

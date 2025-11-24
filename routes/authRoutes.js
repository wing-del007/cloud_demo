const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/login", (req, res) => {
  res.render("login", { error: req.query.error });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = user;
    res.redirect("/");
  } else {
    return res.redirect("/login?error=1");
  }
});

router.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

module.exports = router;

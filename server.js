const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("cookie-session");

const Book = require("./models/book");
const User = require("./models/user");

const app = express();

 mongoose.connect('mongodb+srv://gpUser:4416@gpcluster.jjoi2dn.mongodb.net/bookDB?appName=gpCluster')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use(session({
  name: "session",
  keys: ["your-secret-key"],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  const user = await User.findById(req.session.user._id);
  req.currentUser = user;
  next();
});

app.use((req, res, next) => {
  const publicPaths = ["/login"];  
  if (publicPaths.includes(req.path)) return next();

  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
});

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/bookRoutes"));
app.use("/api", require("./routes/apiRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:3000`));

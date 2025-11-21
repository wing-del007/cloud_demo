const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("cookie-session");

const app = express();

mongoose.connect("mongodb+srv://mu_user:hkmu@cluster0.vvxyhwj.mongodb.net/bookDB?appName=Cluster0")
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error(err));
  
  

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use(session({
  name: "session",
  keys: ["secretkey"],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use("/", require("./routes/bookRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));

app.listen(3000, () => console.log("Server running at http://localhost:3000"));

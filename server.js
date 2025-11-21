const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("cookie-session");

const app = express();

mongoose.connect("mongodb+srv://gpUser:4416@gpcluster.jjoi2dn.mongodb.net/bookDB?appName=gpCluster")
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

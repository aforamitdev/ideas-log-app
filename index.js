const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

// git red of mongo warning
mongoose.Promise = global.Promise;

// ?cpnnect to mongoose

mongoose
  .connect("mongodb://localhost/vidhot", { useNewUrlParser: true })
  .then(() => {
    console.log("momgoose db is connected");
  })
  .catch(err => console.log(err));

require("./models/Ideas");

const Idea = mongoose.model("ideas");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// body paeser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

// IDeas index page

app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", { ideas: ideas });
    });
});

// add ideas form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", { idea: idea });
  });
  res.render("ideas/edit");
});

// process form

app.post("/ideas", (req, res) => {
  let err = [];
  if (!req.body.title) {
    err.push({ text: "Plese add a title" });
  }
  if (!req.body.disc) {
    err.push({ text: "Plese add detail" });
  }
  if (err.length > 0) {
    res.render("ideas/add", {
      error: err,
      title: req.body.title,
      disc: req.body.disc
    });
  } else {
    const newuser = {
      title: req.body.title,
      disc: req.body.disc
    };
    new Idea(newuser).save().then(idea => {
      res.redirect("/ideas");
    });
  }
});

app.listen(port, () => {
  console.log("App Started at " + port);
});

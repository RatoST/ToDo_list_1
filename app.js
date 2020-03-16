// jshint esversion:6
//create express and body-parser
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
//create array of items so when rendering starts item wont be empty
const items = ["Wake up", "Make & drink juice", "Make & drink coffe"];
const workItems = [];

//use ejs
app.set("view engine", "ejs");

// use bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

// use folder public for css, js etc through express
app.use(express.static("public"));

app.get("/", function(req, res) {

  //call function through variable day
  const day = date.getDate();

  //Render all items from one place
  res.render("list", {
    listTitle: day,
    newListItems: items
  });

});

app.post("/", function(req, res) {

  const item = req.body.newItem;
  // logic for combine of two lists
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/work", function(req, res) {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

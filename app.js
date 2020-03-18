// jshint esversion:6
//create express and body-parser
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//use ejs
app.set("view engine", "ejs");

// use bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

// use folder public for css, js etc through express
app.use(express.static("public"));
//Mongoose connect to server with req additions
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
})
.then(() => console.log('DB connected!'))
.catch(err => {
  console.log(`DB Connection Error: ${err.message}`);
});

//Scheme for db
const itemsSchema = {
  name: String
};

//Mongoose model
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name:"Wellcome to your do to list!"
});

const item2 = new Item({
  name:"Hit the + button to add a new item."
});

const item3 = new Item({
  name:"<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {



//read db to app
Item.find({}, function(err, foundItems){

  //check if todo list is empty
  if (foundItems.length === 0) {
    // Insert item in database
  Item.insertMany(defaultItems, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Insert Succesfully!");
    }
  });
  res.redirect("/");
  }else{
  //Render all items from one place
  res.render("list", {
    listTitle: "Today",
    newListItems: foundItems
  });
  }
  });
});
//post route
app.post("/", function(req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");

});

app.post("/delete", function(req, res){
 const checkedItemId = req.body.checkbox;

 Item.findByIdAndRemove(checkedItemId, function(err){
   if (!err) {
     console.log("Succesfully deleted checked item.");
     res.redirect("/");
   }
 });
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

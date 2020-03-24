// jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

//use ejs
app.set("view engine", "ejs");

// use bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

// use folder public for css, js etc through express
app.use(express.static("public"));
const pass = process.env.PASS;
//Mongoose connect to server with req additions
mongoose.connect("mongodb+srv://admin-rato:" + pass + "@cluster0-mgd0x.mongodb.net/test?retryWrites=true&w=majority/todolistDB", {
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
  name: "Wellcome to your do to list!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  //read db to app
  Item.find({}, function(err, foundItems) {

    //check if todo list is empty
    if (foundItems.length === 0) {
      // Insert item in database
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Insert Succesfully!");
        }
      });
      res.redirect("/");
    } else {
      //Render all items from one place
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});

//get blank page in url
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  //Check is there already list in db with same name
  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        })
      }
    }
  });

});

//post route
app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });
  //Choose where to submit
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("Succesfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
        name: listName
      }, {
        $pull: {
          items: {
            _id: checkedItemId
          }
        }
      },
      function(err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      });
  }

});

app.get("/about", function(req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully.");
});

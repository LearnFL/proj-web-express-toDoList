import mongoose from "mongoose";
import {getDate} from "../date.mjs"

// LOCALHOST
// mongoose.connect('mongodb://localhost:27017/todolistDB');

// ATLAS
mongoose.connect('mongodb+srv://'+process.env.userName+':'+process.env.atlasPass+'@cluster0.ckkapiv.mongodb.net/?retryWrites=true&w=majority');


const itemsSchema = new mongoose.Schema({
  name: { type: String, required: [1]},
});

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

function addItem (item){
  Item.create({name: item}, (err) => {
    if (err){
      console.log(err);
    }
  });
};

function addToCustom (name, items){
  const newItem = new Item({name: items});
  List.updateOne({name: name}, { $push: {items: newItem} }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  // OR
  // List.findOne({name: name}, (err, found) => {
  //   found.items.push(newItem);
  //   found.save();
  // });
};

function deleteItem (id){
  Item.deleteOne({_id: id}, (err) => {
    if (err){
      console.log(err);
    }
  });
};

function deleteItemCustom (listName, id){
  List.findOneAndUpdate({name: listName}, { $pull: {items: { _id: id }} }, (err) => {
      if (err){
        console.log(err);
      }
    });
};

export {Item, List, addItem, deleteItem, addToCustom, deleteItemCustom} ;

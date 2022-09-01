import ejs from 'ejs';
import bodyParser from "body-parser";
import express from 'express';
import {} from 'dotenv/config';
import { getDate } from './date.mjs';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import session from 'express-session';
import _ from "lodash";
import {Item, List, addItem, deleteItem, addToCustom, deleteItemCustom } from './models/list.mjs'

// APP SETUP
var app = express();
const port = 3000;

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: true}));

// VIEWS SETUP
app.set('view engine', 'ejs');

//HOME
app.get('/', (req, res)=>{
  var day = getDate();
  const listName = req.body.list;
  if (!listName) {
    Item.find({}, (err, found) => {
      if (found.length === 0) {
        Item.insertMany([{name: "Hit the + button to add a new item."}, {name: "<--- Hit this to delete an item."}], (err) => {
        res.redirect('/');
        if (err) {console.log(err);}
        });
      } else {
        res.render('list', {listTitle:"Today", entries: found});
      }
    });
  }
});

// ADD TO THE LIST
app.post('/', (req, res)=>{
  const item = req.body.newItem;
  const listName = req.body.list;
  if (listName === "Today") {
    addItem(item);
    res.redirect('/');
  } else {
    addToCustom(listName, item);
    res.redirect('/' + listName);
    }
});

// DELETE FROM THE LIST
app.post('/delete', (req, res)=>{
  const item = req.body.checkbox;
  const listName = req.body.toDelete;
  if (listName === "Today") {
    deleteItem(item);
    res.redirect('/');
  }else {
    deleteItemCustom(listName, item);
    res.redirect('/' + listName);
  }
});

// CUSTOM LIST
app.get('/:customListName', (req, res)=>{
  const customListName = _.capitalize(req.params.customListName);
  var day = getDate();

  const defItem1 = new Item ({
    name: "Hit the + button to add a new item."
  });

  const defItem2 = new Item ({
    name: "<--- Hit this to delete an item."
  });

  const defaultList = [defItem1, defItem2];

  List.findOne({name: customListName}, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const defaultRecords = new List ({
          name: customListName,
          items: defaultList
        });
        defaultRecords.save();
        res.redirect('/'+ customListName);
      }else {
        res.render('list', {listTitle:foundList.name, entries: foundList.items});
      }
    }
  });
});

app.get('/about', (req, res)=>{
  res.render('about')
});

app.listen(process.env.PORT || port, ()=>{console.log('App is running.')});

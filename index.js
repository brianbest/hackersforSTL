/**
 * Created by brianbest on 14-11-30.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var util = require('util');


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//----------------------------------------------------
//Mongo DB application
//----------------------------------------------------
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect("mongodb://localhost:27017/myproject", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }




  app.post('/', function(req,res){
    var collection = db.collection('event');
    var info = {
      nameEvent : req.body.nameEvent,
      usrName : req.body.usrName,
      usrEmail : req.body.usrEmail,
      evtTime : req.body.evtTime,
      long : req.body.evtLong,
      lat: req.body.evtLat

    };
    collection.insert(info);
    //Create Event and save to DB
    console.log('saved event '+ req.body.nameEvent);

  });

  app.post('/getEvents',function(req,res){
    var collection = db.collection('event');
    console.log('got request');
    var stuff =  collection.find().toArray(function(err, items) {
      console.log(items);
      console.log(util.inspect(collection, {showHidden: false, depth: null}));
       return items;
    });
    console.log(stuff);

    //
    //res.send(collection);

    //console.log(collection + 'heres all the events');
    //collection.find({}).toArray(function (err,docs){
    //  console.log(docs);
    //});

  });

  db.close();
});
//----------------------------------------------------



app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

app.use(express.static(__dirname + '/dist'));






http.listen(3000, function(){
  console.log('listening on *:3000');
});

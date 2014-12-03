/**
 * Created by brianbest on 14-11-30.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var util = require('util');

var request = require('request');



app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//----------------------------------------------------
//Mongo DB application
//----------------------------------------------------
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var mongo = require('mongodb');
var BSON = mongo.BSONPure;

// Connection URL
var url = 'mongodb://localhost/myproject';
// Use connect method to connect to the Server
MongoClient.connect("mongodb://brianbest:thisisatest1@dogen.mongohq.com:10032/rally_point", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
    //
    //res.send(collection);

    //console.log(collection + 'heres all the events');
    //collection.find({}).toArray(function (err,docs){
    //  console.log(docs);
    //});



  db.close();
});
//----------------------------------------------------



app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

app.use(express.static(__dirname + '/dist'));


app.post('/', function(req,res){

  var info = {
    nameEvent : req.body.nameEvent,
    usrName : req.body.usrName,
    usrEmail : req.body.usrEmail,
    evtTime : req.body.evtTime,
    evtDetails : req.body.evtDetails,
    long : req.body.evtLong,
    lat: req.body.evtLat,
    members: 1

  };

  MongoClient.connect("mongodb://brianbest:thisisatest1@dogen.mongohq.com:10032/rally_point", function(err, db) {
    if (!err) {
      console.log("We are connected");
    }
    var collection = db.collection('event');
    collection.insert(info);
  });

  //Create Event and save to DB
  console.log('saved event '+ req.body.nameEvent);

});

app.post('/getEvents',function(req,res){

  console.log('Send files');
  var markers = [];
  MongoClient.connect("mongodb://brianbest:thisisatest1@dogen.mongohq.com:10032/rally_point", function(err, db) {
    if (!err) {
      //console.log("We are connected");
    }
    var collection = db.collection('event');
    collection.find({}).toArray(function (err, docs) {
      if (err) {
        return console.error(err)
      }
      docs.forEach(function (doc) {
        markers.push(doc);
        //console.log('found document: ', doc);

      });
      //console.log(markers);
      res.send({events : markers});
    });
  });

});

app.get('/addMember', function(req,res) {
  console.log('request came in');
  theID = req._parsedOriginalUrl.query;

  console.log('the id is '+ theID);
  console.log(util.inspect(req._parsedOriginalUrl.query, {showHidden: false, depth: null}));
  MongoClient.connect("mongodb://brianbest:thisisatest1@dogen.mongohq.com:10032/rally_point", function (err, db) {
    if (!err) {
      //console.log("We are connected");
    }
    var collection = db.collection('event');

    var ObjectId = require('mongodb').ObjectID;
    //var o_id = new BSON.ObjectID(theID);

    collection.update({ _id: new ObjectId(theID) }, { $inc: { members:1 }},{upsert:true,safe:false},
      function(err,data){
        if (err){
          console.log(err);
        }else{
          console.log("score succeded");
        }
      });

  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});


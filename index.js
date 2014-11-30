/**
 * Created by brianbest on 14-11-30.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

app.use(express.static(__dirname + '/dist'));


app.post('/create', function(req,res){

  //Create Event and save to DB
  console.log(req.body.usrName);

  //Join a user to a event table

})


http.listen(3000, function(){
  console.log('listening on *:3000');
});

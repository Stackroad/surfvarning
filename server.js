var express = require('express');
var path = require("path")
var bodyParser = require('body-parser')
var app = express();
var mongoose = require('mongoose');
var mustacheExpress = require('mustache-express');
var Pushover = require('node-pushover');

// adds mustache to end of file
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/mydb';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {

app.use(express.static('public'));

var push = new Pushover({
    token: "a51iuk5iwnn3k7gfswoxc66h3vd8ek",
    user: "u8xx2b59ao8nvuancemrx8p4tegx9g"
});

app.get('/', function (req, res) {
   res.render('welcome');
})

app.get('/surfvarning', function (req, res) {
   res.render('surfvarning');
})

// app.post('/create', function (req, res) {
//   console.log(req.body)
//   var insert = new TimeReports(req.body);
//   insert.save(function (err) {
//     if (err) return handleError(err);
//     res.redirect('/timereports');
//   });
// })

app.post('/send-pushover/', function (req, res) {
  var email_input = req.body.email_input
  var recipient_input = req.body.recipient_input
  var message_input = req.body.message_input

  if (recipient_input = 1){
    var recipient_text = " I have a challenge for you: "
  }
  else if (recipient_input = 2) {
    var recipient_text = " Admiration: "
  }
  else {
    var recipient_text = " Can I have your number? "
  }

  var title = "From: " + email_input
  var text = recipient_text + message_input
  push.send(title, text, function (err, res){
    if(err){
        console.log("We have an error:");
        console.log(err);
        console.log(err.stack);
    }else{
        console.log("Message send successfully");
        console.log(res);
    }
  });
  console.log(req.body)
  res.json()
})

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("App listening at http://%s:%s", host, port)
})

});

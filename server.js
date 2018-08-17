var express = require('express');
var path = require("path")
var bodyParser = require('body-parser')
var app = express();
var mongoose = require('mongoose');
var mustacheExpress = require('mustache-express');
var Pushover = require('node-pushover');
var nodemailer = require('nodemailer');

// adds mustache to end of file
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/surfvarningdb';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {

  //Define a schema
  var surfvarningSchema = new mongoose.Schema({
      spot: String,
      email: String },
      { timestamps: true }
  );

  var Surfvarning = mongoose.model('surfvarningclients', surfvarningSchema);

  app.use(express.static('public'));

  var fs = require('fs');
  var fileContents;
  var userpass = fs.readFileSync('./surfvarningScrapy/surfvarningScrapy/userPassword.txt', 'utf8').split(" ")
  var user = userpass[0]
  var pass = userpass[1]

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: user,
    pass: pass
  }
  });

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

  app.get('/managesubscription', function (req, res) {
     res.render('managesubscription', {email : req.query.email, spot : req.query.spot});
  })

  app.get('/activatesubscription', function (req, res) {
     res.render('activatesubscription', {email : req.query.email, spot : req.query.spot});
  })

  app.post('/checkAlreadySubscribing', function (req, res) {
    var email_input = req.body.email_input
    var recipient_input = req.body.recipient_input
    var newSubscriberStatus = true

    Surfvarning.find(
      {"email" : email_input},
      function (err, timereports) {
        for (var key in timereports) {
          if (timereports[key]["spot"] == recipient_input) {
            newSubscriberStatus = false
          }
        }
        res.json({newSubscriber : newSubscriberStatus})
      })
  })

  app.post('/sendActivationEmail', function (req, res) {
    var email_input = req.body.email_input
    var recipient_input = req.body.recipient_input
    var sendEmail = true

    var mailOptions = {
      from: 'surfvarning@gmail.com',
      to: email_input,
      subject: 'Activate surfvarning subscription for ' + recipient_input + '! 🏄',
      html: '<h2>We are glad that you want to surf and subscribe to surfvarning!</h2> <br> <p>Follow this <a href=http://127.0.0.1/activatesubscription?email=' + email_input + '&spot=' + recipient_input + '>link</a> to activate the subscription.  </p>'
      };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        sendEmail = false
      }
      else {
        console.log('Email sent: ' + info.response);
      }
  });
  res.json({emailStatus : sendEmail})
  })

  app.post('/subscriptionInsert', function (req, res) {
    var email_input = req.body.email_input
    var recipient_input = req.body.recipient_input
    var insertNew = true

    Surfvarning.find(
      {"email" : email_input},
      function (err, timereports) {
        for (var key in timereports) {
          if (timereports[key]["spot"] == recipient_input) {
            insertNew = false
          }
        }
          if (insertNew) {
            var insert = new Surfvarning({spot: req.body.recipient_input, email: req.body.email_input});
            insert.save(function (err, insert) {
              if (err) {
                return console.error(err)
              };
            })
          }
          res.json({inserted : insertNew})
      })
  })

  app.delete('/subscription', function (req, res) {
    var email_input = req.query.email_input
    var recipient_input = req.query.recipient_input
    var removedStatus
    Surfvarning.remove({ email: email_input, spot: recipient_input }, function(err, removed) {
      if(err) {
        console.log(err)
      }
      if (removed.n == 1) {
        removedStatus = true
      }
      else {
        removedStatus = false
      }
      res.json({removed : removedStatus})
    });
  })

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
      }
      else {
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

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:contracker');


var Convention = require('./models/convention');

var app = express();

var staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded())

app.get('/', function(req, res) {
  var indexPath = path.join(__dirname, '/index.html');
  res.sendFile(indexPath);
});

app.get('/new_user', function(req, res) {
  var indexPath = path.join(__dirname, '/new_user.html');
  res.sendFile(indexPath);
});

app.get('/conventions', function(req, res) {
  Convention.find({}, function(err, data) {
    console.log(data)
    res.send(data || []);
  })
});

app.post('/new', function(req, res) {
  console.log(req.body)

  Convention.findOne({ convention_name: req.body.convention_name }, (err, convention) => {
    if (err) return next(err);
    console.log(req.user, req.body.stickied)

    if (convention) {
      return res.status(422).send({error: 'Convention Already Exists'});
    } else {
      const data = req.body;
      data.creatorId = req.body.participant_list[0];
      const newConvention = new Convention(data);
      newConvention.save();
      res.send(newConvention);
    }
  });
})

app.listen(3000, function() {
  console.log('listening');
});

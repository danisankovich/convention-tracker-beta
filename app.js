var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:contracker');


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
    if (err) res.send('ERROR')
    // console.log(data)
    res.send(data || []);
  })
});

app.post('/new', function(req, res) {
  console.log(req.body)

  Convention.findOne({ convention_name: req.body.convention_name }, function(err, convention) {
    if (err) return next(err);

    if (convention) {
      return res.status(422).send({error: 'Convention Already Exists'});
    } else {
      var data = req.body;
      data.creatorId = req.body.participant_list[0];
      var newConvention = new Convention(data);
      newConvention.save();
      res.send(newConvention);
    }
  });
});

app.post('/join', function(req, res) {
  Convention.findById(req.body._id, function(err, convention) {
    if (err) return next(err);

    if (convention.participant_list.indexOf(req.body.full_name) > -1) {
      return res.status(422).send({error: 'You Are Already Listed'});
    }

    convention.participant_list.push(req.body.full_name);
    convention.save();
    res.send(convention);
  });
})

app.post('/leave', function(req, res) {
  Convention.findById(req.body._id, function(err, convention) {
    if (err) return next(err);

    convention.participant_list = req.body.participant_list;
    convention.save();
    res.send(convention);
  });
})

app.listen(3000, function() {
  console.log('listening');
});

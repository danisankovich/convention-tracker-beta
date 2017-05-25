var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:contracker');

var Convention = require('./models/convention');
var User = require('./models/user');

var app = express();

var staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded())

app.get('/', function(req, res) {
  var indexPath = path.join(__dirname, '/views/index.html');
  res.sendFile(indexPath);
});

app.get('/login', function(req, res) {
  var indexPath = path.join(__dirname, '/views/login.html');
  res.sendFile(indexPath);
});

app.get('/new_user', function(req, res) {
  var indexPath = path.join(__dirname, '/views/new_user.html');
  res.sendFile(indexPath);
});

app.get('/conventions', function(req, res) {
  Convention.find({}, function(err, data) {
    if (err) res.send('ERROR')
    console.log(data);

    function compare(a,b) {
      if (a.convention_start_date < b.convention_start_date)
        return -1;
      if (a.convention_start_date > b.convention_start_date)
        return 1;
      return 0;
    }

    data = (data || []).sort(compare);

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

app.post('/new_user', function(req, res) {
  console.log(req.body)

  User.findOne({ full_name: req.body.full_name }, function(err, user) {
    if (err) return next(err);

    if (user) {
      return res.status(422).send({error: 'User Already Exists'});
    } else {
      var data = req.body;
      var newUser = new User(data);
      newUser.save();
      res.send(newUser);
    }
  });
});

app.post('/login', function(req, res) {

  User.findOne({ userName: req.body.userName }, function(err, user) {
    if (err) return next(err);
    if (user && user.password === req.body.password) {
      console.log(user)
      res.send(user);
    } else {
      console.log('asdf')
      res.status(422).send('username/password combination is incorrect');
    }

  });
});

app.post('/join/', function(req, res) {
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

app.listen(process.env.PORT || 3000, function() {
  console.log('listening');
});

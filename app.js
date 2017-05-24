var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded())

app.get('/', (req, res) => {
  var indexPath = path.join(__dirname, '/index.html');
  res.sendFile(indexPath);
});

app.get('/new_user', (req, res) => {
  var indexPath = path.join(__dirname, '/new_user.html');
  res.sendFile(indexPath);
});

app.post('/new', function(req, res) {
  console.log(req.body)
  console.log('yup');
  res.send(req.body);
})

app.listen(3000, function() {
  console.log('listening');
});

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: {type: String, lowercase: true, required: true, unique: true},
  full_name: {type: String, lowercase: true, require: true, unique: true},
  password: {type: String, require: true},
});

var USER = mongoose.model('user', userSchema);
module.exports = USER;

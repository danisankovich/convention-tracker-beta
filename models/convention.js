var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conventionSchema = new Schema({
  convention_name: {type: String, lowercase: true, required: true, unique: true},
  convention_location: {type: String, lowercase: true, require: true },
  convention_start_date: {type: String, default: false},
  convention_end_date: {type: String, default: false},
  participant_list: Array,
});

var CONVENTION = mongoose.model('convention', conventionSchema);
module.exports = CONVENTION;

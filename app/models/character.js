//grab the packages needed for the model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//character Schema
var CharacterSchema = new Schema({
	symbol: { type: String, required: true, index: { unique: true }},
	definition: [],
 	pronunciation: String,
 	radicals: String,
 	category: String,
 	dateSubmitted: { type: Date, default: Date.now },
 	submittedBy: String,
 	dateEdited: Date,
 	editedBy: String,
 	strokeCount: Number
});

module.exports = mongoose.model('Character', CharacterSchema);
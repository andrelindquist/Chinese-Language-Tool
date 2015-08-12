//grab the packages needed for the model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//character Schema
var CharacterSchema = new Schema({
	symbol: { type: String, required: true, index: { unique: true }},
	definition: String,
 	pronunciation: String,
 	radicals: String,
 	category: String,
 	proficiency: String,
 	dateSubmitted: { type: Date, default: Date.now },
 	dateEdited: Date,
 	submittedBy: String,
 	editedBy: String,
 	strokeCount: Number
});

module.exports = mongoose.model('Character', CharacterSchema);
var Character = require('../models/character');
var config = require('../../config');

module.exports = function(app, express) {

//get an instance of the express router
var apiRouter = express.Router();

//test route to make sure everything is working
//accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray!, welcome to our API!' });
});

//more routes will happen here -----

//ROUTES FOR OUR API
//==================

//middleware for all requests
apiRouter.use(function(req, res, next) {
	console.log('a user came to the app');
	next();
})

//test route
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray- you found our api' });
});

//on routes that end with /characters
apiRouter.route('/characters')

	//create new character entry using POST
	.post(function(req, res) {

		//create instance of Character model
		var character = new Character();
		//set information from the request
		character.symbol = req.body.symbol;
		character.definition = req.body.definition;
	    character.pronunciation = req.body.pronunciation;
		character.radicals = req.body.radicals;
		character.category = req.body.category;
		character.proficiency = req.body.proficiency;
		character.date = req.body.date;
		character.other = req.body.other;

		character.save(function(err) {
			if (err) {
				//duplicate entry
				if (err.code == 11000)
					return res.json({ success: false, message: 'That character has already been entered'});
				else
					return res.send(err);
			}
				res.json({ message: 'character entered!' });
		});
	})

	//GET all characters
	.get(function(req, res) {
		Character.find(function(err, characters) {
			if (err) res.send(err);

			//return characters
			res.json(characters);
		});
	});

//on routes ending with /characters/:character_id
//--------------------
apiRouter.route('/characters/:character_id')

	//get character with that id
	//access using GET @ http://localhost:8080/api/characters/:character_id
	.get(function(req, res) {
		Character.findById(req.params.character_id, function(err, character) {
			if (err) res.send(err);

			//return character
			res.json(character);
		})
	})

	//update the user with this id
	//access using PUT @ http://localhost:8080/api/characters/:character_id
	.put(function(req, res) {

		//use our model to find character we want
		Character.findById(req.params.character_id, function(err, character) {

			if (err) res.send(err);

			//update the characters info only if text has been entered
			if (req.body.definition) character.definition = req.body.definition;
			if (req.body.pronunciation) character.pronunciation = req.body.pronunciation;
			if (req.body.radicals) character.radicals = req.body.radicals;
			if (req.body.category) character.category = req.body.category;
			if (req.body.proficiency) character.proficiency = req.body.proficiency;
			if (req.body.date) character.date = req.body.date;
			if (req.body.other) character.other = req.body.other;



			//save the character
			character.save(function(err) {
				if (err) res.send(err);

				//return a message
				res.json({ message: 'Character Updated.'})
			});
		});
	})

	//delete character with this id
	//access using DELETE @ http://localhost:8080/api/characters/:character_id
	.delete(function(req, res) {
		Character.remove({
			_id: req.params.character_id
		}, function(err, character) {
			if (err) return res.send(err);

			res.json({ message: 'Successfully Deleted.'});
		});
	});

	return apiRouter;

};
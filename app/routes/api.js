var bodyParser = require('body-parser');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var Character = require('../models/character');
var config = require('../../config');

//'super secret' for creating web tokens
var superSecret = config.secret;

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

//route to authenticate a user
apiRouter.post('/authenticate', function(req, res) {
	//find the user
	User.findOne({
		username: req.body.username
	}).select('username password').exec(function(err, user) {
		if (err) throw err;
		//unable to find given username
		if (!user) {
			res.json({
				success: false,
				message: 'Authentication failed.  User not found.'
			});
		} else if (user) {
			//check if password matches
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				res.json({
					success: false,
					message: 'Authentication failed.  Wrong Password.'
				});
			} else {
				//if user is found and password is right
				//create a token
				var token = jwt.sign({
					username: user.username
				}, superSecret, {
					expiresInMinutes: 1440 // expires in 24 hours
				});

				//return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});

//on routes that end with /users
apiRouter.route('/users')
	//create a user
	.post(function(req, res) {
		var user = new User(); //create new instance of User model
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			if (err) {
				//duplicate entry
				if (err.code == 11000) {
					return res.json({ success: false, message: 'That username has already been registered.'});
				} else {
					return res.send(err);
				}
			}
				//return a message
				res.json({ message: 'User created!' });
		});
	})

// //route middleware to verify a token
apiRouter.use(function(req, res, next) {
	//do logging
	console.log('somebody came to our app!');
	//check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	//decode token
	// if (token) {
	// 	//verifies secret and checks expiration
		jwt.verify(token, superSecret, function(err, decoded) {
	// 		if (err) {
	// 			res.status(403).send({
	// 				success: false,
	// 				message: 'Failed to authenticate token.'
	// 			});
	// 		} else {
	// 			//if everything is good, save request for use in other routes
				req.decoded = decoded;
				next(); //make sure we go to next routes and not stop here
	// 		}
		});
});
//function version of middleware
function isAuthenticated(req, res, next) {
		//do logging
	console.log('somebody came to our app!');
	//check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	//decode token
	if (token) {
		//verifies secret and checks expiration
		jwt.verify(token, superSecret, function(err, decoded) {
			if (err) {
				res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				//if everything is good, save request for use in other routes
				req.decoded = decoded;
				next(); //make sure we go to next routes and not stop here
			}
		});
	} else {
		//if there is no token
		//return a HTTP 403 (access foridden)
		res.status(403).send({
			success: false,
			message: 'no token provided.'
		});
	}
}


//on routes ending in /users/:user_id
apiRouter.route('/users/:username')
	//get the user with that id
	.get(function(req, res) {
		User.findOne({username: req.params.username}, function(err, user) {
			if (err) {
				res.send(err);
			}
			//return that user
			res.json(user);
		});
	})
	//update the user with this id
	.put(isAuthenticated, function(req, res) {
		User.findOne({username: req.params.username}, function(err, user) {
			if (err) {
				res.send(err);
			}
			//set new user information if it exists
			if (req.body.username) { user.username = req.body.username; }
			if (req.body.password) { user.password = req.body.password; }
			//save the user
			user.save(function(err) {
				if (err) {
					res.send(err);
				}
				//return a message
				res.json({ message: 'User updated!' });
			});
		})
	})



	//api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

//route to update user's vocabList
apiRouter.route('/vocablist/:username')
	.put(function(req, res) {
		User.findOne({username: req.params.username}, function(err, user) {
			if (err) {
				res.send(err);
			}
			user.vocabList = req.body;
			user.save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json({ message: 'User Data Updated!'});
			});
		})
	})


//on routes that end with /characters
apiRouter.route('/characters')

	//GET all characters
	.get(function(req, res) {
		Character.find(function(err, characters) {
			if (err) res.send(err);

			//return characters
			res.json(characters);
		});
	})

	//create new character entry using POST
	.post(isAuthenticated, function(req, res) {

		console.log(req.body);

		//create instance of Character model
		var character = new Character();
		//set information from the request
		character.symbol = req.body.symbol;
		character.definition = req.body.definition;
	    character.pronunciation = req.body.pronunciation;
	    character.strokeCount = req.body.strokeCount;
		character.radicals = req.body.radicals;
		character.category = req.body.category;
		character.proficiency = req.body.proficiency;
		character.dateSubmitted = new Date();
		character.submittedBy = req.body.username;

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
	.put(isAuthenticated, function(req, res) {

		//use our model to find character we want
		Character.findById(req.params.character_id, function(err, character) {

			if (err) res.send(err);

			//update the characters info only if text has been entered
			if (req.body.definition) character.definition = req.body.definition;
			if (req.body.pronunciation) character.pronunciation = req.body.pronunciation;
			if (req.body.radicals) character.radicals = req.body.radicals;
			if (req.body.strokeCount) character.strokeCount = req.body.strokeCount;
			if (req.body.category) character.category = req.body.category;
			if (req.body.proficiency) character.proficiency = req.body.proficiency;
			character.dateEdited = new Date();
			character.editedBy = req.body.username;



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
	.delete(isAuthenticated, function(req, res) {
		Character.remove({
			_id: req.params.character_id
		}, function(err, character) {
			if (err) return res.send(err);

			res.json({ message: 'Successfully Deleted.'});
		});
	});

	return apiRouter;

};
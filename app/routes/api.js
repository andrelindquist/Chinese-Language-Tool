var bodyParser = require('body-parser');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var request = require('request');
var cheerio = require('cheerio');
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

apiRouter.route('/addchar/:symbol')
	//Grabs char data with user-specified symbol and makes Post request
	.post(function(req, res) {
		//req.body.character should be a chinese symbol
		console.log(req.params.symbol);
//////////Scraping Goes Here///////////////////////////////

		// url = 'http://www.cantonese.sheik.co.uk/dictionary/characters/%E5%B0%84/'; //test url
		// url = 'http://www.cantonese.sheik.co.uk/dictionary/characters/%E9%9B%BB/';
		url = 'http://www.cantonese.sheik.co.uk/dictionary/characters/' + encodeURI(req.params.symbol) + '/';

		console.log(url);

		request(url, function(error, response, html){
			if(!error){
				console.log('no request error- go scraping');
				var $ = cheerio.load(html);

				var character, definitions, pronunciation, strokeCount, radicals
				var json = { character: "", definitions: [], pronunciation: "", strokeCount: "", radicals: ""};

				$('.word').filter(function(){
			        var data = $(this);
			        character = data.text();
			        json.character = character;
		        });

				//get pronunciation
		        $('.cardjyutping').filter(function(){
		        	var data = $(this);
		        	pronunciation = data.children()[0].prev.data;
		        	pronunciation += data.children()[0].children[0].data;
		        	json.pronunciation = pronunciation;
		        });

		        $('.charstrokecount').filter(function(){
		        	var data = $(this);
		        	strokeCount = data.text();
		        	strokeCount = strokeCount.replace("Stroke count: ", '');
		        	json.strokeCount = strokeCount;
		        });

		        //get radicals
		        $('.charradical .chinesemed').filter(function(){
		        	var data = $(this);
		        	try {
			        	radicals = data.children()[0].children[0].data;
			        	json.radicals = radicals;
			        }
			        catch(e) {
			        	console.log('unable to get radical');
			        }
		        });

		        $('.wordmeaning').filter(function(){
					var definitionData = $(this);
					var definitionDataString = definitionData.html();
					var definitionString = truncateString(definitionDataString);
					if (definitionString.indexOf('[1]') > -1) {
						json.definitions = getDefs(definitionString);
					}
					else {
						json.definitions = definitionString.split(";");
					}
					json.definitions = trimDefs(json.definitions);
					
		        	//return a substring of the html string containing the definitions
					function truncateString(htmlString) {
						var truncatedString = '';
						var nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
						var firstBracket = false;
						var startIndex = 0;   //Default is 0, therefore a htmlString not containing '[n]' will still be captured
						var i;
						for (i = 0; i < htmlString.length; i += 1) {
							if (!firstBracket) {
								if (htmlString[i] === '[') {
									if (htmlString[i + 2] === ']') {
										for (var j = 0; j < nums.length; j += 1) {
											if (htmlString[i + 1] === nums[j]) {
												firstBracket = true;
												startIndex = i;
											}
										}
									}
								}
							}
							if (htmlString.substring(i, i + 4) === '<br>' && htmlString.substring(i + 4, i + 11).indexOf('<br>') > -1) {
								return htmlString.substring(startIndex, i);
							}						
						}
					}

					//traverse substring generated from function truncateString and collect each definition in an array
					function getDefs(htmlString) {
						var definitionArray = [];
						var nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9']; //used to detect bracket pattern
						var firstBracket = false;
						var startIndex;
						var endIndex;
						var defHolder = '';
						for (var i = 0; i < htmlString.length; i += 1) {
							if (!firstBracket) {
								secondBracket = false;
								if (htmlString[i - 2] === '[') {
									if (htmlString[i] === ']') {
										for (var j = 0; j < nums.length; j += 1) {
											if (htmlString[i - 1] === nums[j]) {
												firstBracket = true;
												startIndex = i + 1;
											}
										}
									}
								}
							}
							if (firstBracket) {
								if (htmlString[i] === '[') {
									for (var k = 0; k < nums.length; k += 1) {
										if (htmlString[i + 1] === nums[k]) {
											endIndex = i - 1;
											firstBracket = false;
											definitionArray.push(htmlString.substring(startIndex, endIndex));
										}
									}
								}
								if (i > endIndex && i === htmlString.length - 1) {
									endIndex = i;
									definitionArray.push(htmlString.substring(startIndex, endIndex + 1));
								}						
							}
						}
						return definitionArray;
					}

					//Regexp's to trim each definition in json.definitions
					function trimDefs(definitionArray) {
						for (var b = 0; b < definitionArray.length; b += 1) {
							definitionArray[b] = definitionArray[b].replace("<br>", '');
							definitionArray[b] = definitionArray[b].replace("\r", '');
							definitionArray[b] = definitionArray[b].replace("\n", '');
							definitionArray[b] = definitionArray[b].replace(/\s\s+/g, '');
							definitionArray[b] = definitionArray[b].replace("&apos;", "'");
						}
						return definitionArray;
					}
		        })
			}
//////////////////////////////////////////////////////////

			//Create Character model and set properties to requested data
			var character = new Character();
			character.symbol = json.character;
			character.definition = json.definitions;
			character.pronunciation = json.pronunciation;
			character.strokeCount = json.strokeCount;
			character.radicals = json.radicals;
			// character.category;
			character.submittedBy = 'testing';
			character.dateSubmitted = new Date();

			character.save(function(err) {
				console.log('char data');
				console.log(character);
				if (err) {
					//duplicate entry
					if (err.code == 11000) {
							console.log('this char already exists');
							return res.json({ success: false, message: 'That character has already been entered'});
						}
					else
						return res.send(err);
				}
					res.json({ message: 'character entered!' });
			});
		})
	});

	return apiRouter;

};
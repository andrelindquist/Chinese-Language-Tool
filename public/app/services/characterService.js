angular.module('characterService', [])

.factory('Character', function($http) {

	//create a new object
	var characterFactory = {};

	//get a single character
	characterFactory.get = function(id) {
		return $http.get('/api/characters/' + id);
	};

	//get all characters
	characterFactory.all = function() {
		return $http.get('/api/characters/');
	};

	//enter a new character
	characterFactory.create = function(characterData, username) {
		characterData.username = username;
		return $http.post('/api/characters/', characterData);
	};

	//update a character
	characterFactory.update = function(id, characterData, username) {
		//Removes empty elements from the definition array
		for (var i = 0; i < characterData.definition.length; i += 1) {
			if (characterData.definition[i] === "") {
				characterData.definition.splice(i, 1);
			}
		}
		//Keep track of the username that edited the character data
		characterData.username = username;
		return $http.put('/api/characters/' + id, characterData);
	};

	//delete a character
	characterFactory.delete = function(id) {
		return $http.delete('/api/characters/' + id);
	};

	//save scraped char data
	characterFactory.addChar = function(symbol) {
		return $http.post('/api/addchar/' + symbol);
	};

	//return our entire userFactory object
	return characterFactory;

});

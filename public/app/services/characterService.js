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
	characterFactory.create = function(characterData) {
		return $http.post('/api/characters/', characterData);
	};

	//update a character
	characterFactory.update = function(id, characterData) {
		return $http.put('/api/characters/' + id, characterData);
	};

	//delete a character
	characterFactory.delete = function(id) {
		return $http.delete('/api/characters/' + id);
	};

	//return our entire userFactory object
	return characterFactory;

});

angular.module('userService', [])

.factory('User', function($http) {
	var userFactory = {};

	//get a single user
	userFactory.get = function(username) {
		return $http.get('/api/users/' + username);
	};

	//create a user
	userFactory.create = function(userData) {
		return $http.post('/api/users/', userData);
	}

	//update a user
	userFactory.update = function(id, userData) {
		return $http.put('/api/users/' + id, userData);
	}

	//Returns User's vocabList updated with quiz results
	userFactory.logResults = function(vocabList, quiz) {

		var addMissingSymbols = function() {
			var listToAdd = [];
			for (var i = 0; i < quiz.questions.length; i += 1) { //can pass in the quiz object or just quiz.questions - change accordingly
				var presentInList = false;

				for (var j = 0; j < vocabList.length; j += 1) {
					if (quiz.questions[i].symbol == vocabList[j].symbol) {
						presentInList = true;
						j = vocabList.length;
					}
				}
				if (!presentInList) {
					var characterObject = {
						symbol: quiz.questions[i].symbol,
						proficiency: 1, 
						nCorrect: 0, 
						nWrong: 0
					}
					listToAdd.push(characterObject);
				}
			}
			vocabList = vocabList.concat(listToAdd);
		}

		addMissingSymbols();

		for (var n = 0; n < quiz.questions.length; n += 1) {
			for (var m = 0; m < vocabList.length; m += 1) {
				if (quiz.questions[n].symbol == vocabList[m].symbol) {
					if (quiz.questions[n].correct) {
						if (vocabList[m].nCorrect >= 4) {
							vocabList[m].proficiency += 1;
							vocabList[m].nCorrect = 0;
						}
						vocabList[m].nCorrect += 1;

					} else {
						vocabList[m].nWrong += 1;
					}
				}
			}
		}
		return vocabList;
	}

	//update a user's vocabList property
	userFactory.updateVocabList = function(vocabList, quiz, username) {
		var updatedList = userFactory.logResults(vocabList, quiz);
		return $http.put('/api/vocablist/' + username, updatedList);
	}

	//return our entire userFactory object
	return userFactory;
})
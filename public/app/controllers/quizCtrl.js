//start angular module and inject services
angular.module('quizCtrl', ['quizService', 'characterService'])

//character controller for the main page
//inject character factory
.controller('quizController', function(Quiz, Character) {

	var vm = this;
		//grab all the characters at page load
	Character.all()
	  .success(function(data) {

	  	//when all characters come back, remove the processing variable
	  	vm.processing = false;

	  	//bind the users that come back to vm.characters
	  	vm.characters = data;
	  });

	vm.makeQuiz = function(key, value, number) {
		Quiz.makeQuiz(vm.characters, key, value, number);
		vm.quiz = Quiz.quiz;
		console.log(vm.quiz);
	}

	vm.nextQuestion = function() {
		Quiz.nextQuestion();
	}

	vm.previousQuestion = function() {
		Quiz.previousQuestion();
	}

	vm.checkAnswer = function(inputAnswer) {
		Quiz.checkAnswer(inputAnswer);
	}

	vm.finishQuiz = function() {
		Quiz.finishQuiz();
	}

});



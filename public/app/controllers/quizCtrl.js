//start angular module and inject services
angular.module('quizCtrl', ['quizService', 'characterService', 'userService'])

//character controller for the main page
//inject character factory
.controller('quizController', function(Quiz, Character, User, Auth) {

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
		vm.logged = false;
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
		console.log(vm.quiz);
	}
	
	vm.logResults = function(quiz) {
		vm.logged = true;

			Auth.getUser()
		.then(function(data) {
			vm.user = data.data;

			vm.username = vm.user.username;
			
			User.get(vm.username)
		    	.success(function(data) {

			  	//bind the users that come back to vm.characters
			  	vm.user = data;
			  	//Call function from service to PUT new vocabList
			  	// console.log(User.logResults(vm.user.vocabList, quiz));
			  	console.log(vm.username);
			  	User.updateVocabList(vm.user.vocabList, quiz, vm.username);
			  });    	
		});
	}

	vm.logged = false;
});



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
			  	console.log(vm.user);
			  	User.updateVocabList(vm.user.vocabList, quiz, vm.username);
			  });    	
		});
	}

	//		9/2/2015
	//function to generate modified charData based on user's vocabList and quiz choice
	vm.makeUserCriteria = function(quizType) { //quizType paramter chosen from quiz dropdown menu
		//use a switch statement based on quizType to select a function to generate userCriteria array
		var userCriteria = [];

		Auth.getUser()
		.then(function(data) {
			vm.user = data.data;

			vm.username = vm.user.username;
			
			User.get(vm.username)
		    	.success(function(data) {

			  	//bind the users that come back to vm.characters
			  	vm.user = data;

			  	switch(quizType) {
			  		//for characters with incorrect attempts
			  		case "retry":
				  	for (var i = 0; i < vm.user.vocabList.length; i += 1) {
				  		if (vm.user.vocabList[i].nCorrect <= vm.user.vocabList[i].nWrong && vm.user.vocabList[i].nWrong > 0) {
				  			userCriteria.push(vm.user.vocabList[i]);
				  		}
				  	}
			  		break;
			  		//for characters not yet quizzed by user
			  		case "new":
				  	for (var i = 0; i < vm.characters.length; i += 1) {
				  		var charInBoth = false;
				  		for (var j = 0; j < vm.user.vocabList.length; j += 1) {
				  			if (vm.characters[i].symbol == vm.user.vocabList[j].symbol) {
				  				charInBoth = true;
				  			}
				  		}
				  		if (charInBoth == false) {
				  			userCriteria.push(vm.characters[i]);
				  		}
				  	}
				  	break;
				  	//for characters with ncorrect == 1 or 2
				  	case "reviewStageI":
				  	for (var i = 0; i < vm.user.vocabList.length; i += 1) {
				  		if (vm.user.vocabList[i].nCorrect >= 1 && vm.user.vocabList[i].nCorrect <= 2) {
				  			userCriteria.push(vm.user.vocabList[i]);
				  		}
				  	}
				  	break;
				  	//for characters with atleast 2 correct attempts but still in 'proficiency I'
				  	case "reviewStageII":
				  	for (var i = 0; i < vm.user.vocabList.length; i += 1) {
				  		if (vm.user.vocabList[i].nCorrect >= 2 && vm.user.vocabList[i].proficiency == 1) {
				  			userCriteria.push(vm.user.vocabList[i]);
				  		}
				  	}
				  	break;
				  	//for characters with proficiency level > 1
				  	case "reviewStageIII":
				  	for (var i = 0; i < vm.user.vocabList.length; i += 1) {
				  		if (vm.user.vocabList[i].proficiency > 1) {
				  			userCriteria.push(vm.user.vocabList[i]);
				  		}
				  	}
				  	break;
			  	}
			  	console.log(userCriteria);
			  });    	
		});
	}

	vm.makeUserCriteria('reviewStageI');

	vm.logged = false;
});



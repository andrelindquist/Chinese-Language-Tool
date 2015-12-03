angular.module('quizService', [])

.factory('Quiz', function() {

	//create a new Quiz object
	var quizFactory = {};

	quizFactory.makeQuiz = function(characterData, userCharacters, key, value, number) {
		var mq = this;

		//shuffle function
		function shuffle(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex ;
		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {
		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }
		  return array;
		}

		function getRandomNo(x) {
			return Math.floor((Math.random() * x) + 1)
		}

		//Limits character pool to the given value - if no key or value paramters are given, character pool may include any character
		var rawCharacterList = [];
	  	for (var i = 0; i < userCharacters.length; i += 1) {
			if (userCharacters[i][key] == value) {
				rawCharacterList.push(userCharacters[i]);
			}
		}

		rawCharacterList = shuffle(rawCharacterList);
		var trimmedCharacterList = rawCharacterList.slice(0, number);

		//conditional added in case user requests more characters than are availiable in the database
		if (number > rawCharacterList.length) {
			number = rawCharacterList.length;
		}

		function populateAnswerChoices(array, property) {
			var answerChoices = [];
			for (var i = 0; i < array.length; i += 1) {
				answerChoices.push(array[i][property][0]);
			}
			return shuffle(answerChoices);
		}

		mq.answerChoices1 = populateAnswerChoices(characterData, "definition");
		mq.answerChoices2 = populateAnswerChoices(characterData, "symbol");

		function Question(charList, index) {
			this.questionType = getRandomNo(2);
			this.symbol = charList[index].symbol;
			this.pronunciation = charList[index].pronunciation;
			if (this.questionType === 1) {
				this.question = charList[index].symbol;
				this.answer = charList[index].definition[0];
			}
			else {
				this.question = charList[index].definition[0];
				this.answer = charList[index].symbol;
			}

			this.getAnswerChoices = function(answer, questionType) {
				var choices = [];
				choices.push(answer);

				this.getChoice = function() {
					var duplicate = false;
					var randomIndex = getRandomNo(mq.answerChoices1.length - 1);
					for (var n = 0; n < choices.length; n += 1) {
						if (choices[n] === mq["answerChoices" + questionType][randomIndex]) {
							duplicate = true;
						}
					}
					if (duplicate === false) {
						choices.push(mq["answerChoices" + questionType][randomIndex]);
					}
				}
				while (choices.length < 4) {
					this.getChoice();
				}
				return shuffle(choices);
			}

			this.choices = this.getAnswerChoices(this.answer, this.questionType);
		}

		function Quiz(key, value, n) {
			this.charsKey = key;
			this.charsValue = value;
			this.charsLength = n;
			this.currentQuestion;
			this.questionIndex = 0;
			this.correctCount = 0;
			this.quizActive = false;
			this.quizFinished = false;
			this.questions = [];

			this.initiateQuiz = function() {
				this.quizActive = true;
				this.correctCount = 0;
				//Generate Question Objects; # depends on user request (or rawCharacterList if user requested # is > )
				for (var j = 0; j < n; j += 1) {
					this.questions.push(new Question(trimmedCharacterList, j));
				}
				this.currentQuestion = this.questions[this.questionIndex];
			}
			this.initiateQuiz();
			return this;
		}

		quizFactory.quiz = new Quiz(key, value, number);
	}

	quizFactory.nextQuestion = function() {
		if (quizFactory.quiz.questionIndex < quizFactory.quiz.questions.length - 1) {
			quizFactory.quiz.questionIndex += 1;
			quizFactory.quiz.currentQuestion = quizFactory.quiz.questions[quizFactory.quiz.questionIndex];
		}
	}

	quizFactory.previousQuestion = function() {
		if (quizFactory.quiz.questionIndex > 0) {
			quizFactory.quiz.questionIndex -= 1;
			quizFactory.quiz.currentQuestion = quizFactory.quiz.questions[quizFactory.quiz.questionIndex];
		}
	}

	quizFactory.checkAnswer = function(inputAnswer) {
		var currentQuestion = quizFactory.quiz.currentQuestion;
		if (!currentQuestion.attemptedAnswer) {
			currentQuestion.attemptedAnswer = inputAnswer;
			if (inputAnswer === currentQuestion.answer) {
				currentQuestion.correct = true;
				quizFactory.quiz.correctCount += 1;
				console.log('Correct!');
			}
			else {
				console.log('Wrong!');
			}
		}
		else {
			console.log('You already answered this question!');
		}
		return 'correct';
	}

	quizFactory.finishQuiz = function() {
		quizFactory.quiz.quizActive = false;
		quizFactory.quiz.quizFinished = true;
	}

	return quizFactory;
});

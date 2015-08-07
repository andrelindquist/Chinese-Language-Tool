angular.module('app.routes', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {

  	$routeProvider

  	  //home page route
  	  .when('/', {
  	  	templateUrl : 'app/views/pages/home.html'
  	  })
          
      // login page
      .when('/login', {
        templateUrl : 'app/views/pages/login.html',
          controller  : 'mainController',
            controllerAs: 'login'
      })

      // form to create a new user
      // same view as edit page
      .when('/users', {
        templateUrl: 'app/views/pages/users/single.html',
        controller: 'userCreateController',
        controllerAs: 'user'
      })

      // page to edit a user
      .when('/users/:user_id', {
        templateUrl: 'app/views/pages/users/single.html',
        controller: 'userEditController',
        controllerAs: 'user'
      })


  	  .when('/characters', {
  	  	templateUrl: 'app/views/pages/characters/all.html',
  	  	controller: 'characterController',
  	  	controllerAs: 'character'
  	  })

       //page to view all characters in "flashcard view"
      .when('/flashcards', {
        templateUrl: 'app/views/pages/characters/flashcards.html',
        controller: 'characterController',
        controllerAs: 'character'
      })

      //form to create a new character
      //same view as edit page
      .when('/characters/create', {
        templateUrl: 'app/views/pages/characters/single.html',
        controller: 'characterCreateController',
        controllerAs: 'character'
      })

      //page to edit character
      .when('/characters/:character_id', {
        templateUrl: 'app/views/pages/characters/single.html',
        controller: 'characterEditController',
        controllerAs: 'character'
      })

     ///// // - 01/07/2015 Experiment with new quiz service
      .when('/quiz', {
        templateUrl: 'app/views/pages/characters/quiz.html',
        controller: 'quizController',
        controllerAs: 'quiz'
      })


  	  //get rid of the hash sumbol in the URL
  	  $locationProvider.html5Mode(true);
  });
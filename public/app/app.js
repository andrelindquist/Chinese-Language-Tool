//name angular app
angular.module('characterApp', [
	'app.routes',
	'authService',
	'mainCtrl',
	'userService',
	'userCtrl',
	'dashboardCtrl',
	'characterService',
	'characterCtrl',
	'quizService',
	'quizCtrl',
    'resultsDirective',
    'iframeDirective'
	])

//application configuration to integrate token into requests
.config(function($httpProvider) {

	//attach out auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
	
});
//name angular app
angular.module('characterApp', [
	'app.routes',
	'characterService',
	'characterCtrl',
	'quizService',
	'quizCtrl',
    'resultsDirective',
    'iframeDirective'

	]);
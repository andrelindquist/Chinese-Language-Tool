angular.module('resultsDirective', []).
directive('quizResults', function() {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: false,
    templateUrl: 'app/views/templates/results.html'
  }  
});


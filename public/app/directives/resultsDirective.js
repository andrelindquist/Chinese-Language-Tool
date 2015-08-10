
angular.module('resultsDirective', []).
directive('quizResults', function() {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'app/views/templates/results.html'
  }  
});


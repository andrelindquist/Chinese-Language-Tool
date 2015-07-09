
angular.module('resultsDirective', []).
directive('quizResults', function() {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'app/views/templates/results.html',
    controller: ['$scope', function($scope) {
      $scope.test = function() {
        console.log('hi');
      }
    }],
    link: function(scope, element, attrs, controller) {
          scope.test();

          // element.addClass('quiz-answer');

          scope.$watch(function(scope){
              // console.log(scope.ngModel.quiz);

              if (scope.ngModel.hasOwnProperty('quiz')) {
                // console.log(scope.ngModel.quiz);
                if (scope.ngModel.quiz.quizFinished) {
                  console.log(element);
                }
              }

          });


        }

  }
});


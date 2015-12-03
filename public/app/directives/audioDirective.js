angular.module('audioDirective', []).
directive('audioButton', [function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var audioSrc;
            var audio;

            var audioSrc = attrs.address;
            // audioSrc = audioSrc + attrs.pronunication + ".wav";
            var audio = new Audio(audioSrc);

            scope.update = function() {
                audioSrc = attrs.address;
                audioSrc = audioSrc + attrs.pronunciation + ".wav";
                audio = new Audio(audioSrc);
            }

            scope.play = function() {
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
            };

            scope.quizPlay = function() {
                if (attrs.attempted) {
                    if (audio.paused) {
                        audio.play();
                    } else {
                        audio.pause();
                    }
                }
            };

            element.css({ 
                backgroundColor: '#bfdfff',
                display: 'inline-block'
            });
        }
    }
}]);
angular.module('audioDirective', []).
directive('audioButton', [function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var audioSrc;
            var audio;

            var audioSrc = attrs.address;
            audioSrc = audioSrc + attrs.pronunication + ".wav";
            var audio = new Audio(audioSrc);

            scope.update = function() {
                audioSrc = attrs.address;
                audioSrc = audioSrc + attrs.pronunciation + ".wav";
                audio = new Audio(audioSrc);
            }

            scope.play = function () {
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
            };

            element.css({
                width: '100px',
                height: '100px', 
                backgroundColor: '#aaa',
                display: 'inline-block'
            });
        }
    }
}]);
(function(){

var app = angular.module('crowdy.directives', []);

app.directive("taggingInstructions", function() {
    return {
        restrict: 'E',
        templateUrl:"templates/tagging/instructions.html"
    };
});

app.directive("relevanceInstructions", function() {
    return {
        restrict: 'E',
        templateUrl:"templates/relevance/instructions.html"
    };
});

// An auto input focus directive
// via http://stackoverflow.com/a/14837021/233577
app.directive('focusMe', ['$timeout', function($timeout) {
  return {
    scope: { trigger: '@focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === "true") { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
  };
}]);

app.directive("grokkingInstructions", function() {
    return {
        restrict: 'E',
        templateUrl:"templates/grokking/instructions.html",
        controller: function() {
            this.details = {
                title: "Guess a person's opinion!",
                preview: false,
                timeEstimate: "10000 min"
            };
        },
        controllerAs:"instructions"
    };
});

app.directive("feedbackForm", function() {
    return {
        restrict: 'E',
        templateUrl:"templates/feedbackform.html"
    };
});

app.directive("tagItem", function(){
    return {
        restrict: 'E',
        templateUrl:"templates/tagging/image-tag-slip.html"
    };
});

app.directive("relevanceItem", function(){
    return {
        restrict: 'E',
        templateUrl:"templates/relevance/image-relevance-slip.html"
    };
});

app.directive("relevanceTraining", function(){
    return {
        restrict: 'E',
        templateUrl:"templates/relevance/training.html"
    };
});

app.directive("taggingTraining", function(){
    return {
        restrict: 'E',
        templateUrl:"templates/tagging/training.html"
    };
});



app.directive("performanceFeedback", function(){
    return {
        restrict: 'E',
        templateUrl:"templates/performance-feedback.html"
    };
});

app.directive("grokImage", function(){
    return {
        restrict: 'E',
        templateUrl:"templates/grokking/image-grok-slip.html"
    };
});


app.directive("likeRating", function(){
    return {
        restrict: 'E',
        templateUrl:"templates/grokking/like-rating.html"
    };
});



})();

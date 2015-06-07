(function(){

var app = angular.module('crowdy-directives', []);

app.directive("taggingInstructions", function() {
    return {
        restrict: 'E',
        templateUrl:"templates/tagging/instructions.html",
        controller: function() {
            this.details = taskDetails;
        },
        controllerAs:"instructions"
    };
});

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

var taskDetails = {
    title: "Assign word labels ('tags') to describe images",
    preview: false,
    timeEstimate: "1 min"
};


})();

(function(){

angular.module('crowdy')
  .controller("feedbackCtrl", ['$scope', function($scope) {
    $scope.message1 = "";
    
    $scope.getMsg = function(n, cond){
        var responses = {
        satisfy: ["I hated it.", "I didn't like it", "It was OK", "It was great", "I loved it"],
        pay: ["Way too low.", "Lower than I'd like", "It was OK", "Better than usual", "Much better than usual"]
        };
        return responses[cond][n-1];
      };

  }]);

})();
(function(){

angular.module('crowdy')
    .controller("relevanceTaskItemController", ['$http', '$log', '$scope', '$rootScope',
         function($http, $log, $scope, $rootScope) {
        // Individual Item Controller

         var timeInFocus;

         $scope.tooltip = function(item){
           return "<em>Title: </em><strong>"+item.meta.title+"</strong><br/><em>Description: </em>"+item.meta.description;
         };
         
        // Individual item timer
        $scope.timeStart = function(item){
          if (!item.timing) {
          item.timing = new Date();
          }
        };

        $scope.timeStop = function(item){
          if (item.timing) {
            timeInFocus = (new Date()-item.timing)/1000;
            item.timeSpent += timeInFocus;
            delete item.timing;
          }
        };

        $scope.checkAnswer = function(item) {
            item.checked = true;
            $scope.choice = item.contribution.relevance[0];
            $scope.bestAnswer = _.max(item.answer.probs, 'prob').choice;
            $rootScope.$broadcast("masonry.reload");
            //$scope.trainingMessage = "checked Answer.";
        };

  }]);

})();

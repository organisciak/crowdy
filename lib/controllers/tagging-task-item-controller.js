(function(){

angular.module('crowdy')
    .controller("tagTaskItemController", ['$http', '$log', '$scope', '$rootScope',
         function($http, $log, $scope, $rootScope) {
        // Individual Item Controller

         var timeInFocus;
        $scope.$watch('tags', function(newValue, oldValue){
          // Only refresh masonry is the value actually changed
          // This also keeps from running on page load
          if (newValue !== oldValue) {
            $rootScope.$broadcast("masonry.reload");
          }
        });

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
            var getQuality = function (q){ 
                var result = _.find(['poor', 'ok','good','great'], 
                                    function(v){
                                        return (item.answer.tags[v].indexOf(q.toLowerCase()) >= 0);
                                    });
                return (result || 'unknown');
            };
            item.checked = true;
            $scope.message = "";
            $scope.choice = item.contribution.tags;
            var quality = _.map($scope.choice, getQuality);
            if (_.every(quality, function(x){return (x==="unknown");})) {
                // All tags are unknown
                $scope.message = "We're not sure about those tags, we haven't seen them before.";
            } else {
                for (var i = 0; i < item.contribution.tags.length; i++) {
                    if (quality[i] !== 'unknown'){
                        $scope.message = $scope.message + "'" + 
                            item.contribution.tags[i] + "' is a " + quality[i] + " tag. ";
                    }
                }
            }
            $scope.bestAnswer = "test"; //_.max(item.answer.probs, 'prob').choice;
            $rootScope.$broadcast("masonry.reload");
            //$scope.trainingMessage = "checked Answer.";
        };

  }]);

})();

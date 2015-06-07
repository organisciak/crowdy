(function(){

angular.module('crowdy')
 .controller("tagTaskController", ['$http', '$log', '$scope', '$routeParams', 
         function($http, $log, $scope, $routeParams) {
    var tasks;
    tasks = this;
    tasks.preview = $routeParams.preview;
    
    this.type = "tagging";
    tasks.items = []; // Initialize empty, set when it's available

    $scope.submitForm = function() {
        $log.log($scope);
        $log.log($scope.turkForm.$valid);
    };

    $scope.setTags = function() {

      
    };

    $http.get("data/taggingSample100.json").success(function(data){

        tasks.items = data.slice(0,3);

    });

  }]);

})();

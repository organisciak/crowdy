(function(){

angular.module('crowdy')
 .controller("tagTaskController", ['$http', '$log', '$scope', '$rootScope', '$routeParams', 
         function($http, $log, $scope, $rootScope, $routeParams) {
    var tasks;
    $scope.preview = $routeParams.preview;
    $log.log($routeParams);
    
    $scope.type = "tagging";
    $scope.items = []; // Initialize empty, set when it's available

    $scope.submitForm = function() {
        $log.log($scope);
        // Reload masonry, in case any errors pop up
        $rootScope.$broadcast("masonry.reload");
    };

    $http.get("data/taggingSample100.json").success(function(data){
        $scope.items = data.slice(0,6);
    });

  }])
 .controller("tagTaskItemController", ['$http', '$log', '$scope', '$rootScope', '$routeParams', 
         function($http, $log, $scope, $rootScope, $routeParams) {
        // Individual Item Controller
        $scope.$watch('tags', function(newValue, oldValue){
          // Only refresh masonry is the value actually changed
          // This also keeps from running on page load
          if (newValue !== oldValue) {
            $rootScope.$broadcast("masonry.reload");
          }
        });

  }]);

// END
})();

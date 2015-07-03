(function(){

angular.module('crowdy')
 .controller("instructionsController", ['$scope', 
         function($scope) {

    $scope.tab = 'instruct';

    $scope.setTab = function(tabName) {
        $scope.tab = tabName;
    }

  }]);


})();

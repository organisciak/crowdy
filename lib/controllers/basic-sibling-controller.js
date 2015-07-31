/* 
A set of functions specific to the 'basic' condition
This is a controller intended to be inheretted through the $controller service wrapper.

In the future, this is likely better off as a service.
*/

angular.module('crowdy')
 .controller("basicSiblingController", ['$scope', '$log', '$routeParams',
  function($scope, $log, $routeParams) {

    // LOADING AND SAVING FUNCTIONS
    $scope.p.conditionalPostLoadPrep = function() {
        if ($routeParams.timer || $scope.taskset.timer) {
              $log.warn("Ignoring timer for basic condition.");
        }
    };

  }
 ]);
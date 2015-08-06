/* 
A set of functions specific to the 'basic' condition
This is a controller intended to be inheretted through the $controller service wrapper.

In the future, this is likely better off as a service.
*/

angular.module('crowdy')
 .controller("basicSiblingController", ['$scope', '$log',
  function($scope, $log) {

    // LOADING AND SAVING FUNCTIONS
    $scope.p.conditionalPostLoadPrep = function(data) {
        if (data.timer) {
            $log.warn("Ignoring timer for basic condition.");
        }
        if (!data.itemTimeEstimate) {
            $scope.time.estimate = 60 * 3.5;
        } else {
            $scope.time.estimate = Math.round(10 * data.itemTimeEstimate * $scope.taskset.tasks.length)/10;
        }
    };
  }
 ]);

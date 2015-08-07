(function() {
    
    angular.module('crowdy')
    .controller("tagTaskController", ['$controller', '$http', '$log', 
    '$scope', '$rootScope', '$routeParams', function($controller, $http, 
    $log, $scope, $rootScope, $routeParams) {

    // Instructions
    $scope.instructions = {
        title: "Assign word labels ('tags') to describe images",
    };

    // Inherit shared parent controller
    $controller('taskController', { $scope: $scope });

    // Set Item template
    $scope.include = "/templates/tagging/" + $routeParams.design + "-index.html";

    $scope.type = "tagging";

    // Construct JSON callback
    var params = {
      callback: "JSON_CALLBACK",
      user: $scope.preview ? "PREVIEWUSER" : $routeParams.workerId,
      taskset_id:$scope.preview ? "TEST" : $routeParams.assignmentId,
      hit_id: $routeParams.hit_id,
      turk_hit_id: $routeParams.hitId, // Turk's id for the set of assignments
      assignment_id: $routeParams.assignmentId,
      lock: !($scope.preview)
    };
        
    var endpoint;
    if ($routeParams.debugHIT) {
        endpoint = 'data/debug-' + $scope.design + '-image-hit.json';
    } else {
        endpoint = $scope.BACKEND_SERVER + "/hit";
    }
        
    // LOAD TASK
    $http
        .jsonp(endpoint, {params: params})
        .success($scope.p.loadTaskSuccess)
        .error($scope.p.loadTaskError);
    
 //END CONTROLLER
 }
 ]);

// END ANONYMOUS FUNCTION
}
)();

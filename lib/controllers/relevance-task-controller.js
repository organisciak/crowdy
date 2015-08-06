(function() {
    
    angular.module('crowdy')
    .controller("relevanceTaskController", ['$controller', '$http', '$log', 
    '$scope', '$rootScope', '$routeParams', function($controller, $http, 
    $log, $scope, $rootScope, $routeParams) {

    // Instructions
    $scope.instructions = {
        title: "Judge if an image is relevance to a web search",
        meta: null
    };

    // Inherit shared parent controller
    $controller('taskController', { $scope: $scope });

    // Set Item template
    $scope.include = "/templates/relevance/basic-index.html";
    $scope.judgeOptions = ['Very Relevant', 'Somewhat Relevant', 'Not Relevant'];
    $scope.type = "relevance";

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
        endpoint = 'data/debug-' + $scope.condition + '-image-hit.json';
    } else {
        endpoint = $scope.BACKEND_SERVER + "/hit";
    }

    $scope.p.taskTypePostLoadPrep = function(data) {
        $scope.instructions.title = "Judge if an image is relevance to a web search for '"+data.taskset.facet.meta.query+"'";
        $scope.instructions.meta = data.taskset.facet.meta;
    };
        
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

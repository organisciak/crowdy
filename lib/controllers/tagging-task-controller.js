"use strict";
(function() {
    
    angular.module('crowdy')
    .controller("tagTaskController", ['$controller', '$http', '$log', 
    '$scope', '$rootScope', '$routeParams', function($controller, $http, 
    $log, $scope, $rootScope, $routeParams) {

        // Inherit shared parent controller
        $controller('taskController', { $scope: $scope });
        
        // Backend server e.g. http://localhost:3000
        $scope.BACKEND_SERVER = ".";
        
        // Set Item template
        $scope.include = "/templates/tagging/" + $routeParams.condition + "-index.html";
        
        $scope.type = "tagging";
        
        // Construct JSON callback
        var params = {
            callback: "JSON_CALLBACK",
            user: $scope.preview ? "PREVIEWUSER" : $routeParams.workerId,
            taskset_id: $scope.preview ? "TEST" : $routeParams.assignmentId,
            hit_id: $routeParams.hit_id,
            assignment_id: $routeParams.assignmentId,
            lock: !($scope.preview)
        };
        
        var endpoint;
        if ($rootScope.debug) {
            endpoint = 'data/debug-' + $scope.condition + '-image-hit.json';
        } else {
            endpoint = $scope.BACKEND_SERVER + "/hit";
        }
        
        // LOAD TASK
        $http
            .jsonp(endpoint, {params: params})
            .success($scope.p.loadTaskSuccess)
            .error($scope.p.loadTaskError);
    
    }
    ]);
    //END CONTROLLER
    // END ANONYMOUS FUNCTION
}
)();

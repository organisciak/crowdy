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

    $scope.p.taskTypePostLoadPrep = function(data) {
      // Set up training if we got it
      if (data.training && !$scope.preview) {
        // convert answers to {item:answer} key-value pairs
        $scope.training = true;
        var answers = _.reduce(data.training.answers,function(map,item){ map[item.item] = item.answer; return map;},{});
        $scope.taskset.tasks = _.map($scope.taskset.tasks, function(task){
                task.answer = answers[task.item.id];
                    return task;
        });
        
      var bonusmsg = "";
      if ($scope.bonusStructure.firstTask) {
            bonusmsg = " Because training is a bit slower, we'll give you a " +
                $scope.bonusStructure.firstTask +
                " bonus.";
      }

        $scope.openModal({
            show:{ok:true, close:false},
            title: "First task!",
            message: "Since this if your first task, we'll give you the answers. After every contribution, click 'Check Answer' to see if you did it correctly. Have fun, and we hope you do more tasks where we <em>don't</em> know the answer!" + bonusmsg
        });
      }
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

(function(){

angular.module('crowdy')
 .controller("tagTaskController", ['$http', '$sce', '$httpParamSerializerJQLike', '$log', '$modal', '$scope', '$rootScope', '$routeParams', 
         function($http, $sce, $httpParamSerializerJQLike, $log, $modal, $scope, $rootScope, $routeParams) {

    var BACKEND_SERVER = "."; // e.g. http://localhost:3000

    // Set Item template
    $scope.include = "/templates/tagging/"+ $routeParams.condition +"-index.html";

    // Params
    $scope.condition = $routeParams.condition;
    $scope.preview = ($routeParams.assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE' );
    $scope.formSubmitTo = $sce.trustAsResourceUrl($routeParams.turkSubmitTo + "/mturk/externalSubmit");
    $scope.assignmentId = $routeParams.assignmentId;

    $rootScope.debug = $routeParams.debug;
    
    $scope.type = "tagging";
    $scope.taskset = {}; 
    $scope.taskset.tasks = []; // Initialize empty, set when it's available

    $log.log($routeParams);
    $scope.activeTest = [false, false, true, true, true, true, false, false, false, false, false];
    //Modal
    $scope.openModal = function (opts) {
      $modal.open({
        animation: true,
        templateUrl: 'templates/modal.html',
        controller: 'ModalInstanceCtrl',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          opts: function () {
          return opts;
          }
        }
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    var postResultsToAmazon = function(results, errors){
        $scope.hiddenErrors = errors;
        // Add an action to the main form.
        // It couldn't be there before because of interference with our submit method.
        // MTurk requires a post from the client, though.
        angular.element("#turkHiddenForm").submit();
        return;
    };

    // Construct JSON callback
    var params = {
      callback: "JSON_CALLBACK",
      user: $scope.preview ? "PREVIEWUSER" : $routeParams.workerId,
      taskset_id:$scope.preview ? "TEST" : $routeParams.assignmentId,
      hit_id: $routeParams.hit_id,
      assignment_id: $routeParams.assignment_id,
      lock: !($scope.preview)
    };

    var endpoint;
    if ($rootScope.debug) {
        endpoint = 'data/debug-image-hit.json';
       } else {
        endpoint = BACKEND_SERVER + "/hit";
       }
    
    // LOAD TASK
    $http.jsonp(endpoint, {params:params})
     .success(function(data){
        if (data.status && data.status===500){
            $rootScope.error = true;
            $scope.openModal({
                show: { ok: false},
                title: "Error",
                message: data.message
              });
            return;
        }

        if (data.taskset.tasks.length === 0) {
          $rootScope.error = "No tasks";
          $scope.openModal({
            show: { ok: false},
            title: "Out of tasks :(",
            message: "Sorry, we ran out of tasks that are available at the moment.<br/>We're really sorry about that, we know it sucks."
          });
        }

        // Set taskset for Crowdy
        $scope.taskset = data.taskset;
        if ($scope.condition === 'fast') {
            // Moves items to a staging object if in
            // Fast condition. They'll be re-added as the
            // user completes more tasks.
            $scope.stagingTasks = data.taskset.tasks;
            $scope.taskset.tasks = [];
        } else {
            console.error("This condition is not supported.");
        }

        $scope.pushStagedTask = function(){
            var task = $scope.stagingTasks.shift();
            $scope.taskset.tasks.push(task);

        };

    }).error(function(err){
        $rootScope.error = true;
        var msg, title;
        if ('message' in err){
            title = "Error";
            msg = err.message;
        } else {
            title = "Unknown error.";
            msg = "Sorry, an unknown error occurred. We don't know what happened";
        }
        $scope.openModal({
            show: {ok:false},
            title: title,
            message: msg
        });
    });

    // SAVE TASK
    $scope.submitForm = function() {
        if ($scope.turkForm.$valid) {
          // Submit form toServer
          $http.post(BACKEND_SERVER+"/save/hit", $scope.taskset)
            .success(function(res){
                postResultsToAmazon(res, null);
            })
            .error(function(err){
                // Still send results to amazon in case of error
                $scope.taskset.err = err;
                postResultsToAmazon($scope.taskset, err);
            });
          // Submit form back to Amazon
        } else {
          // Reload masonry, in case any errors pop up
          $rootScope.$broadcast("masonry.reload");
        }
    };


  }]); //END CONTROLLER
// END ANONYMOUS FUNCTION
})();

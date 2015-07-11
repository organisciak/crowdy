(function(){

angular.module('crowdy')
 .controller("tagTaskController", ['$http', '$sce', '$httpParamSerializerJQLike', '$log', '$modal', '$scope', '$rootScope', '$routeParams', 
         function($http, $sce, $httpParamSerializerJQLike, $log, $modal, $scope, $rootScope, $routeParams) {

    var BACKEND_SERVER = "."; // e.g. http://localhost:3000
    // Set Item template
    $scope.include = "/templates/tagging/"+ $routeParams.condition +"-index.html";
    $scope.forms = {};
    $scope.time = {};
   
    // Params
    $scope.condition = $routeParams.condition;
    if ($scope.condition === 'fast'){
        var phases = ['instructions', 'tasks', 'feedback', 'submit'];
        $scope.phase = phases.shift();
    }

    $scope.pressEnter = function($event){
        if($event.keyCode !== 13) {
            return;
        } else {
            $log.log("Enter pressed. Pushing next task, if valid.");
            $log.log($scope);
            $scope.pushStagedTask();
        }
    };

    $scope.preview = ($routeParams.assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE' );
    $scope.formSubmitTo = $sce.trustAsResourceUrl($routeParams.turkSubmitTo + "/mturk/externalSubmit");
    $scope.assignmentId = $routeParams.assignmentId;

    $rootScope.debug = $routeParams.debug;
    
    $scope.type = "tagging";
    $scope.taskset = {}; 
    $scope.taskset.tasks = []; // Initialize empty, set when it's available

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
        if ($rootScope.debug){
            $log.warn("Not POSTing to Amazon when debugging.");
        }
        $scope.hiddenErrors = errors;
        // Add an action to the main form.
        // It couldn't be there before because of interference with our submit method.
        // MTurk requires a post from the client, though.
        angular.element("#turkHiddenForm").submit();
        return;
    };

    // Go to next phase in fast condition
    $scope.nextPhase = function() {
        if (phases.length === 0) {
            $log.error("Something went wrong: finished all phases and tried to keep going.");
            return;
        }
        $log.log("Switched phase from "+$scope.phase+" to " + phases[0]);
        $scope.phase = phases.shift();
    };

    // Add task to end of tasks. Meant for Fast condition
    $scope.pushStagedTask = function(){
        // Validate condition
        if ($scope.condition !== 'fast') {
            $log.error("pushing staged task is meant for fast condition.");
        }

        // Check form
        if (!$scope.forms.turkForm.$valid){
            // Showing checking without submit window
            $scope.forms.turkForm.check = true;
            return;
        }
        
        // If no more tasks left, then we push to the next phase
        if ($scope.stagingTasks.length === 0){
            $log.warn("No more tasks left!");
            $scope.nextPhase();
        }

        // Turn off error/warning and push next item
        $scope.forms.turkForm.check = false; 
        var task = $scope.stagingTasks.shift();
        $scope.taskset.tasks.push(task);
    };

    var timeLimit = 60;
    $scope.time.timeLeft = timeLimit;
    var timeSince = function(startTime){ return Math.floor((new Date() - startTime)/1000);};
    $scope.startTimer = function() {
        var start = new Date();
        var interval = setInterval(function(){
            $scope.time.timeLeft = timeLimit - timeSince(start); 
            if ($scope.time.timeLeft <= 0){
                clearInterval(interval);
                $scope.nextPhase();
            }
            console.log($scope.time.timeLeft);
          }, 1000);

    };

    // Construct JSON callback
    var params = {
      callback: "JSON_CALLBACK",
      user: $scope.preview ? "PREVIEWUSER" : $routeParams.workerId,
      taskset_id:$scope.preview ? "TEST" : $routeParams.assignmentId,
      hit_id: $routeParams.hit_id,
      assignment_id: $routeParams.assignmentId,
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
            $scope.taskset.tasks = [$scope.stagingTasks.shift()];
        } else if ($scope.condition === 'basic') {
            //do something
        } else {
            console.error("This condition is not supported.");
        }

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
        // Don't submit if fast interface, unless the task phase is done
        if ($scope.condition === 'fast' && ($scope.phase !== 'feedback' && $scope.phase !== 'submit')){
            // Not ready to submit yet.
            return;
        }

        if ($scope.forms.turkForm.$valid) {
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

/* 
A set of functions specific to the 'fast' condition
This is a controller intended to be inheretted through the $controller service wrapper.
*/

angular.module('crowdy')
 .controller("fastSiblingController", ['$scope', '$log', '$routeParams',
  function($scope, $log, $routeParams) {

    $scope.time = {};
  
    var phases = ['instructions', 'tasks', 'feedback'];
    $scope.phase = phases.shift();

    // LOGIC FUNCTIONS
     // Go to next phase in fast condition
    $scope.nextPhase = function() {
        if (phases.length === 0) {
            $log.error("Something went wrong: finished all phases and tried to keep going.");
            return;
        }
        $log.info("Switching phase from "+$scope.phase+" to " + phases[0]);
        $scope.phase = phases.shift();
        if ($scope.phase === 'feedback' && $scope.forms.turkForm.$invalid){
            // If invalid, first try popping the last contribution
            $scope.taskset.tasks.pop();
            $scope.$apply();
            if($scope.forms.turkForm.$invalid) {
                 // Setting form to valid because there's no going back now and workers
                 // should always be paid
                 // TODO: probably safe to use regular js each rather than lodash
                 _.each($scope.forms.itemForms, function(form){
                     form.contrib.$setValidity('required', true);
                     form.contrib.$setValidity('pattern', true);
                 });
            }
        }
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

    var timeSince = function(startTime){ return Math.floor((new Date() - startTime)/1000);};
    $scope.startTimer = function() {
        var start = new Date();
        var interval = setInterval(function(){
            $scope.time.timeLeft = $scope.timeLimit - timeSince(start);
            $scope.$apply(); 
            if ($scope.time.timeLeft <= 0){
                clearInterval(interval);
                $scope.nextPhase();
                $log.debug($scope);
            }
            $log.log($scope.time.timeLeft);
          }, 1000);
    };


    // LOADING AND SAVING FUNCTIONS
    $scope.p.conditionalPostLoadPrep = function(data) {
      // Moves items to a staging object if in
      // Fast condition. They'll be re-added as the
      // user completes more tasks.
      $scope.stagingTasks = data.taskset.tasks;
      $scope.taskset.tasks = [$scope.stagingTasks.shift()];

      if ($routeParams.timer) {
          $log.log("Using Turk-supplied timer");
          $scope.taskset.timer = $routeParams.timer;
      }
      if (!$scope.taskset.timer) {
          $log.log($scope.taskset);
          $log.error("No timer info provided for fast condition.");
          $scope.openModal({
              show: {
                  ok: false
              },
              title: "We made an error!",
              message: "Something broke. It was our fault, sorry!"
          });
          return;
      }
      if ($routeParams.timeEstimate) {
          $log.warn("Ignoring timeEstimate for fast condition, using timer.");
      }
      $scope.timeLimit = $scope.taskset.timer;
      $scope.time.timeLeft = $scope.timeLimit;
    };

  }
 ]);
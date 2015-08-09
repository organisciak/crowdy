/* 
A set of functions specific to the 'fast' condition
This is a controller intended to be inheretted through the $controller service wrapper.
*/

angular.module('crowdy')
 .controller("fastSiblingController", ['$scope', '$log', '$routeParams',
  function($scope, $log, $routeParams) {
  
   $scope.time.limit = null;
   $scope.time.left = null;
   
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
        // When switching to the last (feedback) phase
        if ($scope.phase === 'feedback') {
            // block submission temporarily to prevent accidental submission
            $scope.submitBlocked = true;
            setTimeout(function(){$scope.submitBlocked=false; $scope.$apply();}, 1100);

            // If invalid, first try popping the last contribution
            if ($scope.forms.turkForm.$invalid){
                $scope.taskset.tasks.pop();
                $scope.$apply();
                if($scope.forms.turkForm.$invalid) {
                     // Forcing form to valid because there's no going back now and workers
                     // should always be paid
                     _.each($scope.forms.itemForms, function(form){
                         form.$setValidity('required', true);
                         form.$setValidity('pattern', true);
                         form.contrib.$setValidity('required', true);
                         form.contrib.$setValidity('pattern', true);
                     });
                }
            } else {
                updateBonusCounts();
            }
        }
    };

    // Add task to end of tasks. Meant for Fast condition
    $scope.pushStagedTask = function(){
        // Validate condition
        if ($scope.design !== 'fast') {
            $log.error("pushing staged task is meant for fast design.");
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
            return;
        }

        updateBonusCounts();
        // Turn off error/warning and push next item
        $scope.forms.turkForm.check = false; 
        var task = $scope.stagingTasks.shift();
        $scope.taskset.tasks.push(task);
    };

    var timeSince = function(startTime){ return Math.floor((new Date() - startTime)/1000);};
    $scope.startTimer = function() {
        var start = new Date();
        var interval = setInterval(function(){
            $scope.time.left = $scope.time.limit - timeSince(start);
            // Doublecheck that phase didn't change elsewhere
            if ($scope.phase === 'feedback') {
                clearInterval(interval);
                return;
            } 
            $scope.$apply(); 
            if ($scope.time.left <= 0){
                clearInterval(interval);
                $scope.nextPhase();
                $log.debug($scope);
            }
          }, 1000);
    };

    var updateBonusCounts = function() {
        // Count Bonus for Fast task
        // Sum first N bonuses, where N is the number of successfully completed items.
        var completed = $scope.completedItems();
        if (!completed && !$scope.bonusStructure.items) { return 0; }
        var blist = $scope.bonusStructure.items;
        if (completed < blist.length) {
            $scope.nextItemBonus = blist[completed]; //Zero indexed, but + 1
        } else {
            $scope.nextItemBonus = _.last(blist);
        }
        var total = _.reduce(_.take(blist,completed), _.add);
        // If more tasks completed than there's info for, repeat
        // last value
        if (completed > blist.length) {
            total += (completed - blist.length) * _.last(blist);
        }
        $scope.taskset.bonus = _.round(total, 2);
        if ($scope.bonusStructure.laterTask && 
            $scope.taskset.meta.countUserHIT >= 1) {
              $scope.taskset.bonus += $scope.bonusStructure.laterTask;
        }
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
          data.timer = $routeParams.timer;
      }
    
      if (!data.timer) {
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
      if (data.itemTimeEstimate) {
         $log.warn("Ignoring time.estimate for fast condition, using timer.");
      }
      $scope.time.limit = data.timer;
      $scope.time.left = $scope.time.limit;
      $scope.time.estimate = $scope.time.limit;
    };

  }
 ]);

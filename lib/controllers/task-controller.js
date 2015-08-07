angular.module('crowdy')
 .controller("taskController", ['$rootScope', '$scope', '$routeParams', '$modal', '$log',  
 '$sce', '$controller', '$http',
  function($rootScope, $scope, $routeParams, $modal, $log, $sce, $controller, $http) {
    
    // PARAMS AND INIT
    $rootScope.debug = $routeParams.debug;
    
    // Backend server e.g. http://localhost:3000
    $scope.BACKEND_SERVER = ".";

    // Initialize empty, set when it's available
    $scope.taskset = {};
    $scope.taskset.tasks = [];
    $scope.forms = {};

    $scope.time = {
        estimate: null
    };

    // A place to bind parent functions that aren't needed in the view.
    // think of 'p' as '[P]arent', or 'should really be [P]rivate' :)
    $scope.p = {};

    // Restful Parameters
    $scope.design = $routeParams.design;
    $scope.preview = ($routeParams.assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE');
    $scope.assignmentId = $routeParams.assignmentId;
    
    // Inherit design condition specific controllers functions
    if ($scope.design === 'fast') {
        // Inherit fastSiblingController
        $controller('fastSiblingController', { $scope: $scope });
    } else if ($scope.design === 'basic') {
        $controller('basicSiblingController', { $scope: $scope });
    }

    // Assert that turkSubmitTo needs to be present, or cause Exception
    if(!$rootScope.debug && !$routeParams.turkSubmitTo && !$scope.preview){
        $log.error("No turkSubmitTo, but not in debug or preview!.");
        $scope.openModal({
            message: "Something wrong with Turk URL. Don't continue this task because payment might not go through!"
        });
        return;
    } else if ($rootScope.debug) {
        $scope.formSubmitTo = null;
    } else {
        $scope.formSubmitTo = $sce.trustAsResourceUrl($routeParams.turkSubmitTo + "/mturk/externalSubmit");
    }

    //Bring up modal box.
    // opts affect theappearance and text.
    // opts.message: Body text.
    // opts.show.ok: Whether to show an 'OK' button
    // opts.show.cancel: Whether to show a 'Cancel' button
    // opts.show.close: Whether to show a 'Close' button
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

    // Count completed items
    $scope.completedItems = function(){
        var completed = ($scope.taskset.tasks || []).length -
            ($scope.forms.turkForm.$error.pattern || []).length -
            ($scope.forms.turkForm.$error.required || []).length;
        return completed;
    };

    // Strikethough on condition
    $scope.strikethrough = function(test){
        if (test) {
            return { 'text-decoration':'line-through'};
        }
    };

    // Push a staged task on Enter. This is intended to be called for 1 at a time tasks, like the 
    // fast and teaching conditions
    $scope.pressEnter = function($event){
        if($event.keyCode !== 13) {
            return;
        } else {
            $log.info("Enter pressed. Pushing next task, if valid.");
            // commit any pending view values (in case Enter was pressed before the input debounce time)
            $scope.forms.turkForm.$commitViewValue();
            // Add next task
            $scope.pushStagedTask();
        }
    };

   // Amazon only allows results to be posted from the client,
   // so was have to update a hidden form and programmatically click 'submit'
   var postResultsToAmazon = function(results, errors){
        if ($rootScope.debug){
            $log.warn("Not POSTing to Amazon when debugging.");
            return;
        }
        $scope.hiddenErrors = errors;
        // Add an action to the main form.
        // It couldn't be there before because of interference with our submit method.
        // MTurk requires a post from the client, though.
        angular.element("#turkHiddenForm").submit();
        return;
    };

   // LOAD TASK
   // A placeholder function, to load if a proper one isn't inherited
   if (!$scope.p.conditionalPostLoadPrep){
      $scope.p.conditionalPostLoadPrep = function() {
        $log.error("No conditionalPostLoadPrep defined.");
      };
   }
  
  $scope.p.loadTaskSuccess = function(data) {
      if (data.status && data.status === 500) {
          $rootScope.error = true;
          $scope.openModal({
              show: {
                  ok: false
              },
              title: "Error",
              message: data.message
          });
          return;
      }

      if (data.taskset.tasks.length === 0) {
          $rootScope.error = "No tasks";
          $scope.openModal({
              show: {
                  ok: false
              },
              title: "Out of tasks :(",
              message: "Sorry, we ran out of tasks that are available at the moment.<br/>We're really sorry about that, we know it sucks."
          });
      }

      // Set taskset for Crowdy
      $scope.taskset = data.taskset;

      // Add other info
      $scope.taskset.payment = data.payment.base;
      $scope.bonusStructure = data.payment.bonus;
      $scope.taskset.bonus = 0;
      $scope.nextItemBonus = 0;


      // Run actions specific to the experiment condition, through an inherited function.
      $scope.p.conditionalPostLoadPrep(data);
      // Run actions specific to the task type, if set
      ($scope.p.taskTypePostLoadPrep || function(){})(data);
    };

    $scope.p.loadTaskError = function(err){
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
    };

   // SAVE TASK
    $scope.submitForm = function() {
        // Don't submit if fast interface, unless the task phase is done
        if ($scope.design === 'fast' && $scope.phase !== 'feedback'){
            // Not ready to submit yet.
            return;
        }

        if ($scope.forms.turkForm.$valid) {
          // Submit form toServer
          $http.post($scope.BACKEND_SERVER+"/save/hit", $scope.taskset)
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

 }
 ]);

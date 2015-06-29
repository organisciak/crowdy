(function(){

angular.module('crowdy')
 .controller("tagTaskController", ['$http', '$sce', '$httpParamSerializerJQLike', '$log', '$modal', '$scope', '$rootScope', '$routeParams', 
         function($http, $sce, $httpParamSerializerJQLike, $log, $modal, $scope, $rootScope, $routeParams) {

    var BACKEND_SERVER = "."; // e.g. http://localhost:3000

    $scope.preview = ($routeParams.assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE' );
    $scope.formSubmitTo = $sce.trustAsResourceUrl($routeParams.turkSubmitTo + "/mturk/externalSubmit");
    $scope.assignmentId = $routeParams.assignmentId;

    $rootScope.debug = $routeParams.debug;
    
    $scope.type = "tagging";
    $scope.taskset = {}; 
    $scope.taskset.tasks = []; // Initialize empty, set when it's available


    //Modal
    $scope.openModal = function (opts) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'templates/modal.html',
        controller: 'ModalInstanceCtrl',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          opts: function () {
          return opts
          }
        }
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    $scope.submitForm = function($event) {
        if ($scope.turkForm.$valid) {
          // Submit form toServer
          $http.post(BACKEND_SERVER+"/save/hit", $scope.taskset)
            .success(function(res){
                $log.log(res);
                PostResultsToAmazon(res, null);
            })
            .error(function(err){
                // Still send results to amazon in case of error
                $log.error(err);
                PostResultsToAmazon($scope.taskset, res);
            });
          // Submit form back to Amazon
        } else {
          // Reload masonry, in case any errors pop up
          $rootScope.$broadcast("masonry.reload");
        }

    };

    PostResultsToAmazon = function(results, errors){
        $scope.hiddenErrors = errors;
        // Add an action to the main form.
        // It couldn't be there before because of interference with our submit method.
        // MTurk requires a post from the client, though.
        angular.element("#turkHiddenForm").submit();
        return;
    };

    // Construct JSON callback
    params = {
      callback: "JSON_CALLBACK",
      user: $scope.preview ? "PREVIEWUSER" : $routeParams.workerId,
      taskset_id:$scope.preview ? "TEST" : $routeParams.hitId,
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
        $scope.taskset = data.taskset;
        if ($scope.taskset.tasks.length === 0) {
          $rootScope.error = "No tasks";
          $scope.openModal({
            show: { ok: false},
            title: "Out of tasks :(",
            message: "Sorry, we ran out of tasks that are available at the moment.<br/>We're really sorry about that, we know it sucks."
          });
        }
    }).error(function(err){
        $rootScope.error = true;
        console.log(err);
        var msg, title;
        if (data.message){
            title = "Error";
            msg = data.message;
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

  }])

 .controller("tagTaskItemController", ['$http', '$log', '$scope', '$rootScope', '$routeParams', 
         function($http, $log, $scope, $rootScope, $routeParams) {
        // Individual Item Controller

        $scope.$watch('tags', function(newValue, oldValue){
          // Only refresh masonry is the value actually changed
          // This also keeps from running on page load
          if (newValue !== oldValue) {
            $rootScope.$broadcast("masonry.reload");
          }
        });

         $scope.tooltip = function(item){
           return "<em>Title: </em><strong>"+item.meta.title+"</strong><br/><em>Description: </em>"+item.meta.description
         }
         
        // Individual item timer
        $scope.timeStart = function(item){
          if (!item.timing) {
          item.timing = new Date();
          }
        }

        $scope.timeStop = function(item){
          if (item.timing) {
            timeInFocus = (new Date()-item.timing)/1000;
            item.timeSpent += timeInFocus;
            delete item.timing;
          }
        }

  }])

  .controller("feedbackCtrl", ['$scope', function($scope) {
    $scope.message1 = "";
    
    $scope.getMsg = function(n, cond){
        responses = {
        satisfy: ["I hated it.", "I didn't like it", "It was OK", "It was great", "I loved it"],
        pay: ["Way too low.", "Lower than I'd like", "It was OK", "Better than usual", "Much better than usual"]
        };
        return responses[cond][n-1];
      };

  }]);

// END
})();

(function(){

angular.module('crowdy')
 .controller("tagTaskController", ['$http', '$log', '$modal', '$scope', '$rootScope', '$routeParams', 
         function($http, $log, $modal, $scope, $rootScope, $routeParams) {

    $scope.preview = $routeParams.preview ? true : false;
    //
    // TODO ERROR HANDLING: verify necessary params (hit_id, )
    //
    
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

    $scope.submitForm = function() {
        if ($scope.turkForm.$valid) {
          // Submit form toServer
          $http.post("http://localhost:3000/save/hit", $scope.taskset)
            .success(function(res){$log.log(res)})
            .error(function(err){$log.error(err)});
          // Submit form back to Amazon
        } else {
          // Reload masonry, in case any errors pop up
          $rootScope.$broadcast("masonry.reload");
        }

    };

    // Construct JSON callback
    params = {
      callback: "JSON_CALLBACK",
      user: $scope.preview ? "PREVIEWUSER" : $routeParams.WorkerId,
      taskset_id:$scope.preview ? "TEST" : $routeParams.HITId,
      hit_id: $routeParams.hit_id,
      lock: !$scope.preview
    };

    $http.jsonp("http://localhost:3000/hit", {params:params}).success(function(data){
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
        $scope.error = "Unknown error";
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

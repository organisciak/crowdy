angular.module('crowdy')
    .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'opts', function ($scope, $modalInstance, opts) {
        $scope.opts = {
            show: {
                ok: false,
                cancel:false,
                close:true
            },
            title: "There was an error!",
            message: null
        };
        angular.extend($scope.opts, opts);
        if (opts.performanceFeedback) {
            $scope.performanceFeedback = opts.performanceFeedback;
        }
        if (opts.training) {
            $scope.training = opts.training;
        }

        $scope.ok = function () {
            $modalInstance.dismiss('ok');
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

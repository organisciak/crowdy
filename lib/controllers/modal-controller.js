angular.module('crowdy')
    .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'opts', function ($scope, $modalInstance, opts) {
        $scope.opts = {
            show: {
                ok: false,
                cancel:false,
                close:true
            },
            title: null,
            message: null
        };
        angular.extend($scope.opts, opts);

        $scope.ok = function () {
            $modalInstance.dismiss('ok');
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

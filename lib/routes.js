(function(){

angular.module('crowdy')
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/tag/:design', {
            // This lets me set the template dynamically, 
            // in the controller using $routeProvider.condition
            // This is because for the most part, all the tagging
            // tasks will use the same controller, but we want the 
            // condition variable set for when they differ
            template: '<div ng-include="include"></div>',
            controller:'tagTaskController',
            controllerAs: 'task'
        })
        .when('/grok', {
            templateUrl: 'templates/grokking/index.html',
            controller:'grokTaskController',
            controllerAs: 'task'
        })
        .when('/relevance/:design', {
            template: '<div ng-include="include"></div>',
            controller:'relevanceTaskController',
            controllerAs: 'task'
        })
    .otherwise({
        redirectTo: '/tag/basic'
    });
    
    
    
    }]);

})();

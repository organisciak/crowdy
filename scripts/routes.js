(function(){

angular.module('crowdy')
    .config(function($routeProvider){
        $routeProvider.when('/tag', {
            templateUrl: '/templates/tagging/index.html',
            controller:'tagTaskController',
            controllerAs: 'task'
        })
        .when('/grok', {
            templateUrl: 'templates/grokking/index.html',
            controller:'grokTaskController',
            controllerAs: 'task'
        })
        .when('/relevance', {
            templateUrl: 'templates/relevance/index.html'
        })
    .otherwise({
        redirectTo: '/tag'
    });
    
    
    
    });

})();

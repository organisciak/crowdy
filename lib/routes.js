(function(){

angular.module('crowdy')
    .config(function($routeProvider){
        $routeProvider.when('/tag/basic', {
            templateUrl: '/templates/tagging/basic-index.html',
            controller:'tagTaskController',
            controllerAs: 'task'
        })
        $routeProvider.when('/tag/fast', {
            templateUrl: '/templates/tagging/fast-index.html',
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
        redirectTo: '/tag/basic'
    });
    
    
    
    });

})();

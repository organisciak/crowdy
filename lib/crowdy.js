(function(){

var app = angular.module('crowdy', ['ngRoute', 'ngSanitize', 'crowdy.directives', 
        'wu.masonry', 'ui.bootstrap']);

app.config(['$logProvider', function($logProvider){
        
        $logProvider.debugEnabled(true);

  }]);

})();

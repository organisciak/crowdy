(function(){
    // Make a date object from seconds.
    // Ignore the date and format the time with the date filter, like so
    // {{ seconds | secondsToDateTime | date:'HH:mm:ss'}}
    angular.module('crowdy').filter('secondsToDateTime', function() {
        return function(seconds) {
            var d = new Date(0,0,0,0,0,0,0);
            d.setSeconds(seconds);
            return d;
        };
    });
})();

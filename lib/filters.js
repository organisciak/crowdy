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

    // Format a number with the appropriate suffix: i.e. 1st, 2nd, 3rd
    angular.module('crowdy').filter('intSuffix', function() {
      var suffixes = ["th", "st", "nd", "rd"];
      return function(input) {
        input = parseInt(input);
        var suffix = (input <= 3) ? suffixes[input] : suffixes[0];
        return input+suffix;
      };
    });
})();

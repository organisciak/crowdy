(function(){

var app = angular.module('crowdy.filters', []);

app.filter("formatTags", function() {
    return function (tags) {
        var formatted;
        if (!tags) return;
        formatted = _.map(tags, function(str) {
            return "<button>" + str + "</button>";
        return formatted;
        });
    };

});

})();

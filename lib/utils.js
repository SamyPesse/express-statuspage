var _ = require("lodash");
var Q = require('q');

// Cache promise result and return async cached result
var asyncReturn = function(fn, defaultCached, duration) {
    var cached = defaultCached || {};
    var fnC = _.throttle(fn, duration);

    return function(options) {
        options = _.defaults(options || {}, {
            async: false
        });

        var p = fnC()
        .then(function(body) {
            cached = body;
            return body;
        });

        if (options.async) return Q(cached);

        return p;
    };
};


module.exports = {
    asyncReturn: asyncReturn
};
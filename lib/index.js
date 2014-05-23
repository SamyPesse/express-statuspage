var Q = require('q');
var _ = require("lodash");
var request = require('request');

var utils = require("./utils");

var getStatus = function(page, key) {
    var d = Q.defer();

    request.get({
        'url': "https://api.statuspage.io/v1/pages/"+page+"/incidents.json",
        'headers': {
            'Authorization': "OAuth "+key
        },
        'json': true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            d.resolve(response.body);
        } else {
            d.reject(error || new Error("Error with StatusPage.io api:"+response.statusCode));
        }
    });

    return d.promise;
};

var middleware = function(options) {
    options = _.defaults(options || {}, {
        page: null,
        key: null,
        interval: 10*1000,
        failedOnError: false
    });

    if (!options.key || !options.page) throw "express-statuspage need at least the 'key' and 'page' options";

    var status = utils.asyncReturn(_.partial(getStatus, options.page, options.key), [], options.interval);

    return function(req, res, next) {
        return status()
        .then(function(incidents) {
            var incident = _.find(incidents, function(incident) {
                return incident.resolved_at == null;
            });
            req.statuspage = {
                currentIncident: incident,
                incidents: incidents
            };
        })
        .then(function() {
            next();
        }, function(err) {
            next(options.failedOnError? err: null);
        })
    };
};

// Exports
module.exports = middleware;

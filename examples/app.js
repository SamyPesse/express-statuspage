var express = require('express');

var statuspage = require('../lib');

var app = express();

app.use(statuspage({
    page: process.env.API_STATUSPAGE_PAGEID,
    key: process.env.API_STATUSPAGE_KEY,
    failedOnError: true
}))
app.get('/', function(req, res){
    if (!req.statuspage.currentIncident) {
        res.send('No incident!');
    } else {
        res.send("Current incient: "+req.statuspage.currentIncident.name)
    }
});

app.listen(3000);
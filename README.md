express-statuspage
==================

This node.js module is an **express** middleware that ley you get the last incident from your **statuspage.io** account to signal it directly to your user ony our website.

### Installation:

This module is on **NPM**:

```
$ npm install express-statuspage
```

### Example:

```js
var express = require('express');
var statuspage = require('express-statuspage');

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
```

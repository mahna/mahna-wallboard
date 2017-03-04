var express = require('express');
var config = require('./config.json');
var colors = require('colors');

// starting panel
var panel = express();
panel.use( express.static('./panel') );
panel.listen( config.panelPort);
console.log( 'Panel started on ' + ('http://127.0.0.1:'+config.panelPort).yellow.bold );

// starting proxy
require('./proxy/index.js');
console.log( 'Proxy started on ' + ('http://127.0.0.1:'+config.proxyPort).yellow.bold );
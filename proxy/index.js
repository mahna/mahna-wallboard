var express = require('express');
var cors = require('cors-express');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var async = require('async');
var ping = require('ping');
var config = function(){
	return JSON.parse( fs.readFileSync(__dirname + '/../config/config.json') );
}
var app = express();
// u shoud use asunc now
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(config().proxyPort);

app.get('/', function(req, res) {
    res.json(config().dataServers);
});

app.get('/wallboard.json', function(req, res) {
	var wallboard = JSON.parse( fs.readFileSync(__dirname + '/../config/wallboard.json') );
    res.json( wallboard );
});

app.get('/:serverIds/ping', function(req, res) {
    var serverIds = req.params.serverIds.split(',');
    var pingServers = [];
    if( serverIds.length == 0 || serverIds[0] == 'all' ){
        pingServers = config().pingServers;
    }
    else{
        pingServers.forEach( function(serverId){
            var val = config().pingServers.filter(function(v) {
                return v.id == serverId;
            });
            if( val && val.length > 0 ){
                pingServers.push( val[0] );
            }
            
        });
    }

    var ret = [];
    async.each( pingServers, function(val, cb){
		ping.sys.probe(val.ip, function(alive){
            var ret_ = {
                index: parseInt(val.index),
                id: val.id,
                displayName: val.displayName,
                response: alive,
                error: false
            };
			ret.push( ret_ );
			cb();
		});
		
    }, function(){
        ret = ret.sort( function(a,b){
			return (a.index < b.index)? (-1): (a.index==b.index? 0: 1);
		} );
        res.json(ret);
    });
});

app.get('/:serverIds/:module', function(req, res) {
    var serverIds = req.params.serverIds.split(',');
    var dataServers = [];
    if( serverIds.length == 0 || serverIds[0] == 'all' ){
        dataServers = config().dataServers;
    }
    else{
        serverIds.forEach( function(serverId){
            var val = config().dataServers.filter(function(v) {
                return v.id == serverId;
            });
            if( val && val.length > 0 ){
                dataServers.push( val[0] );
            }
            
        });
    }

    var ret = [];

    async.each( dataServers, function(val, cb){
        
        var data = req.query;
		data.password = val.password;
		data.module = req.params.module;
		
		
		
        request({
            method: 'post',
            url: val.url,
            form: data,
            timeout: 4000
        }, function(error, response, body) {
            
            var ret_ = {
                index: parseInt(val.index),
                id: val.id,
                displayName: val.displayName,
                color: val.color,
                response: {},
                error: false
            };
            if (error) {
                ret_.error = true;
                ret_.response = "server does not answer!";
            }
            else{
                var contentType = response.headers['content-type'];
                if( contentType.indexOf('application/json') !== -1 ){
                    ret_.error = false;
                    ret_.response = JSON.parse(body);
                }
                else{
                    ret_.error = false;
                    ret_.response = body;
                }
            }
            ret.push( ret_ );
            cb();
        });
    }, function(){
        ret = ret.sort( function(a,b){
			return (a.index < b.index)? (-1): (a.index==b.index? 0: 1);
		} );
        res.json(ret);
    });

});
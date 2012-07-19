/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fs = require('fs')
  , filepath = require('path')
  , http = require('http')
  , engineModule = require('./engine');
  

var app = express();
var server = http.createServer(app);
var engine = new engineModule();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/shared'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

server.listen(app.get('port'), function(){
	engine.initialize(filepath.join(__dirname, 'extensions'));
	engine.listen(server);
	
	console.log("FTF Engine listening for connections on port " + app.get('port'));
});



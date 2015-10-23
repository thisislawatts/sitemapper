'use strict';

var http = require('http');
var host = 'localhost';
var port = 61115;


module.exports.createServer = function() {
	var s = http.createServer(function(req, resp) {
		s.emit(req.url, req, resp);
	})

	s.host = host;
	s.port = port;
	s.prototocal = 'http';

	return s;
}
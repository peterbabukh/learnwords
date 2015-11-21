var http = require('http');
var app = require('./app.js');
var config = require('./config');
var log = require('./lib/log')(module);

var port = process.env.PORT || config.get('port');


var server = http.createServer(app);
server.listen(port, function(){
    log.info('Server listening on port ' + port);
});
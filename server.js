var sys = require('util');
var fs = require('fs');
var http = require('https');
var serverConfig = {
	key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
};

server=http.createServer(serverConfig,function(request, response) {}).listen(8086);
var io = require('socket.io').listen(server);
io.set('transports', ["websocket", "polling"])
io.set('log level', 0);

var clients = {};

// Simply keep a list of clients as they join, and rebroadcast submitted data
// from the client to them.
io.sockets.on('connection', function (socket) {
    sys.debug('Connected ' + socket.id);
    clients[socket.id] = socket;

    socket.on('info', function(msg) {
        sys.debug(socket.id + ': ' + msg);
    });

    socket.on('data', function(data) {
        socket.broadcast.emit('update', data);
    });

    socket.on('close', function() {
        sys.debug('Disconnected ' + socket.id);
        delete clients[socket.id];
    });
});

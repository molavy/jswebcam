var http = require('http');
var url = require('url');
var https = require('https');
var fs = require('fs');
var serverConfig = {
	key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
};


    

// A simple web browser displaying files in /public
https.createServer(serverConfig,function(request, response) {
    var file = url.parse(request.url).pathname;
    file = file.substring(1);
    if (file.length == 0) {
        file = 'index.html';
    }
    file = 'public/' + file;

    console.log(request.method + ' ' + file);
    fs.readFile(file, function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        } else {
            response.writeHead(200, {'Content-type': 'text/html'});
            response.end(content, 'utf-8');
        }
    });
}).listen(8085);

var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');

// Serve up public/ftp folder
var serve = serveStatic('public/', {
  'index': ['index.html', 'index.htm'],
  'setHeaders': setHeaders
});

var csp = "default-src 'self';";

function setHeaders(res, path) {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (path.indexOf('.htm') > -1 || path.indexOf('.html') > -1) {
    res.setHeader('Content-Security-Policy', csp);
  }
}

// Create server
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
});

// Listen
console.log('Listening on http://localhost:3000');
server.listen(3000);

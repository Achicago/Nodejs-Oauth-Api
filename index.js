/*
 * Primary file for API
 *
 */

// Dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config = require('./lib/config');
let fs = require('fs');
let handlers = require('./lib/handlers');
let helpers = require('./lib/helpers');


let bytesForHuman = (bytes) =>{
    let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

    let i = 0
    
    for (i; bytes > 1024; i++) {
        bytes /= 1024;
    }

    return bytes.toFixed(1) + ' ' + units[i]
}

 // Configure the server to respond to all requests with a string
//  Instantiate the HTTP server
let httpServer = http.createServer((req,res) => {
    unifiedServer (req, res);
});

// Start the server
httpServer.listen(config.httpPort, () =>{
  console.log(`The server is up and running on port ${config.httpPort} in ${config.envName} mode.`);
});

// Instantiate the HTTPS server
 let httpsServerOptions = {
     'key' : fs.readFileSync('./https/key.pem'),
     'cert' : fs.readFileSync('./https/cert.pem')
 };

let httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () =>{
    console.log(`The server is up and running on port ${config.httpsPort} in ${config.envName} mode.`);
  });

// All the server logic for both the http and https server
let unifiedServer = (req, res) => {
      // Parse the url
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP method
  let method = req.method.toLowerCase();

  //Get the headers as an object
  let headers = req.headers;

  // Get the payload,if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
      buffer += decoder.write(data);
  });
  req.on('end', () => {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      let data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer)
      };

      // Route the request to the handler specified in the router
      chosenHandler(data, (statusCode,payload) => {

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {};

        // Convert the payload to a string
        let payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode, payloadString);

      });

  });

} ;


// Define the request router
let router = {
    'ping' : handlers.ping,
    'users' : handlers.users
//   'sample' : handlers.sample
};
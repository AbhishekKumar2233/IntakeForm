// ******************* !important **************************
// This file is for Local Use Only
// To run this file run cmd: "npm run forAllDevice"
// Don't run "npm run forAllDevice" in server
// *********************************************************

// ***************** To Create SSL *************************
// Create a ssl folder and open git bash and then run below code
// openssl req -nodes -new -x509 -keyout ssl/server.key -out ssl/server.crt -subj "//CN= 192.168.100.185"
// *********************************************************

const { createServer } = require('https');
const fs = require('fs');
const next = require('next');
 
const port = 3000;
const ipAddress = '192.168.100.185';
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();
 
// Read SSL certificate files
const sslOptions = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
};
 
app.prepare().then(() => {
  createServer(sslOptions, (req, res) => {
    handle(req, res);
  }).listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${ipAddress}:${port}`);
  });
});
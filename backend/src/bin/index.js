const config = require('../config/appconfig');
const https = require('https');
const http = require('http');
const app = require('../server');

async function startServer() {
    try {
        http.createServer(app).listen(config.app.port);
        https.createServer({}, app).listen(443);
        console.log(`Listening on port ${config.app.port}`);
    } catch(e) {
        console.error(e);
    }
}

startServer();

require('dotenv').config();
const https = require('https');
const http = require('http');
const express = require('express');
const app = express();
const morgan = require('morgan');
const sequelize = require('./db');
const port = process.env.PORT;

app.disable('x-powered-by');
app.disable('X-Powered-By');

// Apps/Routers
const OptimiseRouter = require('./Router/optimise.router');
const DownloadRouter = require('./Router/download.router');
const ConvertRouter = require('./Router/convert.router');
const SiteCheckerRouter = require('./Router/site-checker.router');

// Middleware
app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// Routes
app.use('/api/image/optimise', OptimiseRouter);
app.use('/api/image/download', DownloadRouter);
app.use('/api/image/convert', ConvertRouter);
app.use('/api/site-check', SiteCheckerRouter);

async function startServer() {
    try {
        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

        http.createServer(app).listen(port);
        https.createServer({}, app).listen(443);
    } catch(e) {
        console.error(e);
    }
}

module.exports = {
    startServer: startServer
};

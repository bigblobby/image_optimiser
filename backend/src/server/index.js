const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('../routes');
const errorResponseHandler = require('../utils/errors/handlers/errorResponseHandler');

app.disable('x-powered-by');
app.disable('X-Powered-By');

// Middleware
app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use(router);

app.use(errorResponseHandler);

module.exports = app;
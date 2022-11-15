const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('../router');

app.disable('x-powered-by');
app.disable('X-Powered-By');

// Middleware
app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use(router);

module.exports = app;
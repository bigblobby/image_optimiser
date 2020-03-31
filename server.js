require('dotenv').config();
const https = require('https');
const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const port = process.env.PORT;
const sequelize = require('./db');

app.disable('x-powered-by');
app.disable('X-Powered-By');

// Apps/Routers
const UploadRouter = require('./Router/upload.router');

// Middleware
app.use(express.static(path.join(__dirname, './client/build')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/image', UploadRouter);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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
        http.createServer(app).listen(port, () => {
            console.log('Server started on port ' + port);
        });
        https.createServer({}, app).listen(443);
    } catch(e) {
        console.error(e);
    }
}

module.exports = {
    startServer: startServer
};

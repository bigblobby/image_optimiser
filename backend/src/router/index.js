const express = require('express');
const router = express.Router();
const apiV1Router = require('./v1/index');

router.use('/api/v1', apiV1Router);

module.exports = router;
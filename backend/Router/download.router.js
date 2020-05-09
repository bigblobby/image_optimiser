const router = require('express').Router();
const controller = require('../Controller/download.controller');

router.get('/zip/:filename', controller.downloadZip);

module.exports = router;

const router = require('express').Router();
const controller = require('../Controller/upload.controller');

router.post('/upload', controller.upload);

module.exports = router;

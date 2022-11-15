const router = require('express').Router();
const controller = require('../../controller/download');

router.get('/zip/:filename', controller.downloadZip);

module.exports = router;

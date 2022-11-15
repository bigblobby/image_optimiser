const router = require('express').Router();
const controller = require('../../controllers/download');

router.get('/zip/:filename', controller.downloadZip);

module.exports = router;

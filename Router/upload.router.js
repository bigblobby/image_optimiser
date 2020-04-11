const router = require('express').Router();
const controller = require('../Controller/upload.controller');
const upload = require('../config/multer').upload;

router.post('/upload/single', controller.uploadSingle);
router.post('/upload/multiple', upload.array('images'), controller.uploadMultiple);
router.get('/download/zip/:filename', controller.downloadZip);

module.exports = router;

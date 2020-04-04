const router = require('express').Router();
const controller = require('../Controller/upload.controller');
const upload = require('../config/multer').upload;

router.post('/upload', upload.array('images'), controller.upload);

module.exports = router;

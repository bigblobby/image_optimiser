const router = require('express').Router();
const controller = require('../../controller/optimise');
const upload = require('../../config/multer.js').upload;

router.post('/upload', upload.array('images'), controller.uploadOptimise);

module.exports = router;

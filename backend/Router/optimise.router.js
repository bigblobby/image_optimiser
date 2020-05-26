const router = require('express').Router();
const controller = require('../Controller/optimise.controller');
const upload = require('../Config/multer').upload;

router.post('/upload', upload.array('images'), controller.uploadOptimise);

module.exports = router;

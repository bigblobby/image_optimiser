const router = require('express').Router();
const controller = require('../Controller/upload.controller');
const upload = require('../Config/multer').upload;

router.post('/optimise', upload.array('images'), controller.uploadOptimise);

module.exports = router;

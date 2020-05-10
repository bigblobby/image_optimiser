const router = require('express').Router();
const controller = require('../Controller/upload.controller');
const upload = require('../Config/multer').upload;

router.post('/single', controller.uploadSingle);
router.post('/multiple', upload.array('images'), controller.uploadMultiple);

module.exports = router;

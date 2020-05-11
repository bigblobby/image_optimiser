const router = require('express').Router();
const controller = require('../Controller/convert.controller');
const upload = require('../Config/multer').upload;

router.post('/single', controller.convertSingle);
router.post('/multiple', upload.array('images'), controller.convertMultiple);

module.exports = router;

const router = require('express').Router();
const controller = require('../../controllers/convert');
const upload = require('../../config/multer').upload;

router.post('/single', controller.convertSingle);
router.post('/multiple', upload.array('images'), controller.convertMultiple);

module.exports = router;

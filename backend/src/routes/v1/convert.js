const router = require('express').Router();
const controller = require('../../controllers/convert');
const catchAsync = require('../../utils/catchAsync');
const upload = require('../../config/multer').upload;

router.post('/single', catchAsync(controller.convertSingle));
router.post('/multiple', upload.array('images'), catchAsync(controller.convertMultiple));

module.exports = router;

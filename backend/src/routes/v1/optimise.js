const router = require('express').Router();
const controller = require('../../controllers/optimise');
const catchAsync = require('../../utils/catchAsync');
const upload = require('../../config/multer.js').upload;

router.post('/upload', upload.array('images'), catchAsync(controller.uploadOptimise));

module.exports = router;

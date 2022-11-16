const router = require('express').Router();
const controller = require('../../controllers/download');
const catchAsync = require('../../utils/catchAsync');

router.get('/zip/:filename', catchAsync(controller.downloadZip));

module.exports = router;

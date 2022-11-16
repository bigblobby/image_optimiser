const router = require('express').Router();
const controller = require('../../controllers/site-checker');
const catchAsync = require('../../utils/catchAsync');

router.post('/', catchAsync(controller.checkSite));

module.exports = router;

const router = require('express').Router();
const controller = require('../../controller/site-checker');

router.post('/', controller.checkSite);

module.exports = router;

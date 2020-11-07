const router = require('express').Router();
const controller = require('../Controller/site-checker.controller');

router.post('/', controller.checkSite);

module.exports = router;

const router = require('express').Router();
const controller = require('../../controllers/site-checker');

router.post('/', controller.checkSite);

module.exports = router;

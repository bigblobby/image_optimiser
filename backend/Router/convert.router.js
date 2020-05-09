const router = require('express').Router();
const controller = require('../Controller/convert.controller');

router.post('/single', controller.convert);

module.exports = router;

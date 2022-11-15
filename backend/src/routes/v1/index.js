const express = require('express');
const router = express.Router();
const OptimiseRouter = require('./optimise');
const DownloadRouter = require('./download');
const ConvertRouter = require('./convert');
const SiteCheckerRouter = require('./site-checker');

// Routes
router.use('/image/optimise', OptimiseRouter);
router.use('/image/download', DownloadRouter);
router.use('/image/convert', ConvertRouter);
router.use('/site-check', SiteCheckerRouter);

module.exports = router;
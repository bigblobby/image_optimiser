const zipUtil = require('../utils/zip');
const optimiseService = require('../services/optimise');

const optimiseController = {
    async uploadOptimise(req, res){
        const {width, height, quality, fit, position, output} = optimiseService.validate(req.body);

        const processedImages = optimiseService.processImages({
            images: req.files,
            height,
            width,
            quality,
            fit,
            position: position,
            output: output
        });

        const zipFile = await zipUtil.zipFiles(processedImages);

        res.status(200).json({
            downloadImage: null,
            downloadFilename: zipFile,
        });
    }
}

module.exports = optimiseController;

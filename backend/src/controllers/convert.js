const mediaUtil = require('../utils/media');
const zipUtil = require('../utils/zip');

const convertController = {
    async convertSingle(req, res){
        const result = await mediaUtil.convertImage(req.body)

        res.status(200).json({
            downloadImage: result,
            downloadFilename: null
        });
    },

    async convertMultiple(req, res){
        const images = req.files;
        const outputFiletype = req.body.outputFiletype;

        const imagePromises = [];
        images.forEach(image => {
            const settings = {
                filename: image.filename,
                fileType: outputFiletype
            };

            imagePromises.push(mediaUtil.processImage(settings, 'file'));
        });

        const filteredImages = await Promise.all(imagePromises);
        const zipFile = await zipUtil.zipFiles(filteredImages);

        res.status(200).json({
            downloadImage: null,
            downloadFilename: zipFile,
        });
    }
}

module.exports = convertController;
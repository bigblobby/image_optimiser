const MediaHelper = require('../Helpers/media.helper');
const ZipHelper = require('../Helpers/zip.helper');

async function uploadOptimise(req, res){
    const images = req.files;
    const {width, height, quality, fitment, position, output} = req.body;

    // TODO validate and sanitise
    const filterWidth = width && !isNaN(width) && width !== 0 ? Number(width) : null;
    const filterHeight = height && !isNaN(height) && height !== 0 ? Number(height) : null;
    const filterQuality = Number(quality);
    const filterFitment = fitment;
    const filterPosition = position;
    const filterOutput = output && output !== 'auto' && (output === 'png' || output === 'jpeg' || output === 'webp') ? output : '';

    const imagePromises = [];
    images.forEach(image => {
        const settings = {
            filename: image.filename,
            mimetype: image.mimetype,
            height: filterHeight,
            width: filterWidth,
            quality: filterQuality,
            fit: filterFitment,
            position: filterPosition,
            output: filterOutput
        };

        imagePromises.push(MediaHelper.processImage(settings));
    });

    const filteredImages = await Promise.all(imagePromises);
    const zipFile = await ZipHelper.zipFiles(filteredImages);

    res.status(200).json({
        downloadImage: null,
        downloadFilename: zipFile,
    });
}

module.exports = {
    uploadOptimise: uploadOptimise
};

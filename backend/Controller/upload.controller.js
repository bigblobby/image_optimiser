const MediaHelper = require('../Helpers/media.helper');
const ZipHelper = require('../Helpers/zip.helper');

async function uploadSingle(req, res){
    const {image, width, height, quality, fitment, position} = req.body;

    // TODO validate and sanitise
    const filterWidth = width && !isNaN(width) && width !== 0 ? Number(width) : null;
    const filterHeight = height && !isNaN(height) && height !== 0 ? Number(height) : null;
    const filterQuality = Number(quality);
    const filterFitment = fitment;
    const filterPosition = position;

    //console.log(filterWidth, filterHeight, filterQuality);

    const settings = {
        image: image,
        height: filterHeight,
        width: filterWidth,
        quality: filterQuality,
        fit: filterFitment,
        position: filterPosition
    };

    const filteredImage = await MediaHelper.processImage(settings, 'buffer');

    res.status(200).json({
        downloadImage: filteredImage,
        downloadFilename: null
    });
}

async function uploadMultiple(req, res){
    const images = req.files;
    const {width, height, quality, fitment, position} = req.body;

    // TODO validate and sanitise
    const filterWidth = width && !isNaN(width) && width !== 0 ? Number(width) : null;
    const filterHeight = height && !isNaN(height) && height !== 0 ? Number(height) : null;
    const filterQuality = Number(quality);
    const filterFitment = fitment;
    const filterPosition = position;

    const imagePromises = [];
    images.forEach(image => {
        const settings = {
            filename: image.filename,
            mimetype: image.mimetype,
            height: filterHeight,
            width: filterWidth,
            quality: filterQuality,
            fit: filterFitment,
            position: filterPosition
        };

        imagePromises.push(MediaHelper.processImage(settings, 'file'));
    });

    const filteredImages = await Promise.all(imagePromises);
    const zipFile = await ZipHelper.zipFiles(filteredImages);

    res.status(200).json({
        downloadImage: null,
        downloadFilename: zipFile,
    });
}

module.exports = {
    uploadSingle: uploadSingle,
    uploadMultiple: uploadMultiple
};

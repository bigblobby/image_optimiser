const MediaHelper = require('../Helpers/media.helper');
const ZipHelper = require('../Helpers/zip.helper');
const fs = require('fs');
const path =require('path');

async function uploadSingle(req, res){
    const {width, height, quality, fitment, position} = req.body;

    // TODO validate and sanitise
    const filterWidth = width && !isNaN(width) && width !== 0 ? Number(width) : null;
    const filterHeight = height && !isNaN(height) && height !== 0 ? Number(height) : null;
    const filterQuality = Number(quality);
    const filterFitment = fitment;
    const filterPosition = position;

    //console.log(filterWidth, filterHeight, filterQuality);

    const settings = {
        filename: req.body,
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
    const imagePromises = [];
    const {width, height, quality, fitment, position} = req.body;

    // TODO validate and sanitise
    const filterWidth = width && !isNaN(width) && width !== 0 ? Number(width) : null;
    const filterHeight = height && !isNaN(height) && height !== 0 ? Number(height) : null;
    const filterQuality = Number(quality);
    const filterFitment = fitment;
    const filterPosition = position;

    // console.log(filterWidth, filterHeight, filterQuality);

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

async function downloadZip(req, res){
    const file = path.join(__dirname, '../uploads/filter', req.params.filename);
    const mimetype = 'application/zip';

    res.setHeader('Content-disposition', 'attachment');
    res.setHeader('Content-type', mimetype);

    fs.createReadStream(file).pipe(res);
}

module.exports = {
    uploadSingle: uploadSingle,
    uploadMultiple: uploadMultiple,
    downloadZip: downloadZip
};

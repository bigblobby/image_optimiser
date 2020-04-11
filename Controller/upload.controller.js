const MediaHelper = require('../Helpers/media.helper');
const ZipHelper = require('../Helpers/zip.helper');
const fs = require('fs');
const path =require('path');

async function uploadSingle(req, res){
    const settings = {
        filename: req.body,
        height: 200,
        width: 200,
        quality: 90
    };

    const filteredImage = await MediaHelper.processImage(settings, 'buffer');

    res.status(200).json({
        image: filteredImage,
        filename: null
    });
}

async function uploadMultiple(req, res){
    const images = req.files;
    const imagePromises = [];

    images.forEach(image => {
        const settings = {
            filename: image.filename,
            mimetype: image.mimetype,
            height: 200,
            width: 200,
            quality: 90
        };

        imagePromises.push(MediaHelper.processImage(settings, 'file'));
    });

    const filteredImages = await Promise.all(imagePromises);
    const zipFile = await ZipHelper.zipFiles(filteredImages);

    res.status(200).json({
        image: null,
        filename: zipFile,
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

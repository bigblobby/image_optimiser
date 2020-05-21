const UploadStats = require('../Model/upload_stats.model');
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

    console.log(image);

    // UploadStats.sync().then(() => {
    //     UploadStats.create({
    //         total_size: req.body.title,
    //         total_images: req.body.priority,
    //         average_size: req.body.completed
    //     }).then(item => {
    //         console.log('Upload stat created successfully')
    //         // res.status(201).json({
    //         //     item: item,
    //         //     message: 'Todo created successfully'
    //         // });
    //     }).catch((err) => {
    //         console.error(err);
    //     });
    // });

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

    // Database stats
    const totalSize = images.reduce((acc, cur) => acc + cur.size, 0);
    const totalImages = images.length;
    const averageSize = totalSize / totalImages;

    UploadStats.sync().then(() => {
        UploadStats.create({
            total_size: totalSize,
            total_images: totalImages,
            average_size: averageSize
        }).then(item => {
            console.log('Upload stat created successfully')
        }).catch((err) => {
            console.error(err);
        });
    });

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

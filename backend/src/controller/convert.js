const mediaUtil = require('../utils/media');
const zipUtil = require('../utils/zip');

function convertSingle(req, res){
    mediaUtil.convertImage(req.body)
        .then(result => {
            res.status(200).json({
                downloadImage: result,
                downloadFilename: null
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: 'There has been an error.'});
        });
}

async function convertMultiple(req, res){
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
    console.log(filteredImages);
    const zipFile = await zipUtil.zipFiles(filteredImages);

    res.status(200).json({
        downloadImage: null,
        downloadFilename: zipFile,
    });
}

module.exports = {
    convertSingle: convertSingle,
    convertMultiple: convertMultiple
}
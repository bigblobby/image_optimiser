const MediaHelper = require('../Helpers/media.helper');
const fs = require('fs');
const JSZip = require('jszip');

async function uploadSingle(req, res){
    const images = req.body;
    const imagePromises = [];

    images.forEach(image => {
        const settings = {
            filename: image,
            height: 200,
            width: 200,
            quality: 90
        };

        imagePromises.push(MediaHelper.processImage(settings, 'buffer'));
    });

    const filteredImages = await Promise.all(imagePromises);

    res.status(200).json({ images: filteredImages });
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

    console.log(filteredImages);

    const zip = new JSZip();

    for(let i = 0; i < filteredImages.length; i++){
        const img = await zipIt(filteredImages[i]);
        const parts = filteredImages[i].split('/');
        const imgName = parts[parts.length - 1];
        zip.file(imgName, img);
    }

    zip
        .generateNodeStream({type:'nodebuffer',streamFiles:true})
        .pipe(fs.createWriteStream('./uploads/filter/images.zip'))
        .on('finish', function () {
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.
            console.log("out.zip written.");
        });

    res.status(200).json({
        images: filteredImages,
    });
}

function zipIt(image){
    return new Promise((resolve, reject) => {
        fs.readFile(image, function(err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

module.exports = {
    uploadSingle: uploadSingle,
    uploadMultiple: uploadMultiple
};

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// async function dataEncode(location, mimetype = 'image/png') {
//     return new Promise((resolve, reject) => {
//         fs.readFile(
//             location,
//             'base64',
//             (err, base64Image) => {
//                 if(err) {
//                     reject(err);
//                 }
//
//                 const dataUrl = `data:${ mimetype };base64, ${ base64Image }`;
//                 resolve(dataUrl);
//             }
//         );
//     });
// }

async function processImage(settings = {
    filename: '',
    mimetype: '',
    width: null,
    height: null,
    quality: 100
}) {
    settings.fileType = settings.fileType || settings.mimetype.split('/')[1];
    const filepath = 'uploads/' + settings.filename;
    return filterWithFile(filepath, settings);
}

function filterWithFile(filepath, settings) {
    const {filename, fileType, height, width, quality, fit, position} = settings;
    const outputLocation = `./uploads/filter/${ filename }`;
    const checkedLocation = path.join(__dirname, `../uploads/filter/${ filename}`);

    return new Promise((resolve, reject) => {
        // Check if file exists already, this stops the image being filtered again
        const qualityOptions = {
            quality: quality
        }
        if(fileType === 'png') {
            qualityOptions.palette = true;
            qualityOptions.compressionLevel = 5;
            qualityOptions.adaptiveFiltering = true;
        }

        fs.stat(checkedLocation, function(err, stat) {
            if(err) {
                sharp(filepath)
                    .resize({
                        height: height,
                        width: width,
                        fit: fit,
                        position: position
                    })
                    [fileType](qualityOptions)
                    .toFile(outputLocation)
                    .then(info => {
                        resolve(outputLocation);
                    })
                    .catch(err => {
                        reject(err);
                    });
            } else {
                resolve(outputLocation);
            }
        });
    });
}

function convertImage(settings){
    const {image, newType} = settings;
    const parts = image.split(';');
    const imageData = parts[1].split(',')[1];
    const newMimeType = `image/${newType}`;
    const imgBuffer = Buffer.from(imageData, 'base64');

    return new Promise((resolve, reject) => {
        sharp(imgBuffer)
            [newType]({ quality: 100 })
            .toBuffer()
            .then(data => {
                const base64image = `data:${newMimeType};base64,${data.toString('base64')}`;
                resolve(base64image);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    })
}

module.exports = {
    processImage: processImage,
    convertImage: convertImage
};

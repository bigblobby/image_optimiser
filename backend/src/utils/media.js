const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const mediaUtil = {
    async processImage(settings = {
        filename: '',
        mimetype: '',
        width: null,
        height: null,
        quality: 100
    }) {
        settings.fileType = settings.fileType || settings.mimetype.split('/')[1];
        const filepath = 'uploads/' + settings.filename;
        return this.filterWithFile(filepath, settings);
    },

    filterWithFile(filepath, settings) {
        const {filename, fileType, height, width, quality, fit, position, output} = settings;
        const filenameWithoutExtension = filename.slice(0, filename.lastIndexOf('.'));
        const outputType = output ? output : fileType;

        const outputLocation = path.join(__dirname, `../../uploads/filter/${ filenameWithoutExtension }.${ outputType }`);
        const checkedLocation = path.join(__dirname, `../../uploads/filter/${ filenameWithoutExtension }.${ outputType }`);

        return new Promise((resolve, reject) => {
            // Check if file exists already, this stops the image being filtered again
            const qualityOptions = {
                quality: quality
            }
            if(outputType === 'png') {
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
                        [outputType](qualityOptions)
                        .toFormat(outputType)
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
    },

    convertImage(settings){
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
}

module.exports = mediaUtil;

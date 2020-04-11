const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function dataEncode(location, mimetype = 'image/png') {
    return new Promise((resolve, reject) => {
        fs.readFile(
            location,
            'base64',
            (err, base64Image) => {
                if(err) {
                    reject(err);
                }

                const dataUrl = `data:${ mimetype };base64, ${ base64Image }`;
                resolve(dataUrl);
            }
        );
    });
}

async function processImage(settings = {
    filename: '',
    mimetype: '',
    width: null,
    height: null,
    quality: 100
}, preset) {

    if(preset === 'buffer'){
        return filterWithBuffer(settings);
    } else if(preset === 'file') {
        settings.fileType = settings.mimetype.split('/')[1];
        const filepath = 'uploads/' + settings.filename;
        return filterWithFile(filepath, settings);
    }
}

function filterWithFile(filepath, settings) {
    const {filename, fileType, height, width, quality} = settings;
    const outputLocation = `./uploads/filter/${ filename }`;
    const checkedLocation = path.join(__dirname, `../uploads/filter/${ filename}`);

    return new Promise((resolve, reject) => {
        // Check if file exists already, this stops the image being filtered again
        fs.stat(checkedLocation, function(err, stat) {
            if(err) {
                //console.error(err);
                sharp(filepath)
                    .resize({
                        height: height,
                        width: width
                    })
                    [fileType]({ quality: quality })
                    .toFile(outputLocation)
                    .then(info => {
                        //console.log(info);
                        resolve(outputLocation);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            } else {
                resolve(outputLocation);
            }
        });
    });
}

function filterWithBuffer(settings){
    const parts = settings.filename.image.split(';');
    const mimeType = parts[0].split(':')[1];
    const imageData = parts[1].split(',')[1];
    const fileType = mimeType.split('/')[1];
    const imgBuffer = Buffer.from(imageData, 'base64');

    return new Promise((resolve, reject) => {
        sharp(imgBuffer)
            .resize({
                height: settings.height,
                width: settings.width
            })
            [fileType]({ quality: settings.quality })
            .toBuffer()
            .then(data => {
                const base64image = `data:${mimeType};base64,${data.toString('base64')}`;
                resolve(base64image);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    })
}

module.exports = {
    processImage: processImage
};

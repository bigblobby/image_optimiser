const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const uuid = require('uuid/v4');

async function zipFiles(images){
    const zip = new JSZip();
    const zipName = uuid();

    for(let i = 0; i < images.length; i++){
        const img = await readFile(images[i]);
        const parts = images[i].split('/');
        const imgName = parts[parts.length - 1];
        zip.file(imgName, img);
    }

    zip
        .generateNodeStream({type:'nodebuffer', streamFiles:true})
        .pipe(fs.createWriteStream(path.join(__dirname, `../../uploads/filter/${zipName}.zip`)))
        .on('finish', function () {
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.
            console.log(`${zipName}.zip written.`);
        });

    return `${zipName}.zip`;
}

function readFile(image){
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
    zipFiles: zipFiles
};

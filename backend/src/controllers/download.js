const fs = require('fs');
const path = require('path');

const downloadController = {
    async downloadZip(req, res){
        const file = path.join(__dirname, '../../uploads/filter', req.params.filename);
        const mimetype = 'application/zip';

        res.setHeader('Content-disposition', 'attachment');
        res.setHeader('Content-type', mimetype);

        fs.createReadStream(file).pipe(res);
    }
}

module.exports = downloadController;

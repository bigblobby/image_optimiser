const MediaHelper = require('../Helpers/media.helper');

function convert(req, res){
    MediaHelper.convertImage(req.body)
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

module.exports = {
    convert: convert
}

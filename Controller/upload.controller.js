function upload(req, res){
    res.status(200).json({
        message: 'It works!'
    });
}

module.exports = {
    upload: upload
};

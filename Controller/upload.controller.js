function upload(req, res){
    console.log(req.files);
    res.status(200).json({
        message: 'It works!'
    });
}

module.exports = {
    upload: upload
};

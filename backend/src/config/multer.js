const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4().toString() + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
        cb(null, true);
    } else {
        cb("File type is not allowed", false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: 1024 * 1024 * 5
});

module.exports = {
    upload: upload
};

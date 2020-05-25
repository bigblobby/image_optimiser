const Sequelize = require('sequelize');
const db = require('../db');

const UploadStats = db.define('upload_stats', {
    total_size: {
        type: Sequelize.STRING,
        allowNull: false
    },
    total_images: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    average_size: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    modelName: 'upload_stats',
    paranoid: true
});

UploadStats.sync();

module.exports = UploadStats;

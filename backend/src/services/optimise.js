const mediaUtil = require('../utils/media');

const optimiseService = {
    validate(data){
        // TODO move this over to Joi
        const width = data.width && !isNaN(data.width) && data.width !== 0 ? Number(data.width) : 500;
        const height = data.height && !isNaN(data.height) && data.height !== 0 ? Number(data.height) : 500;
        const quality = Number(data.quality) || 80;
        const fit = data.fitment || 'cover';
        const position = data.position || 'center';
        const output = data.output && data.output !== 'auto' && (data.output === 'png' || data.output === 'jpeg' || data.output === 'webp') ? data.output : 'jpeg';

        return {
            width,
            height,
            quality,
            fit,
            position,
            output
        }
    },

    async processImages(options){
        const images = [];

        options.images.forEach(image => {
            const settings = {
                filename: image.filename,
                mimetype: image.mimetype,
                height: options.height,
                width: options.width,
                quality: options.quality,
                fit: options.fit,
                position: options.position,
                output: options.output
            };

            images.push(mediaUtil.processImage(settings));
        });

        return await Promise.all(images);
    }
}

module.exports = optimiseService;
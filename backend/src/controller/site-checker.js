const validator = require('validator');
const siteCheckerUtil = require('../utils/siteChecker');

const siteCheckerController = {
    async checkSite(req, res){
        let url = req.body.url;
        if(!validator.isURL(url)){
            return res.status(500).json({error: 'You must provide a url.'});
        }

        const hasHttp = siteCheckerUtil.hasHttp(url);
        if(!hasHttp) url = siteCheckerUtil.addHttp(url)
        const result = await siteCheckerUtil.checkUrl(url);
        res.json(result);
    },
}

module.exports = siteCheckerController;

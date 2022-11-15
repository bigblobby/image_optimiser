const validator = require('validator');
const axios = require('axios');

async function checkSite(req, res){
    const url = req.body.url;
    if(!validator.isURL(url)){
        return res.status(500).json({error: 'You must provide a url.'});
    }

    const result = await checkUrl(url);
    res.json(result);
}

function addHttp(url){
    return `http://${url}`;
}

function checkForHttp(url){
    const re = new RegExp("^(http|https)://", "i");
    const match = re.test(url);

    if(!match) return addHttp(url);
    return url;
}

function checkUrl(url) {
    return new Promise((resolve) => {
        const newUrl = checkForHttp(url);
        axios.get(newUrl)
            .then(response => {
                resolve({message: 'Site is up!', code: 200, url: newUrl});
            }).catch(error => {
                resolve({message: 'Site is down!', code: 500, url: newUrl})
            });
    });
}

module.exports = {
    checkSite: checkSite
}

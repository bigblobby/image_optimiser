const axios = require('axios');

const siteCheckerUtil = {
    addHttp(url){
        return `http://${url}`;
    },

    hasHttp(url){
        const re = new RegExp("^(http|https)://", "i");
        return re.test(url);
    },

    checkUrl(url) {
        return new Promise((resolve) => {
            axios.get(url)
                .then(response => {
                    resolve({message: 'Site is up!', code: response.status, url: response.config.url});
                }).catch(error => {
                    resolve({message: 'Site is down!', code: 500, url: url})
                });
        });
    },
}

module.exports = siteCheckerUtil;
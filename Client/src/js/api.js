import axios from 'axios';

class Api {
    cache = {};

    get(url){
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(response => {
                    resolve(response.data);
                }).catch(err => {
                    console.error(err);
                    reject(err.response.data);
                });
        });
    }

    post(url, params, config = {}){
        return new Promise((resolve, reject) => {
            axios.post(url, params, config)
                .then(response => {
                    resolve(response.data);
                }).catch(err => {
                    console.error(err);
                    reject(err.response.data);
                });
        });
    }

    uploadSingleImage(params = {}, config){
        const url = '/api/image/upload/single';
        return this.post(url, params, config);
    }

    uploadMultipleImages(params = {}, config){
        const url = '/api/image/upload/multiple';
        return this.post(url, params, config);
    }

    downloadZip(url){
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: 'GET',
                responseType: 'blob',
            }).then(response => {
                resolve(window.URL.createObjectURL(new Blob([response.data], {type: "application/zip"})));
            }).catch(err => {
                console.log(err);
                reject(err.response.data);
            })
        });
    }

    convertImage(params = {}){
        const url = '/api/image/convert/single';
        return this.post(url, params);
    }
}

export default new Api();

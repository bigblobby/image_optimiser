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

    uploadImages(params = {}, config){
        const url = '/api/image/upload';
        return this.post(url, params, config);
    }
}

export default new Api();

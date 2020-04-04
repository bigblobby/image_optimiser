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

    post(url, params){
        return new Promise((resolve, reject) => {
            axios.post(url, params)
                .then(response => {
                    resolve(response.data);
                }).catch(err => {
                    console.error(err);
                    reject(err.response.data);
                });
        });
    }

    uploadImages(params = {}){
        const url = '/api/image/upload';
        return this.post(url, params);
    }
}

export default new Api();

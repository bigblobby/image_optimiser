class Helpers {

    fileListBase64(fileList){
        function getBase64(file) {
            const reader = new FileReader();
            return new Promise(resolve => {
                reader.readAsDataURL(file);

                reader.addEventListener('load', (e) => {
                    resolve(e.target.result)
                });
            })
        }

        const promises = [];

        for(let i = 0; i < fileList.length; i++){
            promises.push(getBase64(fileList[i]));
        }

        return Promise.all(promises)
    }

}

export default new Helpers();



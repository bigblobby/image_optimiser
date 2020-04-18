import { nanoid } from 'nanoid'

class Helpers {

    fileListBase64(fileList){
        function getBase64(file) {
            const reader = new FileReader();
            return new Promise(resolve => {
                reader.readAsDataURL(file);

                reader.addEventListener('load', (e) => {
                    const image = new Image();
                    image.src = e.target.result;

                    image.onload = function(){
                        const newFile = {
                            id: nanoid(),
                            displayImage: e.target.result,
                            uploadImage: file,
                            width: this.width,
                            height: this.height
                        };

                        resolve(newFile);
                    }
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



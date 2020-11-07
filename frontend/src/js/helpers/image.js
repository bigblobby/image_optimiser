import { nanoid } from 'nanoid'
import Api from "../api";

class ImageHelper {

    fileListBase64(fileList){
        function getBase64(file) {
            const reader = new FileReader();
            return new Promise(resolve => {
                reader.readAsDataURL(file);

                reader.addEventListener('load', (e) => {
                    // Create an image to retrieve the width and height only, the image is not used.
                    const image = new Image();

                    if (typeof e.target.result === "string") {
                        image.src = e.target.result;
                    }

                    image.addEventListener('load', (loadImageEvent) => {
                        const path = loadImageEvent.composedPath && loadImageEvent.composedPath();
                        const image = path[0];

                        const newFile = {
                            id: nanoid(),
                            displayImage: e.target.result,
                            uploadImage: file,
                            width: image.width,
                            height: image.height
                        };

                        resolve(newFile);
                    });
                });
            })
        }

        const promises = [];

        for(let i = 0; i < fileList.length; i++){
            promises.push(getBase64(fileList[i]));
        }

        return Promise.all(promises)
    }

    retrieveZipFile(filename){
        Api.downloadZip(`/api/image/download/zip/${filename}`)
            .then(result => {
                const link = document.createElement('a');
                link.href = result;
                link.setAttribute('download', 'images.zip');
                document.body.appendChild(link);
                link.click();
            });
    }

    getFilesize(filesize){
        if(filesize < 1000000){
            return ((filesize / 1000).toFixed(2)) + 'KB';
        } else {
            return ((filesize / 1000000).toFixed(2)) + 'MB';
        }
    };
}

export default new ImageHelper();



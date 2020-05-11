import { nanoid } from 'nanoid'

class ImageHelper {

    fileListBase64(fileList){
        function getBase64(file) {
            const reader = new FileReader();
            return new Promise(resolve => {
                reader.readAsDataURL(file);

                reader.addEventListener('load', (e) => {
                    // Create an image to retrieve the width and height only, the image is not used.
                    const image = new Image();
                    image.src = e.target.result;

                    image.addEventListener('load', (loadImageEvent) => {
                        // Fixes a bug in firefox
                        const path = loadImageEvent.path || (loadImageEvent.composedPath && loadImageEvent.composedPath());

                        const newFile = {
                            id: nanoid(),
                            displayImage: e.target.result,
                            uploadImage: file,
                            width: path[0].width,
                            height: path[0].height
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
}

export default new ImageHelper();



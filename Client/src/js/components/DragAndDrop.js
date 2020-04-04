import React from 'react';
import Helpers from '../helpers';
import Api from '../api';

class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayFiles: [],
            uploadFiles: []
        }
    }

    handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('enter');
    };

    handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('leave');
    };

    handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('over');
    };

    handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('drop');

        // Files to upload to the server
        const uploadImages = [...e.dataTransfer.files];

        // Files to show a preview of images to the user
        const images = await Helpers.fileListBase64(e.dataTransfer.files);

        this.setState(prevState => {
            return {
                displayFiles: [...prevState.displayFiles, ...images],
                uploadFiles: [...prevState.uploadFiles, ...uploadImages]
            }
        }, this.uploadFiles);
    };

    uploadFiles = () => {
        const formData = new FormData();
        for(let file of this.state.uploadFiles){
            formData.append('images', file);
        }

        Api.uploadImages(formData)
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <div
                className="drag-and-drop"
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
            >
                <div className="drag-and-drop--inner">
                    {
                        this.state.displayFiles.length > 0 &&  this.state.displayFiles.map(file => {
                            return <img src={file} alt=""/>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default DragAndDrop;

import React from 'react';
import Helpers from '../helpers';
import Api from '../api';

class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayFiles: [],
            uploadFiles: [],
            dragging: false,
            uploading: false,
            percentCompleted: null,
            uploadComplete: false,
            error: null
        }
    }

    handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(!this.state.dragging){
            this.setState({dragging: true})
        }
    };

    handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(this.state.dragging){
            this.setState({dragging: false})
        }
    };

    handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        this.handleFiles(files);
    };

    handleManualUpload = async (e) => {
        const files = e.target.files;
        this.handleFiles(files);
    };

    handleFiles = async(files) => {
        const uploadImages = [...files];

        // Files to show a preview of images to the user
        const images = await Helpers.fileListBase64(files);

        this.setState(prevState => {
            return {
                displayFiles: [...prevState.displayFiles, ...images],
                uploadFiles: [...prevState.uploadFiles, ...uploadImages],
                dragging: false,
                error: null
            }
        });
    };

    handleSubmit = () => {
        this.clearProgress();
    };

    clearProgress = () => {
        this.setState({
            percentCompleted: null,
            uploadComplete: false,
        }, this.uploadFiles);
    };

    uploadFiles = () => {
        const self = this;

        if(!this.state.displayFiles.length){
            this.setState({
                error: 'Please select files to upload'
            });
            return;
        }

        const formData = new FormData();
        for(let file of this.state.uploadFiles){
            formData.append('images', file);
        }

        const config = {
            onUploadProgress: function(progressEvent) {
                const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                self.setState({
                    percentCompleted: percentCompleted,
                    uploading: true,
                })
            }
        };

        Api.uploadImages(formData, config)
            .then(result => {
                console.log(result);
                this.setState({
                    uploading: false,
                    uploadComplete: true
                })
            }).catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <div className="drag-and-drop">
                <input className="d-none" id="image-upload" type="file" multiple onChange={this.handleManualUpload}/>
                <label
                    className="drag-and-drop--box"
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}
                    htmlFor="image-upload"
                >
                    {
                        this.state.displayFiles.length === 0 && (
                            <div className={"drag-and-drop--info"}>
                                <h3>Drag and drop your files or click here</h3>
                            </div>
                        )
                    }

                    <div className={"drag-and-drop--overlay " + (this.state.dragging ? 'active' : '')}></div>
                    <div className="drag-and-drop--inner">
                        {
                            this.state.displayFiles.length > 0 &&  this.state.displayFiles.map(file => {
                                return (
                                    <div className="image-container">
                                        <div className="image" style={{backgroundImage: `url(${file})`}}></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </label>
                {
                    this.state.percentCompleted ? (
                        <div className="progress-bar--container">
                            <div className="progress-bar">
                                <div className="track"></div>
                                <div className="progress" style={{width: this.state.percentCompleted + '%'}}></div>
                            </div>
                            <div className="percentage">
                                {
                                    !this.state.uploadComplete ? this.state.percentCompleted + "%" : 'Done'
                                }
                            </div>
                        </div>
                    ) : null
                }
                {
                    this.state.error && <div className="invalid-feedback d-block mb-2">{this.state.error}</div>
                }
                <div className={"drag-and-drop--upload-button " + (this.state.uploading ? 'disabled' : '')}>
                    <button className={"btn btn-primary " + (this.state.uploading ? 'disabled' : '')} onClick={this.handleSubmit}>Upload</button>
                </div>
            </div>
        );
    }
}

export default DragAndDrop;

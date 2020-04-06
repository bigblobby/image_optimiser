import React from 'react';
import Helpers from '../helpers';
import Api from '../api';

const FILE_LIMIT = 12;

class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayFiles: [],
            uploadFiles: [],
            downloadFiles: [],
            dragging: false,
            uploading: false,
            percentCompleted: null,
            uploadComplete: false,
            error: null
        };

        this.fileUploadRef = React.createRef();
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

    handleDragOver = (e) => {
        // This is needed - do not remove
        e.preventDefault();
        e.stopPropagation();
    };

    handleManualUpload = async (e) => {
        const files = e.target.files;
        this.handleFiles(files);
    };

    handleFiles = async(files) => {
        if(this.state.displayFiles.length + files.length > FILE_LIMIT){
            this.setState({
                error: 'You can only upload 12 images at a time'
            });

            return;
        }

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

    removeImage = (e, id) => {
        e.stopPropagation();
        const files = [...this.state.displayFiles].filter(file => file.id !== id);

        this.setState({ displayFiles: files });
    };

    clearProgress = () => {
        this.setState({
            percentCompleted: null,
            uploadComplete: false,
            error: null,
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

        Api.uploadMultipleImages(formData, config)
            .then(result => {
                console.log(result);
                this.setState({
                    uploading: false,
                    uploadComplete: true,
                    downloadFiles: result.images
                })
            }).catch(err => {
                console.log(err);
            });
    };

    openFolder = () => {
        // This has to be done this way so that remove images can work. Otherwise just us a label htmlFor.
        this.fileUploadRef.current.click();
    };

    render() {
        return (
            <div className="drag-and-drop">
                <input ref={this.fileUploadRef} className="d-none" type="file" multiple onChange={this.handleManualUpload}/>
                <div
                    className="drag-and-drop--box"
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}
                    onDragOver={this.handleDragOver}
                    onClick={this.openFolder}
                >
                    {
                        this.state.displayFiles.length === 0 && (
                            <div className={"drag-and-drop--info"}>
                                <span className="icon-upload"></span>
                                <h3>Drag and drop your files or click here</h3>
                                <h4>(up to 12 images)</h4>
                            </div>
                        )
                    }

                    <div className={"drag-and-drop--overlay " + (this.state.dragging ? 'active' : '')}></div>
                    <div className="drag-and-drop--inner">
                        {
                            this.state.displayFiles.length > 0 &&  this.state.displayFiles.map(file => {
                                return (
                                    <div className="image-container" onClick={(e) => this.removeImage(e, file.id)}>
                                        <div className="overlay">
                                            <p>Remove</p>
                                        </div>
                                        <div
                                            className="image"
                                            style={{backgroundImage: `url(${file.image})`}}
                                        ></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
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
                <div className={"drag-and-drop--upload-button " + (this.state.uploading ? 'disabled' : '')}>
                    <button className={"btn btn-primary " + (this.state.uploading ? 'disabled' : '')} onClick={this.handleSubmit}>Upload</button>
                    {
                        this.state.error && <span className="invalid-feedback d-block ml-2">{this.state.error}</span>
                    }
                </div>

                {
                    this.state.downloadFiles.length === 1 && (
                        <div className="mt-3">
                            <a className="btn btn-primary" href={this.state.downloadFiles[0]} download>Download</a>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default DragAndDrop;

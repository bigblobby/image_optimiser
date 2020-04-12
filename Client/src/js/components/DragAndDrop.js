import React from 'react';
import Helpers from '../helpers';
import Api from '../api';
import { nanoid } from 'nanoid'
import { connect } from "react-redux";
import { removeImage, updateDisplayAndUploadFiles } from "../actions/imageOptimiserActions";

const FILE_LIMIT = 12;

class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            downloadFile: {
                image: null,
                filename: null
            },
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
        if(this.props.images.length + files.length > FILE_LIMIT){
            this.setState({
                error: 'You can only upload 12 images at a time'
            });

            return;
        }

        const images = await Helpers.fileListBase64(files);

        this.props.updateDisplayAndUploadFiles(images);

        this.setState(prevState => {
            return {
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
        this.props.removeImage(id);
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

        if(!this.props.images.length){
            this.setState({
                error: 'Please select files to upload'
            });
            return;
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

        if(this.props.images.length > 1){
            const formData = new FormData();
            for(let file of this.props.images){
                formData.append('images', file.uploadImage);
            }

            Api.uploadMultipleImages(formData, config)
                .then(result => {
                    this.setState({
                        uploading: false,
                        uploadComplete: true,
                        downloadFile: result
                    })
                }).catch(err => {
                console.log(err);
            });
        } else {
            Api.uploadSingleImage({image: this.props.images[0].displayImage}, config)
                .then(result => {
                    this.setState({
                        uploading: false,
                        uploadComplete: true,
                        downloadFile: result
                    });
                })
        }
    };

    downloadZip = () => {
        const filename = this.state.downloadFile.filename;

        Api.downloadZip(`/api/image/download/zip/${filename}`)
            .then(result => {
                const link = document.createElement('a');
                link.href = result;
                link.setAttribute('download', 'images.zip');
                document.body.appendChild(link);
                link.click();
            });
    };

    openFolder = () => {
        // This has to be done this way so that remove images can work. Otherwise just us a label htmlFor.
        this.fileUploadRef.current.click();
    };

    render() {
        return (
            <div className="drag-and-drop">
                <input
                    className="d-none"
                    ref={this.fileUploadRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={this.handleManualUpload}
                />
                <div
                    className="drag-and-drop--box"
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}
                    onDragOver={this.handleDragOver}
                    onClick={this.openFolder}
                >
                    {
                        this.props.images.length === 0 && (
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
                            this.props.images.length > 0 &&  this.props.images.map(file => {
                                return (
                                    <div className="image-container" onClick={(e) => this.removeImage(e, file.id)}>
                                        <div className="overlay">
                                            <p>Remove</p>
                                        </div>
                                        <div
                                            className="image"
                                            style={{backgroundImage: `url(${file.displayImage})`}}
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
                    this.state.downloadFile.image && (
                        <div className="mt-3">
                            <a className="btn btn-primary" href={this.state.downloadFile.image} download>Download</a>
                        </div>
                    )
                }
                {
                    this.state.downloadFile.filename && (
                        <div className="mt-3">
                            <a className="btn btn-primary" onClick={this.downloadZip}>Download</a>
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = ({imageOptimiser}) => {
    const {images} = imageOptimiser;
    return {
        images
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateDisplayAndUploadFiles: (displayFiles, uploadFiles) => dispatch(updateDisplayAndUploadFiles(displayFiles, uploadFiles)),
        removeImage: (id) => dispatch(removeImage(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DragAndDrop);

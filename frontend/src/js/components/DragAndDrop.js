import React from 'react';
import { connect } from "react-redux";
import {
    removeImage,
    updateDisplayAndUploadFiles,
    triggerUploadComplete,
    updateProgress,
    updateErrorMessage
} from "../actions/imageOptimiserActions";

class DragAndDrop extends React.Component {
    static defaultProps = {
        fileLimit: 12,
        filesizeLimit: null,
        handleFiles: () => {},
        onDropCallback: () => {},
        text: "",
        helpText: "",
        acceptedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml']
    };

    constructor(props) {
        super(props);

        this.state = {
            dragging: false,
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

        const files = Array.from(e.dataTransfer.files);
        const allowedFiles = files.filter(file => this.props.acceptedFileTypes.includes(file.type));

        if(files.length !== allowedFiles.length && allowedFiles.length === 0){
            this.props.updateErrorMessage('Sorry! These files can\'t be accepted as they\'re the wrong type.');
        } else if(files.length !== allowedFiles.length) {
            this.props.updateErrorMessage('Sorry! Some of your files can\'t be accepted as they\'re the wrong type.');
        } else {
            this.props.updateErrorMessage(null);

            if(this.props.onDropCallback){
                this.props.onDropCallback();
            }
        }

        this.setState({dragging: false})
        this.handleFiles(allowedFiles);
    };

    handleDragOver = (e) => {
        // This is needed - do not remove
        e.preventDefault();
        e.stopPropagation();
    };

    handleManualUpload = async (e) => {
        const files = e.target.files;

        // If there is an error message present and the file choosen is allowed, remove error.
        if(this.props.error){
            this.props.updateErrorMessage(null);
        }

        this.handleFiles(Array.from(files));

        e.currentTarget.value = '';
    };

    handleFiles = async(files) => {
        const self = this;
        let acceptedFiles = files;

        if(this.props.filesizeLimit){
            acceptedFiles = files.filter(file => {
                return file.size <= self.props.filesizeLimit;
            });

            if(acceptedFiles.length < files.length && files.length === 1){
                this.props.updateErrorMessage(`Your file is to large. Max: ${this.getFilesize(this.props.filesizeLimit)}.`);
            } else if (acceptedFiles.length < files.length){
                this.props.updateErrorMessage(`Some of your files were to large. Max: ${this.getFilesize(this.props.filesizeLimit)}.`);
            }
        }

        if(this.props.images.length + acceptedFiles.length > this.props.fileLimit){
            this.props.updateErrorMessage(`You can only upload ${this.props.fileLimit} image(s) at a time.`);
            return;
        }

        this.props.handleFiles(acceptedFiles);
    };

    removeImage = (e, id) => {
        e.stopPropagation();
        this.props.removeImage(id);
    };

    openFolder = () => {
        // This has to be done this way so that remove images can work. Otherwise just us a label htmlFor.
        if(this.props.percentCompleted) return null;
        this.fileUploadRef.current.click();
    };

    getImageStyles = () => {
        if(this.props.fileLimit === 1){
            return {
                flexBasis: '100%',
                height: '100%'
            }
        } else {
            return {
                flexBasis: '33.33333%',
                height: '25%'
            }
        }
    };

    getFilesize = (filesize) => {
        if(filesize < 1000000){
            return ((filesize / 1000).toFixed(2)) + ' KB';
        } else {
            return ((filesize / 1000000).toFixed(2)) + ' MB';
        }
    };

    render() {
        return (
            <div className="drag-and-drop">
                <input
                    className="d-none"
                    ref={this.fileUploadRef}
                    type="file"
                    accept={this.props.acceptedFileTypes.join(', ')}
                    multiple
                    onChange={this.handleManualUpload}
                />
                <div
                    className={"drag-and-drop--box " + (this.props.percentCompleted ? 'disable' : '')}
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
                                <h3>{this.props.text}</h3>
                                <h4>{this.props.helpText}</h4>
                            </div>
                        )
                    }

                    <div className={"drag-and-drop--overlay " + (this.state.dragging ? 'active' : ' ') + (this.props.percentCompleted ? 'disable' : '')}></div>
                    <div className="drag-and-drop--inner">
                        {
                            this.props.images.length > 0 &&  this.props.images.map(file => {
                                return (
                                    <div key={file.id} className="image-container" style={this.getImageStyles()} onClick={(e) => this.removeImage(e, file.id)}>
                                        <div className="overlay">
                                            <p>Remove</p>
                                        </div>
                                        <div
                                            className="image"
                                            style={{backgroundImage: `url(${file.displayImage})`}}
                                        >
                                            <div className="image-filesize">{this.getFilesize(file.uploadImage.size)}</div>
                                            <div className="image-dimensions">{file.width} x {file.height}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({imageOptimiser}) => {
    const {images, uploading, uploadComplete, downloadFilename, downloadImage, percentCompleted, error} = imageOptimiser;
    return {
        images,
        uploading,
        uploadComplete,
        downloadFilename,
        downloadImage,
        percentCompleted,
        error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateDisplayAndUploadFiles: (displayFiles, uploadFiles) => dispatch(updateDisplayAndUploadFiles(displayFiles, uploadFiles)),
        removeImage: (id) => dispatch(removeImage(id)),
        triggerUploadComplete: (data) => dispatch(triggerUploadComplete(data)),
        updateProgress: (percent) => dispatch(updateProgress(percent)),
        updateErrorMessage: (message) => dispatch(updateErrorMessage(message)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DragAndDrop);

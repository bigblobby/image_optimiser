import React from 'react';
import Helpers from '../helpers';
import { connect } from "react-redux";
import {
    removeImage,
    updateDisplayAndUploadFiles,
    triggerUploadComplete,
    updateProgress,
    updateErrorMessage
} from "../actions/imageOptimiserActions";

const FILE_LIMIT = 12;

class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dragging: false
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
            this.props.updateErrorMessage('You can only upload 12 images at a time');
            return;
        }

        const images = await Helpers.fileListBase64(files);

        this.props.updateDisplayAndUploadFiles(images);

        this.setState({
            dragging: false,
        });
    };

    removeImage = (e, id) => {
        e.stopPropagation();
        this.props.removeImage(id);
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
                    this.props.percentCompleted ? (
                        <div className="progress-bar--container">
                            <div className="progress-bar">
                                <div className="track"></div>
                                <div className="progress" style={{width: this.props.percentCompleted + '%'}}></div>
                            </div>
                            <div className="percentage">
                                {
                                    !this.props.uploadComplete ? this.props.percentCompleted + "%" : 'DONE'
                                }
                            </div>
                        </div>
                    ) : null
                }
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

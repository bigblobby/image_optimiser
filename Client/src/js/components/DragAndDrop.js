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

class DragAndDrop extends React.Component {
    static defaultProps = {
        fileLimit: 12,
        handleFiles: () => {},
        text: "",
        helpText: ""
    };

    constructor(props) {
        super(props);

        this.state = {
            dragging: false,
            showTickIcon: false,
        };

        this.fileUploadRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.uploadComplete !== this.props.uploadComplete){
            this.addSvgActiveClass();
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
        if(this.props.images.length + files.length > this.props.fileLimit){
            this.props.updateErrorMessage(`You can only upload ${this.props.fileLimit} image(s) at a time`);
            return;
        }

        this.props.handleFiles(files);

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

    addSvgActiveClass = () => {
        setTimeout(() => {
            this.setState({ showTickIcon: true });
        }, 0);
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
                                <h3>{this.props.text}</h3>
                                <h4>{this.props.helpText}</h4>
                            </div>
                        )
                    }

                    <div className={"drag-and-drop--overlay " + (this.state.dragging ? 'active' : '')}></div>
                    <div className="drag-and-drop--inner">
                        {
                            this.props.images.length > 0 &&  this.props.images.map(file => {
                                return (
                                    <div className="image-container" style={this.getImageStyles()} onClick={(e) => this.removeImage(e, file.id)}>
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
                                    !this.props.uploadComplete ? this.props.percentCompleted + "%" : (
                                        <div className="tick-icon--container">
                                            <svg className={this.state.showTickIcon ? "draw" : ""} version="1.1" id="tick-icon" xmlns="http://www.w3.org/2000/svg"
                                                 xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                 viewBox="0 0 37 37" style={{enableBackground: 'new 0 0 37 37'}}
                                                 xmlSpace="preserve">
                                                <path className="circ path" style={{fill: 'none', stroke: '#2EBF4F', strokeWidth: 3, strokeLinejoin: 'round', strokeMiterlimit: 10}}
                                                      d="
                                            M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
                                                />
                                                <polyline className="tick path"
                                                          style={{fill: 'none', stroke: '#2EBF4F', strokeWidth: 3, strokeMiterlimit: 15}}
                                                          points="
                                        11.6,20 15.9,24.2 26.4,13.8 "/>
                                            </svg>
                                        </div>
                                    )
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

import React from 'react';
import { connect } from 'react-redux';
import Api from '../api';
import {
    resetOptimiser,
    triggerUploadComplete,
    updateErrorMessage,
    updateProgress
} from "../actions/imageOptimiserActions";

class ConvertOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            outputFiletype: 'png',
            showTickIcon: false
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.uploadComplete !== this.props.uploadComplete){
            this.addSvgActiveClass();
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    uploadFiles = () => {
        const self = this;

        if(!this.props.images.length){
            this.props.updateErrorMessage('Please select a file to upload.');
            return;
        }

        const config = {
            onUploadProgress: function(progressEvent) {
                const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                self.props.updateProgress(percentCompleted)
            }
        };

        // if(this.props.images.length > 1){
        //     const formData = new FormData();
        //     for(let file of this.props.images){
        //         formData.append('images', file.uploadImage);
        //     }
        //
        //     formData.append('outputFiletype', this.state.outputFiletype);
        //
        //     Api.convertMultipleImages(formData, config)
        //         .then(result => {
        //             this.props.triggerUploadComplete(result);
        //         });
        // } else {
            Api.convertImage({
                image: this.props.images[0].displayImage,
                newType: this.state.outputFiletype
            }, config).then(result => {
                this.props.triggerUploadComplete(result);
            });
        //}
    };

    addSvgActiveClass = () => {
        setTimeout(() => {
            this.setState({ showTickIcon: true });
        }, 0);
    };

    render(){
        return (
            <div className="convert-options--container">
                {
                    this.props.percentCompleted ? (
                        <div className="upload-overlay overlay">
                            <div className="progress-bar--container mb-3">
                                <div className="progress-bar">
                                    <div className="track"></div>
                                    <div className="progress"
                                         style={ { width: this.props.percentCompleted + '%' } }></div>
                                </div>
                                <div className="percentage">
                                    {
                                        !this.props.uploadComplete ? this.props.percentCompleted + "%" : (
                                            <div className="tick-icon--container">
                                                <svg className={ this.state.showTickIcon ? "draw" : "" } version="1.1"
                                                     id="tick-icon" xmlns="http://www.w3.org/2000/svg"
                                                     xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                     viewBox="0 0 37 37" style={ { enableBackground: 'new 0 0 37 37' } }
                                                     xmlSpace="preserve">
                                                    <path className="circ path" style={ {
                                                        fill: 'none',
                                                        stroke: '#2EBF4F',
                                                        strokeWidth: 3,
                                                        strokeLinejoin: 'round',
                                                        strokeMiterlimit: 10
                                                    } }
                                                          d="
                                            M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
                                                    />
                                                    <polyline className="tick path"
                                                              style={ {
                                                                  fill: 'none',
                                                                  stroke: '#2EBF4F',
                                                                  strokeWidth: 3,
                                                                  strokeMiterlimit: 15
                                                              } }
                                                              points="
                                        11.6,20 15.9,24.2 26.4,13.8 "/>
                                                </svg>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div>
                                {
                                    this.props.downloadImage && (
                                        <div className="button-container d-flex align-items-center">
                                            <a className="btn btn--red" href={this.props.downloadImage} download>Download</a>
                                            <a className="reset ml-3" onClick={this.props.resetOptimiser}>Upload more images?</a>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ) : null
                }
                <div>
                    <div className="form-group">
                        <label htmlFor="options_filetype">Convert your file to</label>
                        <select className="form-control" value={this.state.outputFiletype} name="outputFiletype" id="options_filetype" onChange={this.handleChange}>
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="webp">WEBP</option>
                        </select>
                    </div>
                </div>
                <div className={"button-container upload-button-container "}>
                    <button className={"btn btn--green "} onClick={this.uploadFiles}>Convert</button>
                    {
                        this.props.error && <span className="invalid-feedback d-block ml-2">{this.props.error}</span>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({imageOptimiser}) => {
    const {images, uploading, uploadComplete, downloadFilename, downloadImage, percentCompleted, error} = imageOptimiser;
    return {
        images,
        uploading,
        downloadFilename,
        downloadImage,
        error,
        uploadComplete,
        percentCompleted
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        triggerUploadComplete: (data) => dispatch(triggerUploadComplete(data)),
        updateProgress: (percent) => dispatch(updateProgress(percent)),
        updateErrorMessage: (message) => dispatch(updateErrorMessage(message)),
        resetOptimiser: () => dispatch(resetOptimiser())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ConvertOptions);

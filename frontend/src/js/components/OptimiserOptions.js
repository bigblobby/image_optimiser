import React from 'react';
import { connect } from 'react-redux';
import {
    resetOptimiser,
    triggerUploadComplete,
    updateErrorMessage,
    updateProgress
} from "../actions/imageOptimiserActions";
import ImageHelper from "../helpers/image";
import ValidationHelper from "../helpers/validation";
import Api from "../api";

class OptimiserOptions extends React.Component {
    constructor() {
        super();

        this.state = {
            width: '',
            height: '',
            quality: 100,
            fitment: 'cover',
            position: 'center',
            showTickIcon: false,
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
    };

    uploadFiles = () => {
        const self = this;

        if(!this.props.images.length){
            this.props.updateErrorMessage('Please select files to upload.');
            return;
        }

        const config = {
            onUploadProgress: function(progressEvent) {
                const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                self.props.updateProgress(percentCompleted)
            }
        };

        const width = ValidationHelper.validateWidthHeight(this.state.width);
        const height = ValidationHelper.validateWidthHeight(this.state.height);
        const quality = ValidationHelper.validateQuality(this.state.quality);

        if(this.props.images.length > 1){
            const formData = new FormData();
            for(let file of this.props.images){
                formData.append('images', file.uploadImage);
            }

            formData.append('width', width);
            formData.append('height', height);
            formData.append('quality', quality);
            formData.append('fitment', this.state.fitment);
            formData.append('position', this.state.position);

            Api.uploadMultipleImages(formData, config)
                .then(result => {
                    this.props.triggerUploadComplete(result);
                }).catch(err => {
                    console.log(err);
                });
        } else {
            Api.uploadSingleImage({
                image: this.props.images[0].displayImage,
                width: width,
                height: height,
                quality: quality,
                fitment: this.state.fitment,
                position: this.state.position
            }, config)
                .then(result => {
                    this.props.triggerUploadComplete(result);
                }).catch(err => {
                console.log(err);
            });
        }
    };

    downloadZip = () => {
        const filename = this.props.downloadFilename;

        Api.downloadZip(`/api/image/download/zip/${filename}`)
            .then(result => {
                const link = document.createElement('a');
                link.href = result;
                link.setAttribute('download', 'images.zip');
                document.body.appendChild(link);
                link.click();
            });
    };

    addSvgActiveClass = () => {
        setTimeout(() => {
            this.setState({ showTickIcon: true });
        }, 0);
    };

    render(){
        return (
            <div className="optimiser-options--container">
                {
                    this.props.percentCompleted ? (
                        <div className="overlay">
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
                                {
                                    this.props.downloadFilename && (
                                        <div className="button-container d-flex align-items-center">
                                            <a className="btn btn--red" onClick={this.downloadZip}>Download</a>
                                            <a className="reset ml-3" onClick={this.props.resetOptimiser}>Upload more images?</a>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ) : null
                }
                <div>
                    <fieldset className="dimensions form-group">
                        <legend>
                            <span>Dimensions</span>
                        </legend>
                        <div className="form-row">
                            <div className="col-6">
                                <div className="form-row">
                                    <div className="col-12 label">Width <span className="help-text">(Empty = auto)</span></div>
                                    <div className="col-12">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="width"
                                            value={this.state.width}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-row">
                                    <div className="col-12 label">Height <span className="help-text">(Empty = auto)</span></div>
                                    <div className="col-12">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="height"
                                            value={this.state.height}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="form-group">
                        <label htmlFor="options_quality">Quality <span className="help-text">(0 - 100)</span></label>
                        <input
                            className="form-control"
                            type="number"
                            min="0"
                            max="100"
                            id="options_quality"
                            name="quality"
                            value={this.state.quality}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="options_fitment">Fitment</label>
                        <select className="form-control" name="fitment" id="options_fitment" value={this.state.fitment} onChange={this.handleChange}>
                            <option value="cover">Cover (default)</option>
                            <option value="contain">Contain</option>
                            <option value="fill">Fill</option>
                            <option value="inside">Inside</option>
                            <option value="outside">Outside</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="options_position">Position</label>
                        <select className="form-control" name="position" id="options_position" value={this.state.position} onChange={this.handleChange}>
                            <option value="center">Center (default)</option>
                            <option value="top">Top</option>
                            <option value="top right">Top right</option>
                            <option value="right">Right</option>
                            <option value="right bottom">Bottom right</option>
                            <option value="bottom">Bottom</option>
                            <option value="left bottom">Bottom left</option>
                            <option value="left">Left</option>
                            <option value="left top">Top left</option>
                        </select>
                    </div>
                </div>

                <div>
                    {
                        !this.props.downloadImage && !this.props.downloadFilename && (
                            <div className={"button-container upload-button-container " + (this.state.uploading ? 'disabled' : '')}>
                                <button className={"btn btn--green " + (this.props.uploading ? 'disabled' : '')} onClick={this.uploadFiles}>Upload</button>
                                {
                                    this.props.error && <span className="invalid-feedback d-block ml-2">{this.props.error}</span>
                                }
                            </div>
                        )
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

export default connect(mapStateToProps, mapDispatchToProps)(OptimiserOptions);

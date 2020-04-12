import React from 'react';
import { connect } from 'react-redux';
import {
    removeImage, resetOptimiser,
    triggerUploadComplete,
    updateDisplayAndUploadFiles, updateErrorMessage,
    updateProgress
} from "../actions/imageOptimiserActions";
import Api from "../api";

class OptimiserOptions extends React.Component {

    uploadFiles = () => {
        const self = this;

        if(!this.props.images.length){
            this.props.updateErrorMessage('Please select files to upload');
            return;
        }

        const config = {
            onUploadProgress: function(progressEvent) {
                const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                self.props.updateProgress(percentCompleted)
            }
        };

        if(this.props.images.length > 1){
            const formData = new FormData();
            for(let file of this.props.images){
                formData.append('images', file.uploadImage);
            }

            Api.uploadMultipleImages(formData, config)
                .then(result => {
                    this.props.triggerUploadComplete(result);
                }).catch(err => {
                console.log(err);
            });
        } else {
            Api.uploadSingleImage({image: this.props.images[0].displayImage}, config)
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

    render(){
        return (
            <div className="optimiser-options--container">
                <div>
                    <fieldset className="dimensions form-group">
                        <legend>
                            <span>Dimensions</span>
                        </legend>
                        <div className="form-row">
                            <div className="col-6">
                                <div className="form-row">
                                    <div className="col-12 label">Width <span className="help-text">(0 = auto)</span></div>
                                    <div className="col-12">
                                        <input className="form-control" type="text"/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-row">
                                    <div className="col-12 label">Height <span className="help-text">(0 = auto)</span></div>
                                    <div className="col-12">
                                        <input className="form-control" type="text"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="form-group">
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="options_quality">Quality <span className="help-text">(0 - 100)</span></label>
                                <input className="form-control" type="text" id="options_quality"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {
                        !this.props.downloadImage && !this.props.downloadFilename && (
                            <button className={"btn btn--green " + (this.props.uploading ? 'disabled' : '')} onClick={this.uploadFiles}>Upload</button>
                        )
                    }

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

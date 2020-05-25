import React from 'react';
import { connect } from 'react-redux';
import {
    triggerUploadComplete,
    updateErrorMessage,
    updateProgress
} from "../actions/imageOptimiserActions";
import ValidationHelper from "../helpers/validation";
import Api from "../api";
import UploadOverlay from "./UploadOverlay";

class OptimiserOptions extends React.Component {
    constructor() {
        super();

        this.state = {
            width: '',
            height: '',
            quality: 80,
            fitment: 'cover',
            position: 'center'
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    uploadFiles = (e) => {
        e.preventDefault();
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
        const formData = new FormData();

        for(let file of this.props.images){
            formData.append('images', file.uploadImage);
        }

        formData.append('width', width);
        formData.append('height', height);
        formData.append('quality', quality);
        formData.append('fitment', this.state.fitment);
        formData.append('position', this.state.position);

        Api.uploadOptimiseImages(formData, config)
            .then(result => {
                this.props.triggerUploadComplete(result);
            });
    };

    render(){
        return (
            <form className="optimiser-options--container" onSubmit={this.uploadFiles}>
                <UploadOverlay bufferText={"Optimising"} />
                <div>
                    <fieldset className="dimensions form-group">
                        <legend>
                            <span>Dimensions</span>
                        </legend>
                        <div className="form-row">
                            <div className="col-6">
                                <div className="form-row">
                                    <label className="col-12 label" htmlFor="options_width">Width <span className="help-text">(Empty = auto)</span></label>
                                    <div className="col-12">
                                        <input
                                            className="form-control"
                                            id="options_width"
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
                                    <label className="col-12 label" htmlFor="options_height">Height <span className="help-text">(Empty = auto)</span></label>
                                    <div className="col-12">
                                        <input
                                            className="form-control"
                                            id="options_height"
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

                <div className="upload-button-container">
                    <button className="btn btn--green" type="submit">Optimise</button>
                    {
                        this.props.error && <span className="invalid-feedback d-block ml-2">{this.props.error}</span>
                    }
                </div>
            </form>
        )
    }
}

const mapStateToProps = ({imageOptimiser}) => {
    const {images, error} = imageOptimiser;
    return {
        images,
        error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        triggerUploadComplete: (data) => dispatch(triggerUploadComplete(data)),
        updateProgress: (percent) => dispatch(updateProgress(percent)),
        updateErrorMessage: (message) => dispatch(updateErrorMessage(message)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OptimiserOptions);

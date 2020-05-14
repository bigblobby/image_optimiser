import React from 'react';
import { connect } from 'react-redux';
import Api from '../api';
import {
    resetOptimiser,
    triggerUploadComplete,
    updateErrorMessage,
    updateProgress
} from "../actions/imageOptimiserActions";
import UploadOverlay from "./UploadOverlay";

class ConvertOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            outputFiletype: 'png',
            showTickIcon: false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    uploadFiles = (e) => {
        e.preventDefault();
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

    render(){
        return (
            <form className="convert-options--container" onSubmit={this.uploadFiles}>
                <UploadOverlay />
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
                    <button className={"btn btn--green "} type="submit">Convert</button>
                    {
                        this.props.error && <span className="invalid-feedback d-block ml-2">{this.props.error}</span>
                    }
                </div>
            </form>
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

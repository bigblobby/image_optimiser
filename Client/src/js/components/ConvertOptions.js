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
            outputFiletype: 'png'
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    uploadFiles = () => {
        if(this.props.images.length === 1){
            Api.convertImage({
                image: this.props.images[0].displayImage,
                newType: this.state.outputFiletype
            }).then(result => {
                console.log(result);
                this.props.triggerUploadComplete(result);
            }).catch(err => {
                console.log(err);
            });
        }
    };

    render(){
        return (
            <div className="convert-options--container">
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

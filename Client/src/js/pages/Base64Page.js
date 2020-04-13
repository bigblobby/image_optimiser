import React from 'react';
import { connect } from 'react-redux';
import {
    resetOptimiser,
    triggerUploadComplete, updateDisplayAndUploadFiles,
    updateErrorMessage,
    updateProgress
} from "../actions/imageOptimiserActions";
import DragAndDrop from "../components/DragAndDrop";
import Helpers from "../helpers";

class Base64Page extends React.Component {
    constructor(props) {
        super(props);

        this.textarea = React.createRef();
    }

    componentDidMount(){
        this.props.resetOptimiser();
    }

    handleFiles = async(files) => {
        const images = await Helpers.fileListBase64(files);
        this.props.updateDisplayAndUploadFiles(images);
    };

    copyToClipboard = () => {
        this.textarea.current.select();
        document.execCommand('copy');
        console.log('copied to clipboard')

    };

    render() {
        console.log(this.props.images.length > 0 ? this.props.images[0].displayImage : 'Some tet');
        return (
            <div className="base64-page">
                <div className="container-fluid max-width">
                    <h1 className="text-center">Base64 Encode Images</h1>
                    <p className="heading-caption text-center mb-5">Large images can take up to 30 seconds to encode, please be patient!</p>
                    <div className="base64-page--inner">
                        <div className="drag-and-drop--container">
                            <DragAndDrop
                                fileLimit={1}
                                handleFiles={this.handleFiles}
                                text={"Drag and drop your image or click here"}
                                helpText={"(1 image only)"}
                            />
                        </div>
                        <div className="result--container">
                            <textarea readOnly ref={this.textarea} value={this.props.images.length > 0 ? this.props.images[0].displayImage : 'Your encoded string will appear here.'} />
                            <div className="button-container mt-3">
                                <button className="btn btn--blue" onClick={this.copyToClipboard}>Copy to clipboard</button>
                                {
                                    this.props.images.length !== 0 && (
                                        <a className="reset ml-2" onClick={this.props.resetOptimiser}>Got another image?</a>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({imageOptimiser}) => {
    const {images} = imageOptimiser;
    return {
        images,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateDisplayAndUploadFiles: (displayFiles, uploadFiles) => dispatch(updateDisplayAndUploadFiles(displayFiles, uploadFiles)),
        resetOptimiser: () => dispatch(resetOptimiser())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Base64Page);

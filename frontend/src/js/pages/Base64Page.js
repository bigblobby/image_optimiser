import React from 'react';
import { connect } from 'react-redux';
import {
    resetOptimiser,
    updateDisplayAndUploadFiles,
} from "../actions/imageOptimiserActions";
import DragAndDrop from "../components/DragAndDrop";
import ImageHelper from "../helpers/image";
import { Helmet } from "react-helmet";

class Base64Page extends React.Component {
    constructor(props) {
        super(props);

        this.textarea = React.createRef();
    }

    componentDidMount(){
        this.props.resetOptimiser();
    }

    handleFiles = async(files) => {
        const images = await ImageHelper.fileListBase64(files);
        this.props.updateDisplayAndUploadFiles(images);
    };

    copyToClipboard = () => {
        this.textarea.current.select();
        document.execCommand('copy');
    };

    output = () => {
        return this.props.images.length > 0 ? this.props.images[0].displayImage : 'Your encoded string will appear here.';
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>I Hate Images | Base64</title>
                </Helmet>

                <div className="base64-page">
                    <div className="container-fluid max-width">
                        <h1 className="text-center">Base64 Encode Images</h1>
                        <p className="heading-caption text-center">Encode PNG, JPEG/JPG and SVG files.</p>
                        <div className="base64-page--inner">
                            <div className="drag-and-drop--container">
                                <DragAndDrop
                                    fileLimit={1}
                                    filesizeLimit={1000000}
                                    handleFiles={this.handleFiles}
                                    text={"Drag and drop your image or click here"}
                                    helpText={"(1 image only)"}
                                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
                                    onDropCallback={this.onDrop}
                                />
                            </div>
                            <div className="result--container">
                                <textarea readOnly ref={this.textarea} value={this.output()}/>
                                <div className="button-container mt-3">
                                    <button className="btn btn--blue" onClick={this.copyToClipboard}>Copy to clipboard</button>
                                    {
                                        this.props.error && <span className="invalid-feedback d-block ml-2">{this.props.error}</span>
                                    }
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
            </>
        );
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
        updateDisplayAndUploadFiles: (displayFiles, uploadFiles) => dispatch(updateDisplayAndUploadFiles(displayFiles, uploadFiles)),
        resetOptimiser: () => dispatch(resetOptimiser())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Base64Page);

import React from 'react';
import { connect } from 'react-redux';
import DragAndDrop from "../components/DragAndDrop";
import { resetOptimiser, updateDisplayAndUploadFiles } from "../actions/imageOptimiserActions";
import Helpers from "../helpers";
import ConvertOptions from "../components/ConvertOptions";
import {Helmet} from "react-helmet";

class ConvertPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.resetOptimiser();
    }

    handleFiles = async (files) => {
        const images = await Helpers.fileListBase64(files);
        this.props.updateDisplayAndUploadFiles(images);
    };

    render() {
        return (
            <>
                <Helmet>
                    <title>Fishy images | Convert</title>
                </Helmet>
                <div className="convert-page">
                    <div className="container-fluid max-width">
                        <h1 className="text-center">Convert images</h1>
                        <p className="heading-caption text-center mb-5">Convert your images to PNG, JPG and WEBP.</p>
                        <div className="convert-page--inner">
                            <div className="drag-and-drop--container">
                                <DragAndDrop
                                    fileLimit={12}
                                    handleFiles={this.handleFiles}
                                    text={"Drag and drop your images or click here"}
                                    helpText={"(up to 12 images)"}
                                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
                                />
                            </div>
                            <div className="control-panel--container">
                                <ConvertOptions />
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

export default connect(mapStateToProps, mapDispatchToProps)(ConvertPage);

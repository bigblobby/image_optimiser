import React from 'react';
import { connect } from 'react-redux';
import DragAndDrop from "../components/DragAndDrop";
import { resetOptimiser, updateDisplayAndUploadFiles } from "../actions/imageOptimiserActions";
import ImageHelper from "../helpers/image";
import ConvertOptions from "../components/ConvertOptions";
import {Helmet} from "react-helmet";

const MAX_FILESIZE = 5000000;

class ConvertPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.resetOptimiser();
    }

    handleFiles = async (files) => {
        const images = await ImageHelper.fileListBase64(files);
        this.props.updateDisplayAndUploadFiles(images);
    };

    render() {
        return (
            <>
                <Helmet>
                    <title>I Hate Images | Convert</title>
                    <meta name="description" content="Convert you images to PNG, JPEG or WEBP. Its easy to use with the drag and drop interface, anyone can use it." />
                </Helmet>

                <div className="convert-page">
                    <div className="container-fluid max-width">
                        <h1 className="text-center">Convert images</h1>
                        <p className="heading-caption text-center">Convert to PNG, JPEG/JPG and WEBP.<br /> (Max {ImageHelper.getFilesize(MAX_FILESIZE)} per image)</p>
                        <div className="convert-page--inner">
                            <div className="drag-and-drop--container">
                                <DragAndDrop
                                    fileLimit={1}
                                    filesizeLimit={MAX_FILESIZE}
                                    handleFiles={this.handleFiles}
                                    text={"Drag and drop your image or click here"}
                                    helpText={"(1 image only)"}
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

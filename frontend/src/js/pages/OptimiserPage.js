import React from 'react';
import { connect } from 'react-redux';
import OptimiserOptions from "../components/OptimiserOptions";
import { resetOptimiser, updateDisplayAndUploadFiles } from "../actions/imageOptimiserActions";
import DragAndDrop from "../components/DragAndDrop";
import ImageHelper from "../helpers/image";
import { Helmet } from "react-helmet";

const MAX_FILESIZE = 5000000;

class OptimiserPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.resetOptimiser();
    }

    handleFiles = async(files) => {
        const images = await ImageHelper.fileListBase64(files);
        this.props.updateDisplayAndUploadFiles(images);
    };

    render() {
        return (
            <>
                <Helmet>
                    <title>I Hate Images | Optimise</title>
                    <meta name="description" content="Optimise and resize your images. Its easy to use with the drag and drop interface, anyone can use it." />
                </Helmet>

                <div className="optimiser-page">
                    <div className="container-fluid max-width">
                        <h1 className="text-center ">Image optimiser</h1>
                        <p className="heading-caption text-center">Resize and optimise. At the moment we only accept PNG and JPEG/JPG files.<br /> (Max {ImageHelper.getFilesize(MAX_FILESIZE)} per image)</p>
                        <div className="optimiser-page--inner">
                            <div className="drag-and-drop--container">
                                <DragAndDrop
                                    fileLimit={12}
                                    filesizeLimit={MAX_FILESIZE}
                                    handleFiles={this.handleFiles}
                                    text={"Drag and drop your images or click here"}
                                    helpText={"(up to 12 images)"}
                                    acceptedFileTypes={['image/png', 'image/jpeg']}
                                />
                            </div>
                            <div className="control-panel--container">
                                <OptimiserOptions />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateDisplayAndUploadFiles: (displayFiles, uploadFiles) => dispatch(updateDisplayAndUploadFiles(displayFiles, uploadFiles)),
        resetOptimiser: () => dispatch(resetOptimiser())
    }
};

export default connect(null, mapDispatchToProps)(OptimiserPage);

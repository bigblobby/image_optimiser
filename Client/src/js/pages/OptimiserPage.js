import React from 'react';
import { connect } from 'react-redux';
import OptimiserOptions from "../components/OptimiserOptions";
import { resetOptimiser, updateDisplayAndUploadFiles } from "../actions/imageOptimiserActions";
import DragAndDrop from "../components/DragAndDrop";
import Helpers from "../helpers";

class OptimiserPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.resetOptimiser();
    }

    handleFiles = async(files) => {
        const images = await Helpers.fileListBase64(files);
        this.props.updateDisplayAndUploadFiles(images);
    };

    render() {
        return (
            <div className="optimiser-page">
                <div className="container-fluid max-width">
                    <h1 className="text-center ">Image optimiser</h1>
                    <p className="heading-caption text-center mb-5">Resize and optimise. At the moment we only accept PNG and JPEG/JPG files.</p>
                    <div className="optimiser-page--inner">
                        <div className="drag-and-drop--container">
                            <DragAndDrop
                                fileLimit={12}
                                handleFiles={this.handleFiles}
                                text={"Drag and drop your files or click here"}
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

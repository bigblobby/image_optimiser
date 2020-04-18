import React from 'react';
import { connect } from 'react-redux';
import DragAndDrop from "../components/DragAndDrop";
import { resetOptimiser, updateDisplayAndUploadFiles } from "../actions/imageOptimiserActions";
import Helpers from "../helpers";
import ConvertOptions from "../components/ConvertOptions";

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
            <div className="convert-page">
                <div className="container-fluid max-width">
                    <h1 className="text-center">Convert images</h1>
                    <p className="heading-caption text-center mb-5">Blah blah blah</p>
                    <div className="convert-page--inner">
                        <div className="drag-and-drop--container">
                            <DragAndDrop
                                fileLimit={12}
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

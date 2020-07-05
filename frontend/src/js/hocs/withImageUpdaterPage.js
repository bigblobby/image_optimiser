import React from 'react';
import { resetOptimiser, updateDisplayAndUploadFiles } from "../actions/imageOptimiserActions";
import { connect } from "react-redux";
import ImageHelper from "../helpers/image";

function withImageUpdaterPage(WrappedComponent){
    class Wrapper extends React.Component {
        componentDidMount(){
            this.props.resetOptimiser();
        }

        handleFiles = async (files) => {
            const images = await ImageHelper.fileListBase64(files);
            this.props.updateDisplayAndUploadFiles(images);
        };

        render() {
            return <WrappedComponent handleFiles={this.handleFiles} {...this.props} />
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
            updateDisplayAndUploadFiles: (images) => dispatch(updateDisplayAndUploadFiles(images)),
            resetOptimiser: () => dispatch(resetOptimiser())
        }
    };

    return connect(mapStateToProps, mapDispatchToProps)(Wrapper);
}

export default withImageUpdaterPage;

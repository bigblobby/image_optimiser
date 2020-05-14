import React from 'react';
import { connect } from "react-redux";
import {
    resetOptimiser,
} from "../actions/imageOptimiserActions";
import ImageHelper from "../helpers/image";

class UploadOverlay extends React.Component {
    static defaultProps = {
        bufferText: 'Optimising'
    }

    constructor(props) {
        super(props);

        this.state = {
            showTickIcon: false
        }
    }

    componentDidUpdate(prevProps) {
        if((prevProps.percentCompleted !== this.props.percentCompleted) && this.props.percentCompleted === 100){
            this.addSvgActiveClass();
        }
    }

    addSvgActiveClass = () => {
        setTimeout(() => {
            this.setState({ showTickIcon: true });
        }, 0);
    };

    downloadZip = () => {
        const filename = this.props.downloadFilename;
        ImageHelper.retrieveZipFile(filename);
    };

    resetButton = () => {
        this.props.resetOptimiser();
        this.setState({ showTickIcon: false });
    }

    render() {
        return (
            <>
                {
                    this.props.percentCompleted ? (
                        <div className="upload-overlay overlay">
                            <div className="overlay--inner">
                                <div className="progress-bar--container mb-3">
                                    <div className="progress-bar">
                                        <div className="track"></div>
                                        <div className="progress" style={ { width: this.props.percentCompleted + '%' } }></div>
                                        <span className="percentage" style={{ left: `calc(${this.props.percentCompleted}% - 12px)` }}>{this.props.percentCompleted !== 100 && this.props.percentCompleted + "%"}</span>
                                    </div>
                                    <div className="tick-container">
                                        <div className="tick-icon--container">
                                            <svg className={ this.state.showTickIcon ? "draw" : "" } version="1.1"
                                                 id="tick-icon" xmlns="http://www.w3.org/2000/svg"
                                                 xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                 viewBox="0 0 37 37" style={ { enableBackground: 'new 0 0 37 37' } }
                                                 xmlSpace="preserve">
                                                <path className="circ path" style={ {
                                                    fill: 'none',
                                                    stroke: '#0dbf73',
                                                    strokeWidth: 3,
                                                    strokeLinejoin: 'round',
                                                    strokeMiterlimit: 10
                                                } }
                                                      d="
                                        M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
                                                />
                                                <polyline className="tick path"
                                                          style={ {
                                                              fill: 'none',
                                                              stroke: '#0dbf73',
                                                              strokeWidth: 3,
                                                              strokeMiterlimit: 15
                                                          } }
                                                          points="
                                    11.6,20 15.9,24.2 26.4,13.8 "/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.props.percentCompleted === 100 && !this.props.uploadComplete && (
                                        <div className="optimising-message--container">
                                            <span>{ this.props.bufferText }</span>
                                        </div>
                                    )
                                }
                                {
                                    this.props.downloadImage && (
                                        <div className="download-button--container d-flex align-items-center">
                                            <a className="btn btn--red" href={this.props.downloadImage} download>Download</a>
                                            <a className="reset ml-3" onClick={this.resetButton}>Upload more images?</a>
                                        </div>
                                    )
                                }
                                {
                                    this.props.downloadFilename && (
                                        <div className="download-button--container d-flex align-items-center">
                                            <a className="btn btn--red" onClick={this.downloadZip}>Download</a>
                                            <a className="reset ml-3" onClick={this.resetButton}>Upload more images?</a>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ) : null
                }
            </>
        );
    }
}

const mapStateToProps = ({imageOptimiser}) => {
    const {uploadComplete, downloadFilename, downloadImage, percentCompleted} = imageOptimiser;
    return {
        downloadFilename,
        downloadImage,
        uploadComplete,
        percentCompleted
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetOptimiser: () => dispatch(resetOptimiser())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadOverlay);

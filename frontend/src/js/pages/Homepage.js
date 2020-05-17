import React from 'react';
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";

class Homepage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>I Hate Images | Optimise, Convert and Base64 your images</title>
                    <meta name="description" content="Optimise, convert, encode. Everything is easy here. Just drag and drop." />
                </Helmet>

                <div className="homepage">
                    <div className="hero">
                        <div  className="container-fluid max-width">
                            <div className="hero--inner">
                                <h1>Optimise, resize, convert, encode.</h1>
                                <Link className="btn btn--white" to="/optimise">Start now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid max-width">
                        <div className="panel-section mt-5">
                            <div className="info-container order-1 order-md-0">
                                <h2>Optimise and resize.</h2>
                                <p>Reduce the size of your images in filesize and resolution.</p>
                                <div>
                                    <Link className="btn btn--green" to="/optimise">Optimise</Link>
                                </div>
                            </div>
                            <div className="image-container">
                                <img src="/images/001-file-upload.svg" alt="Upload icon"/>
                            </div>
                        </div>
                        <div className="panel-section">
                            <div className="image-container">
                                <img src="/images/003-switch.svg" alt="Convert icon"/>
                            </div>
                            <div className="info-container order-1 order-md-0">
                                <h2>Convert.</h2>
                                <p>Change your images to PNG, JPEG or WEBP.</p>
                                <div>
                                    <Link className="btn btn--green" to="/convert">Convert</Link>
                                </div>
                            </div>
                        </div>
                        <div className="panel-section mb-5">
                            <div className="info-container order-1 order-md-0">
                                <h2>Encode your images.</h2>
                                <p>A base64 encoder that doesn't make you upload your images.</p>
                                <div>
                                    <Link className="btn btn--green" to="/base64">Encode</Link>
                                </div>
                            </div>
                            <div className="image-container">
                                <img src="/images/002-binary-file.svg" alt="Encode icon"/>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(null, null)(Homepage);

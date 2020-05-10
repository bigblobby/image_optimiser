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
                    <title>Fishy images | Convert, Base64 and Optimise your images</title>
                </Helmet>

                <div className="homepage">
                    <div className="container-fluid max-width">
                        <div className="panel-section mt-5">
                            <div className="info-container order-1 order-md-0">
                                <h2>Optimise and resize.</h2>
                                <p>Bigger isn't always better. Your images are too large, in filesize and resolution. You can change that here.</p>
                                <div>
                                    <Link className="btn btn--green" to="/optimise">Optimise</Link>
                                </div>
                            </div>
                            <div className="image-container">
                                <img src="/images/001-file-upload.svg" alt="Icon"/>
                            </div>
                        </div>
                        <div className="panel-section">
                            <div className="image-container">
                                <img src="/images/003-switch.svg" alt="Icon"/>
                            </div>
                            <div className="info-container order-1 order-md-0">
                                <h2>Convert.</h2>
                                <p>Bored of the same format? Convert those images into something you really want.</p>
                                <div>
                                    <Link className="btn btn--green" to="/convert">Convert</Link>
                                </div>
                            </div>
                        </div>
                        <div className="panel-section mb-5">
                            <div className="info-container order-1 order-md-0">
                                <h2>Encode your images.</h2>
                                <p>You need a quick encoder that doesn't make you upload your images. Well, here you go.</p>
                                <div>
                                    <Link className="btn btn--green" to="/base64">Encode</Link>
                                </div>
                            </div>
                            <div className="image-container">
                                <img src="/images/002-binary-file.svg" alt="Icon"/>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(null, null)(Homepage);

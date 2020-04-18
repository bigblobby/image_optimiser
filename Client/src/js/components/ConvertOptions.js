import React from 'react';
import { connect } from 'react-redux';

class ConvertOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            outputFiletype: "png"
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    uploadFiles = () => {};

    render(){
        return (
            <div className="convert-options--container">
                <div>
                    <div className="form-group">
                        <label htmlFor="options_filetype">Convert your file to</label>
                        <select className="form-control" value={this.state.outputFiletype} name="outputFiletype" id="options_filetype" onChange={this.handleChange}>
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="webp">WEBP</option>
                        </select>
                    </div>
                </div>
                <div className={"button-container upload-button-container "}>
                    <button className={"btn btn--green "} onClick={this.uploadFiles}>Convert</button>
                </div>
            </div>
        )
    }
}

export default connect(null, null)(ConvertOptions);

import React from 'react';
import { connect } from 'react-redux';

class ConvertPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homepage">
                <p>Convert page</p>
            </div>
        );
    }
}

export default connect(null, null)(ConvertPage);

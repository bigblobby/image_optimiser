import React from 'react';
import { connect } from 'react-redux';

class Base64Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homepage">
                <p>Base64 page</p>
            </div>
        );
    }
}

export default connect(null, null)(Base64Page);

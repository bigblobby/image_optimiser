import React from 'react';
import { connect } from 'react-redux';

class Homepage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homepage">
                <p>The hompage</p>
            </div>
        );
    }
}

export default connect(null, null)(Homepage);

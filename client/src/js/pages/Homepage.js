import React from 'react';
import { connect } from 'react-redux';

class Homepage extends React.Component {
    render() {
        return (
            <div>
                This is the homepage
            </div>
        );
    }
}

export default connect(null, null)(Homepage);

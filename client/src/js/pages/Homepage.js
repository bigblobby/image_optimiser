import React from 'react';
import { connect } from 'react-redux';
import Api from '../api';

class Homepage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        Api.uploadImage()
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
        });
    }

    render() {
        return (
            <div>
                This is the homepage
            </div>
        );
    }
}

export default connect(null, null)(Homepage);

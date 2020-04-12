import React from 'react';
import { connect } from 'react-redux';
import DragAndDrop from "../components/DragAndDrop";
import OptimiserOptions from "../components/OptimiserOptions";

class Homepage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homepage">
                <div className="drag-and-drop--container">
                    <DragAndDrop></DragAndDrop>
                </div>
                <div className="control-panel--container">
                    <OptimiserOptions />
                </div>
            </div>
        );
    }
}

export default connect(null, null)(Homepage);

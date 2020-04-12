import React from 'react';
import { connect } from 'react-redux';
import DragAndDrop from "../components/DragAndDrop";
import OptimiserOptions from "../components/OptimiserOptions";

class OptimiserPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="optimiser-page">
                <div className="container-fluid max-width">
                    <h1 className="text-center ">Image optimiser</h1>
                    <p className="heading-caption text-center mb-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio ea expedita maxime natus officiis, ratione repellat. Repellat rerum similique suscipit!</p>
                    <div className="optimiser-page--inner">
                        <div className="drag-and-drop--container">
                            <DragAndDrop></DragAndDrop>
                        </div>
                        <div className="control-panel--container">
                            <OptimiserOptions />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, null)(OptimiserPage);

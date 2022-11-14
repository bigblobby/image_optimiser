import React from 'react';
import OptimiserOptions from "../components/OptimiserOptions";
import DragAndDrop from "../components/DragAndDrop";
import ImageHelper from "../helpers/image";
import { Helmet } from "react-helmet";
import withImageUpdaterPage from "../hocs/withImageUpdaterPage";

const MAX_FILESIZE = 5000000;

class OptimiserPage extends React.Component {
    render() {
        return (
            <>
                <Helmet>
                    <title>I Hate Images | Optimise</title>
                    <meta name="description" content="Optimise and resize your images. Its easy to use with the drag and drop interface, anyone can use it." />
                    <meta property="og:title" content="I Hate Images | Optimise" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://www.ihateimages.com" />
                    <meta property="og:image" content="/images/fish.svg" />
                </Helmet>

                <div className="optimiser-page">
                    <div className="container-fluid max-width">
                        <h1 className="text-center ">Optimise</h1>
                        <p className="heading-caption text-center">Resize and optimise. At the moment we only accept PNG,JPEG/JPG and WEBP files. (Max {ImageHelper.getFilesize(MAX_FILESIZE)} per image)</p>
                        <div className="optimiser-page--inner">
                            <div className="drag-and-drop--container">
                                <DragAndDrop
                                    fileLimit={12}
                                    filesizeLimit={MAX_FILESIZE}
                                    handleFiles={this.props.handleFiles}
                                    text={"Drag and drop your images or click here"}
                                    helpText={"(up to 12 images)"}
                                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
                                />
                            </div>
                            <div className="control-panel--container">
                                <OptimiserOptions />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withImageUpdaterPage(OptimiserPage);

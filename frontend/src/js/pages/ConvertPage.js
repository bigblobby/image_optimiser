import React from 'react';
import DragAndDrop from "../components/DragAndDrop";
import ImageHelper from "../helpers/image";
import ConvertOptions from "../components/ConvertOptions";
import {Helmet} from "react-helmet";
import withImageUpdaterPage from "../hocs/withImageUpdaterPage";

const MAX_FILESIZE = 5000000;

class ConvertPage extends React.Component {
    render() {
        return (
            <>
                <Helmet>
                    <title>I Hate Images | Convert</title>
                    <meta name="description" content="Convert you images to PNG, JPEG or WEBP. Its easy to use with the drag and drop interface, anyone can use it." />
                    <meta property="og:title" content="I Hate Images | Convert" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://www.ihateimages.com" />
                    <meta property="og:image" content="/images/fish.svg" />
                </Helmet>

                <div className="convert-page">
                    <div className="container-fluid max-width">
                        <h1 className="text-center">Convert</h1>
                        <p className="heading-caption text-center">Convert to PNG, JPEG/JPG and WEBP.<br /> (Max {ImageHelper.getFilesize(MAX_FILESIZE)} per image)</p>
                        <div className="convert-page--inner">
                            <div className="drag-and-drop--container">
                                <DragAndDrop
                                    fileLimit={1}
                                    filesizeLimit={MAX_FILESIZE}
                                    handleFiles={this.props.handleFiles}
                                    text={"Drag and drop your image or click here"}
                                    helpText={"(1 image only)"}
                                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
                                />
                            </div>
                            <div className="control-panel--container">
                                <ConvertOptions />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withImageUpdaterPage(ConvertPage);

import React from 'react';
import Api from '../api';

class SiteCheckerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parameters: {
                url: ''
            },
            result: null,
            error: null,
            isChecking: false
        }
    }

    setUrl = (e) => {
        this.setState({
            parameters: {url: e.target.value}
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({isChecking: true, result: null}, () => {
            Api.checkSite(this.state.parameters)
                .then(result => {
                    this.setState({result: result, isChecking: false, error: null});
                }).catch(err => {
                    console.log(err);
                    this.setState({error: err.error, isChecking: false});
                });
        })
    }

    renderMessage = () => {
        if(!this.state.result) return null;

        if(this.state.result?.code === 200){
            return (
                <p className="result-message result-message--success"><a href={this.state.result.url}>{this.state.result.url}</a> is up.</p>
            )
        } else if(this.state.result?.code === 500) {
            return (
                <p className="result-message result-message--error"><a href={this.state.result.url}>{this.state.result.url}</a> is down for everyone.</p>
            )
        }
    }

    render() {
        return (
            <div className="site-checker-page">
                <div className="site-check">

                    <h1 className="text-center ">Site Checker</h1>
                    <p className="heading-caption text-center mb-5">Check if a site is down for everyone or just you.</p>


                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="site">Site:</label>
                            <input className="form-control" type="text" id="site" onChange={this.setUrl}/>
                        </div>
                        <div className="form-group">
                            <div className="d-flex align-items-center">
                                <button className="btn btn--green justify-content-center" type="submit">
                                    {
                                        this.state.isChecking ? 'Checking...' : 'Check'
                                    }
                                </button>
                                <span className="invalid-feedback d-block ml-2">{this.state.error}</span>
                            </div>
                        </div>
                    </form>

                    {this.renderMessage()}
                </div>
            </div>
        );
    }
}

export default SiteCheckerPage;

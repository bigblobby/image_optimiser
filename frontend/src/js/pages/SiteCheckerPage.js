import React from 'react';
import Api from '../api';
import {nanoid} from 'nanoid';

class SiteCheckerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parameters: {
                url: ''
            },
            result: null,
            error: null,
            isChecking: false,
            sites: []
        }
    }

    componentDidMount() {
        this.getStorage()
    }

    getStorage = () => {
        const sites = localStorage.getItem('checked_sites');
        if(sites){
            this.setState({
                sites: JSON.parse(sites)
            });
        }
    }

    setStorage = () => {
        localStorage.setItem('checked_sites', JSON.stringify(this.state.sites))
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
                    const site = {id: nanoid(), date: new Date(), ...result, queriedUrl: this.state.parameters.url};
                    const sites = [...this.state.sites, site];

                    this.setState({result: result, isChecking: false, error: null, sites: sites}, this.setStorage);
                }).catch(err => {
                    console.log(err);
                    this.setState({error: err.error, isChecking: false});
                });
        });
    }

    refreshSite = (site) => {
        const sites = [...this.state.sites];
        const sitePosition = sites.findIndex(s => s.id === site.id);
        const siteName = sites[sitePosition].queriedUrl;
        sites[sitePosition].date = new Date();

        Api.checkSite({url: siteName})
            .then(result => {
                this.setState({result: result, isChecking: false, error: null, sites: sites}, this.setStorage);
            }).catch(err => {
                console.log(err);
                this.setState({error: err.error, isChecking: false});
            });
    }

    removeSiteDriver = (id) => {
        const sites = [...this.state.sites];
        const newList = sites.filter(site => site.id !== id);
        this.setState({
            sites: newList
        }, this.setStorage);
    }

    renderSiteDriver = (site) => {
        const date = (typeof site.date === 'string' ? new Date(site.date): site.date)
        return (
            <div className={"site-driver " + (site.code === 200 ? 'site-driver--green' : 'site-driver--red')} key={site.id}>
                <div className="site-driver__name"><a href={site.url}>{site.url}</a></div>
                <div className="site-driver__info">
                    <div className="site-driver__status">
                        <span className={"site-driver__badge " + (site.code === 200 ? 'site-driver__badge--green' : 'site-driver__badge--red')}>{site.code === 200 ? 'UP' : 'DOWN'}</span>
                        <div className="site-driver__date">
                            <span>Last updated at:</span>
                            <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
                        </div>
                    </div>

                    <div className="site-driver__actions">
                        <button onClick={() => this.refreshSite(site)}>R</button>
                        <button onClick={() => this.removeSiteDriver(site.id)}>X</button>
                    </div>
                </div>
            </div>
        )
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
                </div>

                <div className="site-list">
                    {
                        this.state.sites.length > 0 && this.state.sites.map(site => {
                            return this.renderSiteDriver(site)
                        })
                    }
                </div>
            </div>
        );
    }
}

export default SiteCheckerPage;

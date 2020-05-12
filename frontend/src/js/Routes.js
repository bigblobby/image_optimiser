import React from 'react';
import thunk from 'redux-thunk';
import { Route, Switch, Link } from 'react-router-dom';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';

import Homepage from "./pages/Homepage";
import OptimiserPage from "./pages/OptimiserPage";
import Base64Page from "./pages/Base64Page";
import ConvertPage from "./pages/ConvertPage";

import rootReducer from "./reducers";
import history from "./history";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from 'react-redux';
import Navigation from "./components/Navigation";

const middleware = [
    thunk,
    routerMiddleware(history)
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer(history),
    composeEnhancers(
        applyMiddleware(...middleware)
    ),
);

export default class Routes extends React.Component {
    render() {
        return (
            <Provider store={ store }>
                <ConnectedRouter history={history}>
                    <div id="content" className="site-content">
                        <div className="header">
                            <div className="container-fluid max-width">
                                <div className="header--inner">
                                    <div className="logo-container">
                                        <Link className="logo" to={'/'}>
                                            <img src="/images/fish.svg" alt="Logo"/>
                                        </Link>
                                    </div>
                                    <Navigation/>
                                </div>
                            </div>
                        </div>
                        <Switch>
                            <Route exact path="/" component={Homepage} />
                            <Route exact path="/optimise" component={OptimiserPage}/>
                            <Route exact path="/base64" component={Base64Page}/>
                            <Route exact path="/convert" component={ConvertPage}/>
                        </Switch>

                        <div className="footer">
                            <div className="footer--inner">
                                <div>Site made by <a className="link--red" href="https://www.linkedin.com/in/thomas-dempster-00843bb7" rel="noopener noreferrer" target="_blank">Tom Dempster</a>. Icons made by <a href="https://www.flaticon.com/authors/freepik" rel="noopener noreferrer" target="_blank" title="Freepik">Freepik</a> and <a href="https://www.flaticon.com/authors/pixel-perfect" rel="noopener noreferrer" target="_blank" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" rel="noopener noreferrer" target="_blank" title="Flaticon">www.flaticon.com</a></div>
                            </div>
                        </div>
                    </div>
                </ConnectedRouter>
            </Provider>
        );
    }
}

import React, { Suspense } from 'react';
import thunk from 'redux-thunk';
import { Route, Switch, Link } from 'react-router-dom';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import rootReducer from "./reducers";
import history from "./history";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from 'react-redux';
import Navigation from "./components/Navigation";
import GA from './helpers/GoogleAnalytics';

// GA - Track page views
history.listen((location, action) => {
    GA.pageview(location.pathname)
});

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

const Homepage = React.lazy(() => import("./pages/Homepage"));
const OptimiserPage = React.lazy(() => import("./pages/OptimiserPage"));
const Base64Page = React.lazy(() => import("./pages/Base64Page"));
const ConvertPage = React.lazy(() => import("./pages/ConvertPage"));
const Error404Page = React.lazy(() => import("./pages/Error404Page"));

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
                        <Suspense fallback={''}>
                            <Switch>
                                <Route exact path="/" component={Homepage} />
                                <Route exact path="/optimise" component={OptimiserPage}/>
                                <Route exact path="/encode" component={Base64Page}/>
                                <Route exact path="/convert" component={ConvertPage}/>
                                <Route component={Error404Page}/>
                            </Switch>
                        </Suspense>

                        <div className="footer">
                            <div className="footer--inner">
                                <div>
                                    <span className="site-made-by">Site made by <a className="link--red" href="https://www.linkedin.com/in/thomas-dempster-00843bb7" rel="noopener noreferrer" target="_blank">Tom Dempster</a>.</span>
                                    <span className="icons-made-by"> Icons made by <a href="https://www.flaticon.com/authors/freepik" rel="noopener noreferrer" target="_blank" title="Freepik">Freepik</a> and <a href="https://www.flaticon.com/authors/pixel-perfect" rel="noopener noreferrer" target="_blank" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" rel="noopener noreferrer" target="_blank" title="Flaticon">www.flaticon.com</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ConnectedRouter>
            </Provider>
        );
    }
}

import React from 'react';
import thunk from 'redux-thunk';
import { Route, Switch, NavLink, Link } from 'react-router-dom';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';

import Homepage from "./pages/Homepage";
import OptimiserPage from "./pages/OptimiserPage";
import Base64Page from "./pages/Base64Page";

import rootReducer from "./reducers";
import history from "./history";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from 'react-redux';

const middleware = [
    thunk,
    routerMiddleware(history)
];

const store = createStore(
    rootReducer(history),
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ),
);

export default class Routes extends React.Component {
    render() {
        return (
            <Provider store={ store }>
                <ConnectedRouter history={history}>
                    <div id="content">
                        <div className="header">
                            <div className="container-fluid max-width">
                                <div className="header--inner">
                                    <div className="logo-container">
                                        <Link className="logo" to={'/'}>IMAGE</Link>
                                    </div>
                                    <nav className="navigation">
                                        <ul>
                                            <NavLink to={'/optimise'}>Optimise</NavLink>
                                            <NavLink to={'/base64'}>Base64</NavLink>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <Switch>
                            <Route exact path="/" component={Homepage} />
                            <Route exact path="/optimise" component={OptimiserPage}/>
                            <Route exact path="/base64" component={Base64Page}/>
                        </Switch>
                    </div>
                </ConnectedRouter>
            </Provider>
        );
    }
}

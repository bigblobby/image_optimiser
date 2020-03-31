import React from 'react';
import thunk from 'redux-thunk';
import { Route, Switch } from 'react-router-dom';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';

import Homepage from "./pages/Homepage";

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
                        <Switch>
                            <Route exact path="/" component={Homepage}/>
                        </Switch>
                    </div>
                </ConnectedRouter>
            </Provider>
        );
    }
}

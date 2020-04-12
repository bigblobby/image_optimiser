import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import imageOptimiserReducer from "./imageOptimiserReducer";

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    imageOptimiser: imageOptimiserReducer
});

export default rootReducer;

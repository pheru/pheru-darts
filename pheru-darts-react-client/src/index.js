import React from 'react'
import {render} from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'
import AppContainer from "./containers/app/AppContainer";
import {HashRouter} from "react-router-dom";

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware
    )
);

render(
    <Provider store={store}>
        <HashRouter>
            <AppContainer/>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

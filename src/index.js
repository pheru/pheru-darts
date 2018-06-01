import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'
import AppContainer from "./containers/AppContainer";
import {BrowserRouter} from "react-router-dom";

const store = createStore(rootReducer);

render(
    <Provider store={store}>
        <BrowserRouter>
            <AppContainer/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

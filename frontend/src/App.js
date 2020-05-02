import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./Components/Layout/Layout";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./reducers";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {faHeart as fasFaHeart, faWindowClose, faYenSign, faStreetView, faUsers, faTimes} from '@fortawesome/free-solid-svg-icons'
import {faCalendarAlt, faTimesCircle, faTrashAlt} from '@fortawesome/free-regular-svg-icons'

library.add(fab, fasFaHeart, faWindowClose, faTrashAlt, faYenSign, faStreetView, faUsers, faTimes, faCalendarAlt, faTimesCircle);

const store = createStore(rootReducer);

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <Layout/>
            </Provider>
        </div>
    );
}

export default App;

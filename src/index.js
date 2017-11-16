import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import {piwik} from './utils';
import './index.less'

const history = createBrowserHistory();

ReactDOM.render(
    <Router history={piwik.connectToHistory(history)} >
         <App />
    </Router>
    ,
    document.getElementById('root'));
registerServiceWorker();

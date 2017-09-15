import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import './index.css';
const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
         <App />
    </Router>
    ,
    document.getElementById('root'));
registerServiceWorker();

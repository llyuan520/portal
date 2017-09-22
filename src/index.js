import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import createBrowserHistory from 'history/createBrowserHistory';
import ReactPiwik from './piwik';
import App from './App';
import './index.css';

const history = createBrowserHistory();

const piwik = new ReactPiwik({
    //TODO: 测试环境地址，上线修改
    url: 'http://120.25.216.215:9009/piwik/',
    siteId: 6,
    trackErrors: true,
});

ReactDOM.render(
    <Router history={piwik.connectToHistory(history)} >
         <App />
    </Router>
    ,
    document.getElementById('root'));
registerServiceWorker();

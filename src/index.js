import React from 'react';
import ReactDOM from 'react-dom';
import { App, Home, Login, Register } from './containers';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));

const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Route path="/" component={ App } />
                <Route path="/home" component={ Home } />
                <Route path="/login" component={ Login } />
                <Route path="/register" component={ Register } />
                {/* <Route path="/" component={ App }>
                    <Route path="home" component={ Home } />
                    <Route path="Login" component={ Login } />
                    <Route path="register" component={ Register } />
                </Route> */}
            </div>
        </Router>
    </Provider>
    , rootElement);

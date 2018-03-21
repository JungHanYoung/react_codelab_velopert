import React, { Component } from 'react';
import { Header } from '../components';
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from '../actions/authentication';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Wall from './Wall';
import Login from './Login';
import Register from './Register';

class App extends Component {

    constructor(props){
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        function getCookie(name) {
            var value = "; " +document.cookie;
            var parts = value.split("; " + name + "=");
            if(parts.length == 2) return parts.pop().split(";").shift();
        }

        // get loginData from cookie
        let loginData = getCookie('key');

        // if loginData is undefined, do nothing
        if(typeof loginData === "undefined"){
            return;
        }

        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));

        // if not logged in, do nothing
        if(!loginData.isLoggedIn) return;

        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                // if session is not valid
                if(!this.props.status.valid){
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        username: ''
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    // and notify
                    let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                    Materialize.toast($toastContent, 4000);
                }
            }
        )
        
    }

    handleLogout() {
        this.props.logoutRequest().then(
            () => {
                Materialize.toast('Good Bye!', 2000);

                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
            }
        )
    }

    handleSearch(keyword){
        //console.log(keyword)
        this.props.searchRequest(keyword)
    }

    render() {
        /* Check whethe current route is login or register using regex */
        let re = /(login|register)/;
        let isAuth = re.test(this.props.location.pathname);
       
        const Authentication = (
            <div>
                <Route path={`${this.props.match.url}login`} component={ Login }/>
                <Route path={`${this.props.match.url}register`} component={ Register } />
            </div>
        );

        const other = (
            <div>
                <Header 
                    isLoggedIn={this.props.status.isLoggedIn}
                    onLogout={this.handleLogout}
                    onSearch={this.handleSearch}
                    usernames={this.props.usernames}
                    history={this.props.history}/>
                    <Route path={`${this.props.match.url}wall`} component={Wall}/>
                    <Route exact path="/" component={Home} />
            </div>
        );

        return (isAuth ? Authentication : other);
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
        usernames: state.search.usernames
    };
};

import { searchRequest } from '../actions/search';

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
        searchRequest: (keyword) => {
            return dispatch(searchRequest(keyword));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import propTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Search from './Search';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchStatus: false
        };
        this.toggleSearch = this.toggleSearch.bind(this);
    }

    /* IMPLEMENT: CREATE toggleSearch METHOD THAT TOGLES THE SEARCH STATE */
    toggleSearch(){
        this.setState({
            searchStatus: !this.state.searchStatus
        });       
    }

    render() {

        const loginButton = (
            <li>
                <Link to="/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a onClick={this.props.onLogout}>
                    <i className="material-icons">lock_open</i>
                </a>
            </li>
        );

        console.log('Header : ' + this.props.history);

        return (
            <div>
                <nav>
                    <div className="nav-wrapper blue darken-1">
                        <Link to="/" className="brand-logo center">MEMOPAD</Link>

                        <ul>
                            <li><a onClick={this.toggleSearch}><i className="material-icons">search</i></a></li>
                        </ul>

                        <div className="right">
                            <ul>
                                { this.props.isLoggedIn ? logoutButton : loginButton }
                            </ul>
                        </div>
                    </div>
                </nav>
                {/* { this.state.searchStatus ? 
                <ReactCSSTransitionGroup trasitionName="search" transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}> 
                    <Search onClose={this.toggleSearch}/>
                </ReactCSSTransitionGroup>: undefined} */}
                { this.state.searchStatus ? <Search onClose={this.toggleSearch}
                                                    onSearch={this.props.onSearch}
                                                    usernames={this.props.usernames}
                                                    history={this.props.history} /> : undefined }
            </div>
        );
    }
}

Header.propTypes = {
    isLoggedIn: propTypes.bool,
    onLogout: propTypes.func,
    onSearch: propTypes.func,
    usernames: propTypes.array
};

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => { console.error("logout function not defined"); },
    onSearch: (keyword) => { console.error("onSearch function not defined"); },
    usernames: []
};

export default Header;

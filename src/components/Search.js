import React, { Component } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Search extends Component {
    constructor(props){
        super(props);

        this.state = {
            keyword: ''
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        const listenEscKey = (evt) => {
            evt = evt || window.event;
            if(evt.keyCode === 27){
                this.handleClose();
            }
        };

        document.onkeydown = listenEscKey;
    }

    handleClose() {
        this.handleSearch('');
        document.onkeydown = null;
        this.props.onClose();
    }

    handleChange(e) {
        this.setState({
            keyword: e.target.value
        });
        this.handleSearch(e.target.value);
    }

    handleSearch(keyword) {
        // to be implemented ..
        console.log(keyword);
        this.props.onSearch(keyword);
    }

    handleKeyDown(e) {
        // IF PRESSED ENTER, TRIGGER TO NAVIGATE TO THE FIRST USER SHOWN
        if(e.keyCode === 13) {
            console.log(this.props.history);
            if(this.props.usernames.length > 0) {
                this.props.history.push(`/wall?username=${this.props.usernames[0].username}`);
                this.handleClose();
            }
        }
    }

    render() {
        const data = this.props.usernames;
        const mapDataToLinks = (data) => {
            // IMPLEMENT : map data array to array of Link components
            // create LINKS to '/wall?username={username}'
            return data.map((user, i) => {
                return (
                    <li key={i} onClick={this.handleClose}><Link to={`/wall?username=${user.username}`}
                        >{user.username}</Link></li>
                );
            });
        };
        
        return (
            <ReactCSSTransitionGroup transitionName="search"
                transitionEnterTimeout={2000}
                transitionLeaveTimeout={2000}>

                <div className="search-screen white-text">
                    <div className="right">
                        <a className="waves-effect waves-light btn red lighten-1"
                            onClick={this.handleClose}>CLOSE</a>
                    </div>
                    <div className="container">
                        <input placeholder="Search a user"
                                value={this.state.keyword}
                                onChange={this.handleChange}
                                onKeyDown={this.handleKeyDown}></input>
                        <ul className="search-results">
                            { mapDataToLinks(this.props.usernames) }
                        </ul>

                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}

import propTypes from 'prop-types';

Search.propTypes = {
    onClose: propTypes.func,
    onSearch: propTypes.func,
    usernames: propTypes.array
};

Search.defaultProps = {
    onClose: () => {
        console.error('onClose not defined');
    },
    onSearch: () => {
        console.error('onSearch not defined');
    },
    usernames: []
};

export default Search;

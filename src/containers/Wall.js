import React, { Component } from 'react';
import queryString from 'query-string';
import Home from './Home';
import Header from '../components/Header';

class Wall extends Component {
    render() {
        const { match, location } = this.props;
        const { username } = queryString.parse(location.search);
        console.log(username);
        return (
            <Home username={ username }/>
        );
    }
}

export default Wall;

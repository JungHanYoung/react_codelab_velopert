import React, { Component } from 'react';
import propTypes from 'prop-types';
import Memo from './Memo';

class MemoList extends Component {
    render() {

        const mapToComponents = data => {
            return data.map((memo, i) => {
                return (
                    <Memo 
                        data={memo}
                        ownership={(memo.writer === this.props.currentUser)}
                        key={memo._id}
                    />
                );
            })
        }
        return (
            <div>
                {mapToComponents(this.props.data)}
            </div>
        );
    }
}

MemoList.propTypes = {
    data: propTypes.array,
    currentUser: propTypes.string
}

MemoList.defaultProps = {
    data: [],
    currentUser: ''
}

export default MemoList;

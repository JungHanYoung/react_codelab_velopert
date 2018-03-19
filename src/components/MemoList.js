import React, { Component } from 'react';
import propTypes from 'prop-types';
import Memo from './Memo';

class MemoList extends Component {
    constructor(props){
        super(props);
        // console.log('MemoList props : ');
        // console.log(props);
    }
    render() {

        const mapToComponents = data => {
            return data.map((memo, i) => {
                //console.log(memo._id);
                return (
                    <Memo 
                        data={memo}
                        ownership={(memo.writer === this.props.currentUser)}
                        index={i}
                        onEdit={this.props.onEdit}
                        key={memo._id}
                    />
                );
            })
        };
        
        return (
            <div>
                {mapToComponents(this.props.data)}
            </div>
        );
    }
}

MemoList.propTypes = {
    data: propTypes.array,
    currentUser: propTypes.string,
    onEdit: propTypes.func
}

MemoList.defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, contents) => {
        console.error('edit function not defined')
    }
}

export default MemoList;

import React, { Component } from 'react';
import propTypes from 'prop-types';
import Memo from './Memo';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class MemoList extends Component {
    constructor(props){
        super(props);
        // console.log('MemoList props : ');
        // console.log(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
        return update;
    }
    render() {
        //console.log('MemoList render method executed');
        const mapToComponents = data => {
            return data.map((memo, i) => {
                //console.log(memo._id);
                return (
                    <Memo 
                        data={memo}
                        ownership={(memo.writer === this.props.currentUser)}
                        index={i}
                        onEdit={this.props.onEdit}
                        onRemove={this.props.onRemove}
                        onStar={this.props.onStar}
                        currentUser={this.props.currentUser}
                        key={memo._id}
                    />
                );
            })
        };

        return (
            <div>
                <ReactCSSTransitionGroup
                    transitionName="memo"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={1000}>
                    {mapToComponents(this.props.data)}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

MemoList.propTypes = {
    data: propTypes.array,
    currentUser: propTypes.string,
    onEdit: propTypes.func,
    onRemove: propTypes.func,
    onStar: propTypes.func
}

MemoList.defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, contents) => {
        console.error('edit function not defined');
    },
    onRemove: (id, index) => {
        console.error('remove function not defined');
    },
    onStar: (id, index) => {
        console.error('star function not defined');
    }
}

export default MemoList;

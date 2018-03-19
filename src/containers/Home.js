import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from '../components';
import { 
    memoPostRequest,
    memoListRequest,
    memoEditRequest,
    memoRemoveRequest } from '../actions/memo';

class Home extends Component {

    constructor(props){
        super(props);

        this.state = {
            loadingState: false
        }

        this.handlePost = this.handlePost.bind(this);
        this.loadNewMemo = this.loadNewMemo.bind(this);
        this.loadOldMemo = this.loadOldMemo.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentDidMount() {
        // LOAD NEW MEMO EVERY 5 SECONDS
        // 5초마다 새로운 메모를 로드한다.
        const loadMemoLoop = () => {
            this.loadNewMemo().then(
                () => {
                    this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
                }
            );
        }
        
        const loadUntilScrollable = () => {
            // IF THE SCROLLBAR DOES NOT EXIST
            // 만약 스크롤바가 없다면
            // body태그가 window창보다 작으면 스크롤바가 없는 것이므로
            if($("body").height() < $(window).height()) {
                this.loadOldMemo().then(
                    () => {
                        // DO THIS RECURSIVELY UNLESS IT'S LAST PAGE
                        // 마지막 메모가 아닌 한 스크롤바가 생길때까지 예전 메모를 로딩하는거지.
                        // 그러면 데이터가 늘어나 스크롤바가 생기겠지?
                        if(!this.props.isLast) {
                            loadUntilScrollable();
                        }
                    }
                )
            }
        };
        this.props.memoListRequest(true).then(
            () => {
                loadUntilScrollable();
                // BEGIN NEW MEMO LOADING LOOP
                loadMemoLoop();
            }
        )

        $(window).scroll(() => {
            // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250
            if($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
                if(!this.state.loadingState){
                    this.loadOldMemo();
                    this.setState({
                        loadingState: true
                    });
                } else{
                    if(this.state.loadingState) {
                        this.setState({

                        })
                    }
                }
                console.log('LOAD NOW');
            }
        });

    }

    componentWillUnmount() {
        // STOPS THE loadMemoLoop
        clearTimeout(this.memoLoaderTimeoutId);

        // REMOVE WINDOWS SCROLL LISTENER
        $(window).unbind();
    }

    loadNewMemo() {
        // CANCEL IF THERE IF A PENDING REQUEST
        // 
        if(this.props.listStatus === 'WAITING')
            return new Promise((resolve, reject) => {
                resolve();
            });
        
        // IF PAGE IS EMPTY, DO THE INITIAL LOADING
        if(this.props.memoData.length === 0)
            return this.props.memoListRequest(true);

        return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id);
    }

    loadOldMemo() {
        // CANCEL IF USER IS READING THE LAST PAGE
        if(this.props.isLast){
            return new Promise(
                (resolve, reject) => {
                    resolve();
                }
            );
        }

        // GET ID OF THE MEMO AT THE BOTTOM
        let lastId = this.props.memoData[this.props.memoData.length -1]._id;

        // START REQUEST
        return this.props.memoListRequest(false, 'old', lastId, this.props.username).then(() => {
            // IF IT IS LAST PAGE, NOTIFY
            if(this.props.isLast) {
                Materialize.toast('You are reading the last page', 2000);
            }
        })
    }

    /**
     * 
     * @param { string } contents 생성할 메모의 내용!
     */
    handlePost(contents) {
        return this.props.memoPostRequest(contents).then(
            () => {
                if(this.props.postStatus.status === "SUCCESS"){
                    // TRIGGER LOAD NEW MEMO
                    this.loadNewMemo().then(
                        () => {
                            Materialize.toast('Success!', 2000);
                        }
                    );
                } else {
                    /**
                     * ERROR CODES
                     *  1: NOT LOGGED IN
                     *  2: EMPTY CONTENTS
                     */
                    let $toastContent;
                    switch(this.props.postStatus.error) {
                        case 1:
                            // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
                            $toastContent = $('<span stype="color: #FFB4BA">You are not logged in</span>');
                            Materialize.toast($toastContent, 2000);
                            setTimeout(() => {
                                location.reload(false);
                            }, 2000);
                            break;
                        case 2:
                            $toastContent = $('<span style="color: #FFB4BA">Please write something</span>');
                            Materialize.toast($toastContent, 2000);
                            break;
                        default:
                            $toastContent = $('<span style="color: #FFB4BA">Something broke</span>');
                            Materialize.toast($toastContent, 2000);
                            break;
                    }
                }
            }
        );
    }

    handleEdit(id, index, contents){
        return this.props.memoEditRequest(id, index, contents).then(
            () => {
                if(this.props.editStatus.status === "SUCCESS") {
                    Materialize.toast('Success!', 2000);
                } else {
                    /**
                     * ERROR CODES
                     *  1: INVALID ID,
                     *  2: EMPTY CONTENTS
                     *  3: NOT LOGGED IN
                     *  4: NO RESOURCE
                     *  5: PERMISSION FAILURE
                     */
                    let errorMessage = [
                        'Something broke',
                        'Please write something',
                        'You are not logged in',
                        'That memo does not exist anymore',
                        'You do not have permission'
                    ];

                    let error = this.props.editStatus.error;

                    // NOTIFY ERROR
                    let $toastContent = $(`<span style="color: #FFB4BA">${errorMessage[error - 1]}</span>`);
                    Materialize.toast($toastContent, 2000);

                    // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
                    if(error === 3) {
                        setTimeout(() => {location.reload(false)}, 2000);
                    }
                }
            }
        )
    }

    handleRemove(id, index){
        this.props.memoRemoveRequest(id, index).then(
            () => {
                if(this.props.removeStatus.status === "SUCCESS"){
                    // LOAD MORE MEMO IF THERE IS NO SCROLLBAR
                    // 1 SECOND LATER. (ANIMATION TAKES 1SEC)
                    setTimeout(() => {
                        if($('body').height() < $(window).height()){
                            this.loadOldMemo();
                        }
                    }, 1000);
                } else {
                    // ERROR
                    /**
                     * DELETE MEMO: DELETE /api/memo/:id
                     * ERROR CODE
                     *  1: INVALID ID
                     *  2: NOT LOGGED IN
                     *  3: NO RESOURCE
                     *  4: PERMISSION FAILURE
                     */
                    let errorMessage = [
                        'Something broke',
                        'You are not logged in',
                        'That memo does not exist',
                        'You do not have permission'
                    ];

                    // NOTIFY ERROR
                    let $toastContent = $(`<span style="color: #FFB4BA>${errorMessage[this.props.removeStatus.error - 1]}</span>"`);
                    Materialize.toast($toastContent, 2000);

                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    if(this.props.removeStatus.error === 2){
                        setTimeout(() => {
                            location.reload(false);
                        }, 2000);
                    }
                }
            }
        )
    }

    render() {

        const write = (<Write onPost={this.handlePost}/>);

        return (
            <div className="wrapper">
                {this.props.isLoggedIn? write : undefined}
                <MemoList 
                    data={this.props.memoData}
                    currentUser={this.props.currentUser}
                    onEdit={this.handleEdit}
                    onRemove={this.handleRemove}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn,
        postStatus: state.memo.post,
        currentUser: state.authentication.status.currentUser,
        memoData: state.memo.list.data,
        listStatus: state.memo.list.status,
        isLast: state.memo.list.isLast,
        editStatus: state.memo.edit,
        removeStatus: state.memo.remove
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents));
        },
        memoListRequest: (isInitial, listType, id, username) => {
            return dispatch(memoListRequest(isInitial, listType, id, username));
        },
        memoEditRequest: (id, index, contents) => {
            return dispatch(memoEditRequest(id, index, contents));
        },
        memoRemoveRequest: (id, index) => {
            return dispatch(memoRemoveRequest(id, index));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

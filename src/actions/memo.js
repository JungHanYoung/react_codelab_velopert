import {
    MEMO_POST,
    MEMO_POST_SUCCESS,
    MEMO_POST_FAILURE,
    MEMO_LIST,
    MEMO_LIST_SUCCESS,
    MEMO_LIST_FAILURE,
    MEMO_EDIT,
    MEMO_EDIT_SUCCESS,
    MEMO_EDIT_FALIURE,
    MEMO_REMOVE_SUCCESS,
    MEMO_REMOVE,
    MEMO_REMOVE_FAILURE,
    MEMO_STAR,
    MEMO_STAR_SUCCESS,
    MEMO_STAR_FAILURE
} from './ActionTypes';
import axios from 'axios';

/**
 * 
 * @param { string } contents 
 */
export function memoPostRequest(contents) {
    return (dispatch) => {
        // to be implemented ..
        // inform MEMO POST API is starting..
        dispatch(memoPost());

        return axios.post('/api/memo/', {contents})
        .then((response) => {
            dispatch(memoPostSuccess());
        }).catch((error) => {
            dispatch(memoPostFailure(error.response.data.code));
        });
    };
}

export function memoPost() {
    return {
        type: MEMO_POST
    };
}

export function memoPostSuccess(){
    return {
        type: MEMO_POST_SUCCESS
    };
}

export function memoPostFailure(error){
    return {
        type: MEMO_POST_FAILURE,
        error
    };
}

/**
 * MEMO LIST
 * @param { boolean } isInitial : whether it is for initial loading
 * @param { string } listType  : OPTIONAL; loading 'old' memo or 'new' memo
 * @param { string } id        : OPTIONAL; memo id (one at the bottom or one at the top)
 * @param { string } username  : OPTIONAL; find memos of following user
 */
export function memoListRequest(isInitial, listType, id, username){
    return (dispatch) => {
        // inform memo list API is starting..
        dispatch(memoList());

        let url = '/api/memo';

        console.log('action : ' + isInitial);

        if(typeof username === 'undefined'){
            // username not given, load public memo
            url = isInitial ? url : `${url}/${listType}/${id}`;
            // or url + '/' + listType + '/' + id
        } else {
            // load memos of specific user
            url = isInitial ? `${url}/${username}` : `${url}/${username}/${listType}/${id}`;
        }

        return axios.get(url)
        .then((response) => {
            dispatch(memoListSuccess(response.data, isInitial, listType));
        }).catch((err) => {
            dispatch(memoListFailure());
        })
    }
}

export function memoList(){
    return {
        type: MEMO_LIST
    };
}

export function memoListSuccess(data, isInitial, listType) {
    console.log('memoListSuccess : ' + isInitial);
    return {
        type: MEMO_LIST_SUCCESS,
        data,
        isInitial,
        listType
    };
}

export function memoListFailure() {
    return {
        type: MEMO_LIST_FAILURE
    }
}
/**
 * 
 * @param { string } id 데이터베이스에 있는 메모 기본키
 * @param { number } index 바꿀 메모를 지정하기 위한 인덱스
 * @param { string } contents 바뀐 메모의 내용
 */
export function memoEditRequest(id, index, contents) {
    return (dispatch) => {
        // to be implemented ..
        dispatch(memoEdit());

        return axios.put(`/api/memo/${id}`, { contents })
        .then((response) => {
            dispatch(memoEditSuccess(index, response.data.memo));
        }).catch((error) => {
            dispatch(memoEditFailure(error.response.data.code));
        })
    }
}

export function memoEdit(){
    return {
        type: MEMO_EDIT
    }
}

export function memoEditSuccess(index, memo){
    return {
        type: MEMO_EDIT_SUCCESS,
        index,
        memo
    }
}

export function memoEditFailure(error){
    return {
        type: MEMO_EDIT_FALIURE,
        error
    }
}

/**
 *  MEMO REMOVE
 * @param { string } id 삭제할 데이터의 DB primary key
 * @param { number } index 삭제가 성공했을 때 redux-store에 제거할 데이터의 인덱스
 */
export function memoRemoveRequest(id, index){
    return (dispatch) => {
        // to be implemented ..
        dispatch(memoRemove());

        return axios.delete(`/api/memo/${id}`)
        .then((response) => {
            dispatch(memoRemoveSuccess(index));
        }).catch((error) => {
            dispatch(memoRemoveFailure(error.response.data.code));
        });
    }
}

export function memoRemove() {
    return {
        type: MEMO_REMOVE
    };
}

/**
 * 
 * @param { number } index 삭제된 데이터의 인덱스
 */
export function memoRemoveSuccess(index) {
    return {
        type: MEMO_REMOVE_SUCCESS,
        index
    };
}

/**
 * 
 * @param { number } error 에러 코드
 */
export function memoRemoveFailure(error) {
    return {
        type: MEMO_REMOVE_FAILURE,
        error
    };
}

/**
 * 
 * @param { string } id 
 * @param { number } index 
 */
export function memoStarRequest(id, index) {
    return (dispatch) => {
        // to be implemented ..
        dispatch(memoStar());

        return axios.post(`/api/memo/star/${id}`)
        .then((response) => {
            dispatch(memoSuccess(index, response.data.memo));
        }).catch((error) => {
            dispatch(memoStarFailure(error.response.data.code))
        })
    }
}

export function memoStar(){
    return {
        type: MEMO_STAR
    };
}

/**
 * 
 * @param { number } index 별점을 바꿔줄 데이터의 인덱스
 * @param { * } memo    별점을 바꿔줄 데이터
 */
export function memoStarSuccess(index, memo) {
    return {
        type: MEMO_STAR_SUCCESS,
        index
    };
}

/**
 * 
 * @param { number } error 
 */
export function memoStarFailure(error) {
    return {
        type: MEMO_STAR_FAILURE,
        error
    };
}

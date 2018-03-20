import { USER_SEARCH, USER_SEARCH_SUCCESS, USER_SEARCH_FAILURE } from './ActionTypes';
import axios from 'axios';



export function searchRequest(keyword){
    return (dispatch) => {
        dispatch(search());

        return axios.get(`/api/account/search/${keyword}`)
        .then((response) => {
            dispatch(searchSuccess(response.data));
        }).catch((err) => {
            dispatch(searchFailure(err));
        })
    }
}

export function search(){
    return {
        type: USER_SEARCH
    };
}

export function searchSuccess(usernames){
    return {
        type: USER_SEARCH_SUCCESS,
        usernames
    };
}

export function searchFailure(error){
    return {
        type: USER_SEARCH_FAILURE,
        error
    };
}
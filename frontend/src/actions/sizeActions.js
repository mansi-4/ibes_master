import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { USER_LOGIN_SUCCESS } from '../constants/userConstants';

import {
    SIZE_LIST_REQUEST, 
    SIZE_LIST_SUCCESS,
    SIZE_LIST_FAIL,

    SIZE_DETAILS_REQUEST,
    SIZE_DETAILS_SUCCESS,
    SIZE_DETAILS_FAIL,

    SIZE_DELETE_REQUEST,
    SIZE_DELETE_SUCCESS,
    SIZE_DELETE_FAIL,

    SIZE_CREATE_REQUEST,
    SIZE_CREATE_SUCCESS,
    SIZE_CREATE_FAIL,
    SIZE_CREATE_RESET,

    SIZE_UPDATE_REQUEST,
    SIZE_UPDATE_SUCCESS,
    SIZE_UPDATE_FAIL,
    SIZE_UPDATE_RESET,

    
} from '../constants/sizeConstants'
const BASEURL = 'https://ibes.offlinetoonline.in';

export const listSizes = () => async (dispatch) => {
    try{
        dispatch({type:SIZE_LIST_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/sizes/`)
        dispatch({
            type:SIZE_LIST_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:SIZE_LIST_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const listSizeDetails = (id) =>async (dispatch) => {
    try{
        dispatch({type:SIZE_DETAILS_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/sizes/${id}`)
        dispatch({
            type:SIZE_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:SIZE_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const deleteSize = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SIZE_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        // decode the access token to check if it has expired
        const decodedToken = jwt_decode(userInfo.access_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            try{
                const refreshConfig = {
                    headers: {
                        Authorization: userInfo.refresh_token,
                    },
                };
                    const { data: refreshData } = await axios.post(
                    `${BASEURL}/api/users/refresh_token`,
                    null,
                    refreshConfig
                    );
    
                    // update the access token in localStorage and userInfo object
                    const userInfoObj = localStorage.getItem('userInfo');
                    const userInfoJson = JSON.parse(userInfoObj);
                    userInfoJson.access_token = refreshData.access_token;
                    localStorage.setItem('userInfo', JSON.stringify(userInfoJson));
                    dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: {
                        _id: userInfoJson._id,
                        name: userInfoJson.name,
                        email: userInfoJson.email,
                        basic: userInfoJson.basic,
                        access_token: userInfoJson.access_token,
                        refresh_token: userInfoJson.refresh_token,
                    },
                    });
                    // make the actual api call with the new access token
                    const config = {
                        headers: {
                        Authorization: refreshData.access_token,
                        },
                    };
                    const { data } = await axios.delete(
                        `${BASEURL}/api/sizes/delete/${id}/`,
                        config
                    )
                    dispatch({
                        type: SIZE_DELETE_SUCCESS,
                    })
            }catch (refreshError) {
                dispatch({
                    type: SIZE_DELETE_FAIL,
                    payload: refreshError.response && refreshError.response.data.detail
                        ? refreshError.response.data.detail
                        : refreshError.message,
                })
            }
        }
        else{
            const config = {
                headers: {
                    Authorization: userInfo.access_token
                }
            }
            const { data } = await axios.delete(
                `${BASEURL}/api/sizes/delete/${id}/`,
                config
            )
            dispatch({
                type: SIZE_DELETE_SUCCESS,
            })
        }
    } catch (error) {
        dispatch({
            type: SIZE_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const createSize = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: SIZE_CREATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()
        // decode the access token to check if it has expired
        const decodedToken = jwt_decode(userInfo.access_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            try{
                const refreshConfig = {
                    headers: {
                        Authorization: userInfo.refresh_token,
                    },
                };
                    const { data: refreshData } = await axios.post(
                    `${BASEURL}/api/users/refresh_token`,
                    null,
                    refreshConfig
                    );
    
                    // update the access token in localStorage and userInfo object
                    const userInfoObj = localStorage.getItem('userInfo');
                    const userInfoJson = JSON.parse(userInfoObj);
                    userInfoJson.access_token = refreshData.access_token;
                    localStorage.setItem('userInfo', JSON.stringify(userInfoJson));
                    dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: {
                        _id: userInfoJson._id,
                        name: userInfoJson.name,
                        email: userInfoJson.email,
                        basic: userInfoJson.basic,
                        access_token: userInfoJson.access_token,
                        refresh_token: userInfoJson.refresh_token,
                    },
                    });
                    // make the actual api call with the new access token
                    const config = {
                        headers: {
                            Authorization: refreshData.access_token
                        }
                    }
            
                    const { data } = await axios.post(
                        `${BASEURL}/api/sizes/create/`,
                        {},
                        config
                    )
                    dispatch({
                        type: SIZE_CREATE_SUCCESS,
                        payload: data,
                    })
            }catch(refreshError) {
                dispatch({
                    type: SIZE_CREATE_FAIL,
                    payload: refreshError.response && refreshError.response.data.detail
                        ? refreshError.response.data.detail
                        : refreshError.message,
                })
            }
        }else{
            const config = {
                headers: {
                    Authorization: userInfo.access_token
                }
            }
    
            const { data } = await axios.post(
                `${BASEURL}/api/sizes/create/`,
                {},
                config
            )
            dispatch({
                type: SIZE_CREATE_SUCCESS,
                payload: data,
            })
        }
    } catch (error) {
        dispatch({
            type: SIZE_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateSize = (size) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SIZE_UPDATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()
        // decode the access token to check if it has expired
        const decodedToken = jwt_decode(userInfo.access_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            try{
                const refreshConfig = {
                    headers: {
                        Authorization: userInfo.refresh_token,
                    },
                };
                    const { data: refreshData } = await axios.post(
                    `${BASEURL}/api/users/refresh_token`,
                    null,
                    refreshConfig
                    );
                    // update the access token in localStorage and userInfo object
                    const userInfoObj = localStorage.getItem('userInfo');
                    const userInfoJson = JSON.parse(userInfoObj);
                    userInfoJson.access_token = refreshData.access_token;
                    localStorage.setItem('userInfo', JSON.stringify(userInfoJson));
                    dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: {
                        _id: userInfoJson._id,
                        name: userInfoJson.name,
                        email: userInfoJson.email,
                        basic: userInfoJson.basic,
                        access_token: userInfoJson.access_token,
                        refresh_token: userInfoJson.refresh_token,
                    },
                    });
                    // make the actual api call with the new access token
                const config = {
                    headers: {
                        Authorization: refreshData.access_token
                    }
                }
                const { data } = await axios.put(
                    `${BASEURL}/api/sizes/update/${size.id}/`,
                    size,
                    config
                )
                dispatch({
                    type: SIZE_UPDATE_SUCCESS,
                    payload: data,
                })
                dispatch({
                    type: SIZE_DETAILS_SUCCESS,
                    payload: data
                })
            }catch (refreshError) {
                dispatch({
                    type: SIZE_UPDATE_FAIL,
                    payload: refreshError.response && refreshError.response.data.detail
                        ? refreshError.response.data.detail
                        : refreshError.message,
                })
            }
        }else{
            const config = {
                headers: {
                    Authorization: userInfo.access_token
                }
            }
            const { data } = await axios.put(
                `${BASEURL}/api/sizes/update/${size.id}/`,
                size,
                config
            )
            dispatch({
                type: SIZE_UPDATE_SUCCESS,
                payload: data,
            })
            dispatch({
                type: SIZE_DETAILS_SUCCESS,
                payload: data
            })
        }
    } catch (error) {
        dispatch({
            type: SIZE_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
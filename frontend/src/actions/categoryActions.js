import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { USER_LOGIN_SUCCESS } from '../constants/userConstants';

import {
    CATEGORY_LIST_REQUEST, 
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,

    CATEGORY_DETAILS_REQUEST,
    CATEGORY_DETAILS_SUCCESS,
    CATEGORY_DETAILS_FAIL,

    CATEGORY_DELETE_REQUEST,
    CATEGORY_DELETE_SUCCESS,
    CATEGORY_DELETE_FAIL,

    CATEGORY_CREATE_REQUEST,
    CATEGORY_CREATE_SUCCESS,
    CATEGORY_CREATE_FAIL,
    CATEGORY_CREATE_RESET,

    CATEGORY_UPDATE_REQUEST,
    CATEGORY_UPDATE_SUCCESS,
    CATEGORY_UPDATE_FAIL,
    CATEGORY_UPDATE_RESET,

    
} from '../constants/categoryConstants'
const BASEURL = 'http://localhost:8003';

export const listCategories = () => async (dispatch) => {
    try{
        dispatch({type:CATEGORY_LIST_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/categories/`)
        dispatch({
            type:CATEGORY_LIST_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:CATEGORY_LIST_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const listCategoryDetails = (id) =>async (dispatch) => {
    try{
        dispatch({type:CATEGORY_DETAILS_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/categories/${id}`)
        dispatch({
            type:CATEGORY_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:CATEGORY_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const deleteCategory = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CATEGORY_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()
        // decode the access token to check if it has expired
        const decodedToken = jwt_decode(userInfo.access_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            try{const refreshConfig = {
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
        
                const { data } = await axios.delete(
                    `${BASEURL}/api/categories/delete/${id}/`,
                    config
                )
        
                dispatch({
                    type: CATEGORY_DELETE_SUCCESS,
                })
            }catch (error) {
                dispatch({
                    type: CATEGORY_DELETE_FAIL,
                    payload: error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message,
                })
            }
        }else{
            const config = {
                headers: {
                    Authorization: userInfo.access_token
                }
            }
    
            const { data } = await axios.delete(
                `${BASEURL}/api/categories/delete/${id}/`,
                config
            )
    
            dispatch({
                type: CATEGORY_DELETE_SUCCESS,
            })
        }
        
    } catch (error) {
        dispatch({
            type: CATEGORY_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const createCategory = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: CATEGORY_CREATE_REQUEST
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
                    `${BASEURL}/api/categories/create/`,
                    {},
                    config
                )
                dispatch({
                    type: CATEGORY_CREATE_SUCCESS,
                    payload: data,
                })
        
            }catch (refreshError) {
                dispatch({
                    type: CATEGORY_CREATE_FAIL,
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
                `${BASEURL}/api/categories/create/`,
                {},
                config
            )
            dispatch({
                type: CATEGORY_CREATE_SUCCESS,
                payload: data,
            })
    
        }
    } catch (error) {
        dispatch({
            type: CATEGORY_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateCategory = (category) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CATEGORY_UPDATE_REQUEST
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
                        `${BASEURL}/api/categories/update/${category.id}/`,
                        category,
                        config
                    )
                    dispatch({
                        type: CATEGORY_UPDATE_SUCCESS,
                        payload: data,
                    })
            
            
                    dispatch({
                        type: CATEGORY_DETAILS_SUCCESS,
                        payload: data
                    })
            }catch(refreshError){
                dispatch({
                    type: CATEGORY_UPDATE_FAIL,
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
                `${BASEURL}/api/categories/update/${category.id}/`,
                category,
                config
            )
            dispatch({
                type: CATEGORY_UPDATE_SUCCESS,
                payload: data,
            })
    
    
            dispatch({
                type: CATEGORY_DETAILS_SUCCESS,
                payload: data
            })
        }
} catch (error) {
        dispatch({
            type: CATEGORY_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
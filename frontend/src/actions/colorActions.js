import axios from 'axios'
import {
    COLOR_LIST_REQUEST, 
    COLOR_LIST_SUCCESS,
    COLOR_LIST_FAIL,

    COLOR_DETAILS_REQUEST,
    COLOR_DETAILS_SUCCESS,
    COLOR_DETAILS_FAIL,

    COLOR_DELETE_REQUEST,
    COLOR_DELETE_SUCCESS,
    COLOR_DELETE_FAIL,

    COLOR_CREATE_REQUEST,
    COLOR_CREATE_SUCCESS,
    COLOR_CREATE_FAIL,
    COLOR_CREATE_RESET,

    COLOR_UPDATE_REQUEST,
    COLOR_UPDATE_SUCCESS,
    COLOR_UPDATE_FAIL,
    COLOR_UPDATE_RESET,

    
} from '../constants/colorConstants'
import jwt_decode from 'jwt-decode'
import { USER_LOGIN_SUCCESS } from '../constants/userConstants';
const BASEURL = 'https://ibes.offlinetoonline.in';

export const listColors = () => async (dispatch) => {
    try{
        dispatch({type:COLOR_LIST_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/colors/`)
        dispatch({
            type:COLOR_LIST_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:COLOR_LIST_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const listColorDetails = (id) =>async (dispatch) => {
    try{
        dispatch({type:COLOR_DETAILS_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/colors/${id}`)
        dispatch({
            type:COLOR_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:COLOR_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const deleteColor = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COLOR_DELETE_REQUEST
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
          
                  // make the actual api call to list users with the new access token
                  const config = {
                    headers: {
                      Authorization: refreshData.access_token,
                    },
                  };
                  const { data } = await axios.delete(
                    `${BASEURL}/api/colors/delete/${id}/`,
                    config
                )
        
                dispatch({
                    type: COLOR_DELETE_SUCCESS,
                })
            }catch(refreshError){
                dispatch({
                    type: COLOR_DELETE_FAIL,
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
    
            const { data } = await axios.delete(
                `${BASEURL}/api/colors/delete/${id}/`,
                config
            )
    
            dispatch({
                type: COLOR_DELETE_SUCCESS,
            })
        }

    } catch (error) {
        dispatch({
            type: COLOR_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const createColor = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: COLOR_CREATE_REQUEST
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
                        `${BASEURL}/api/colors/create/`,
                        {},
                        config
                    )
                    dispatch({
                        type: COLOR_CREATE_SUCCESS,
                        payload: data,
                    })
            }catch (refreshError) {
                dispatch({
                    type: COLOR_CREATE_FAIL,
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
    
            const { data } = await axios.post(
                `${BASEURL}/api/colors/create/`,
                {},
                config
            )
            dispatch({
                type: COLOR_CREATE_SUCCESS,
                payload: data,
            })
        }
    } catch (error) {
        dispatch({
            type: COLOR_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateColor = (color) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COLOR_UPDATE_REQUEST
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
                    `${BASEURL}/api/colors/update/${color.id}/`,
                    color,
                    config
                )
                dispatch({
                    type: COLOR_UPDATE_SUCCESS,
                    payload: data,
                })
                dispatch({
                    type: COLOR_DETAILS_SUCCESS,
                    payload: data
                })
            }catch (refreshError) {
                dispatch({
                    type: COLOR_UPDATE_FAIL,
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
                `${BASEURL}/api/colors/update/${color.id}/`,
                color,
                config
            )
            dispatch({
                type: COLOR_UPDATE_SUCCESS,
                payload: data,
            })
            dispatch({
                type: COLOR_DETAILS_SUCCESS,
                payload: data
            })
        }
    } catch (error) {
        dispatch({
            type: COLOR_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
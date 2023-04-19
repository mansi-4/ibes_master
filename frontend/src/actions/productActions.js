import axios from 'axios'
import {
    USER_LOGIN_SUCCESS
} from '../constants/userConstants'
import {
   PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,

    PRODUCT_DISTINCT_DETAILS_REQUEST,
    PRODUCT_DISTINCT_DETAILS_SUCCESS,
    PRODUCT_DISTINCT_DETAILS_FAIL,

    PRODUCT_SIZE_BY_COLOR_REQUEST,
    PRODUCT_SIZE_BY_COLOR_SUCCESS,
    PRODUCT_SIZE_BY_COLOR_FAIL,

    PRODUCT_VARIATION_BY_SIZE_REQUEST,
    PRODUCT_VARIATION_BY_SIZE_SUCCESS,
    PRODUCT_VARIATION_BY_SIZE_FAIL,

    PRODUCT_VARIATION_DETAILS_REQUEST,
    PRODUCT_VARIATION_DETAILS_SUCCESS,
    PRODUCT_VARIATION_DETAILS_FAIL,

    PRODUCT_VARIATION_DETAIL_REQUEST,
    PRODUCT_VARIATION_DETAIL_SUCCESS,
    PRODUCT_VARIATION_DETAIL_FAIL,
    PRODUCT_VARIATION_DETAIL_RESET,

    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,

    PRODUCT_VARIATION_DELETE_REQUEST,
    PRODUCT_VARIATION_DELETE_SUCCESS,
    PRODUCT_VARIATION_DELETE_FAIL,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_CREATE_RESET,

    PRODUCT_VARIATION_CREATE_REQUEST,
    PRODUCT_VARIATION_CREATE_SUCCESS,
    PRODUCT_VARIATION_CREATE_FAIL,
    PRODUCT_VARIATION_CREATE_RESET,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_UPDATE_RESET,

    PRODUCT_VARIATION_UPDATE_REQUEST,
    PRODUCT_VARIATION_UPDATE_SUCCESS,
    PRODUCT_VARIATION_UPDATE_FAIL,
    PRODUCT_VARIATION_UPDATE_RESET,

    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_CREATE_REVIEW_RESET,

    PRODUCT_TOP_REQUEST,
    PRODUCT_TOP_SUCCESS,
    PRODUCT_TOP_FAIL,
} from '../constants/productConstants'
import jwt_decode from 'jwt-decode'
const BASEURL = 'https://ibes.offlinetoonline.in';

export const listProducts = (keyword,category_id) => async (dispatch) => {
    try{
        dispatch({type:PRODUCT_LIST_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/products/?keyword=${keyword===undefined?"":keyword}&category_id=${category_id===undefined?"0":category_id}`)
        dispatch({
            type:PRODUCT_LIST_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:PRODUCT_LIST_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const listTopProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_TOP_REQUEST })

        const { data } = await axios.get(`${BASEURL}/api/products/top/`)

        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_TOP_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const listProductDetails = (id) =>async (dispatch) => {
    try{
        dispatch({type:PRODUCT_DETAILS_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/products/${id}`)
        dispatch({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listDistinctProductDetails = (id) =>async (dispatch) => {
    try{
        dispatch({type:PRODUCT_DISTINCT_DETAILS_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/products/${id}/distinct`)
        dispatch({
            type:PRODUCT_DISTINCT_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_DISTINCT_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listProductSizesByColor = (obj) =>async (dispatch) => {
    try{
        dispatch({type:PRODUCT_SIZE_BY_COLOR_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/products/size_by_color/`,{params: {
            color_id: obj.color_id,
            product_id: obj.product_id 
          }})
        dispatch({
            type:PRODUCT_SIZE_BY_COLOR_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_SIZE_BY_COLOR_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listProductVariationBySize = (obj) =>async (dispatch) => {
    try{
        dispatch({type:PRODUCT_VARIATION_BY_SIZE_REQUEST})
        const {data} = await axios.get(`${BASEURL}/api/products/variation_by_size/`,{params: {
            size_id: obj.size_id,
            color_id:obj.color_id,
            product_id: obj.product_id 
          }})
        dispatch({
            type:PRODUCT_VARIATION_BY_SIZE_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_VARIATION_BY_SIZE_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

//authentication apis
export const listProductVariationDetails = (id) =>async (dispatch,getState) => {
    try{
        dispatch({type:PRODUCT_VARIATION_DETAILS_REQUEST})
        const {
            userLogin: { userInfo },
        } = getState()

        // decode the access token to check if it has expired
        const decodedToken = jwt_decode(userInfo.access_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            // access token has expired, try to refresh it
            try {
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
                const {data} = await axios.get(`${BASEURL}/api/products/${id}/variations`,config)
                dispatch({
                    type:PRODUCT_VARIATION_DETAILS_SUCCESS,
                    payload:data
                })
            }catch (refreshError) {
                dispatch({
                    type:PRODUCT_VARIATION_DETAILS_FAIL,
                    payload:refreshError.response && refreshError.response.data.detail 
                    ? refreshError.response.data.detail 
                    : refreshError.message,
                })
            }
        }
        else{
            // access token is still valid, make the api call
            const config = {
                headers: {
                    Authorization: userInfo.access_token
                }
            }
            const {data} = await axios.get(`${BASEURL}/api/products/${id}/variations`,config)
            dispatch({
                type:PRODUCT_VARIATION_DETAILS_SUCCESS,
                payload:data
            })
        }
    }catch(error){ 
        dispatch({
            type:PRODUCT_VARIATION_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listProductVariationDetail = (id) =>async (dispatch,getState) => {
    try{
        dispatch({type:PRODUCT_VARIATION_DETAIL_REQUEST})
        const {
            userLogin: { userInfo },
        } = getState()
        // decode the access token to check if it has expired
        const decodedToken = jwt_decode(userInfo.access_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            // access token has expired, try to refresh it
            try {
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
                const {data} = await axios.get(`${BASEURL}/api/products/${id}/variation`,config)
                dispatch({
                    type:PRODUCT_VARIATION_DETAIL_SUCCESS,
                    payload:data
                })
            }catch(refreshError){
                dispatch({
                    type:PRODUCT_VARIATION_DETAIL_FAIL,
                    payload:refreshError.response && refreshError.response.data.detail 
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
            const {data} = await axios.get(`${BASEURL}/api/products/${id}/variation`,config)
            dispatch({
                type:PRODUCT_VARIATION_DETAIL_SUCCESS,
                payload:data
            })
        }
        
    }catch(error){ 
        dispatch({
            type:PRODUCT_VARIATION_DETAIL_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST
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
                        `${BASEURL}/api/products/delete/${id}/`,
                        config
                    )
            
                    dispatch({
                        type: PRODUCT_DELETE_SUCCESS,
                    })
            }catch(refreshError){
                dispatch({
                    type: PRODUCT_DELETE_FAIL,
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
                `${BASEURL}/api/products/delete/${id}/`,
                config
            )
    
            dispatch({
                type: PRODUCT_DELETE_SUCCESS,
            })
        }
        


    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const deleteProductVariation = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_VARIATION_DELETE_REQUEST
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
                        `${BASEURL}/api/products/delete/variation/${id}/`,
                        config
                    )
            
                    dispatch({
                        type: PRODUCT_VARIATION_DELETE_SUCCESS,
                    })

            }catch(refreshError){
                dispatch({
                    type: PRODUCT_VARIATION_DELETE_FAIL,
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
                `${BASEURL}/api/products/delete/variation/${id}/`,
                config
            )
    
            dispatch({
                type: PRODUCT_VARIATION_DELETE_SUCCESS,
            })
        }
        


    } catch (error) {
        dispatch({
            type: PRODUCT_VARIATION_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createProduct = (formData) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REQUEST
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
                    const { data } = await axios.post(
                        `${BASEURL}/api/products/create/`,
                        formData,
                        config
                    )
                    dispatch({
                        type: PRODUCT_CREATE_SUCCESS,
                        payload: data,
                    })
            }catch(refreshError){
                dispatch({
                    type: PRODUCT_CREATE_FAIL,
                    payload: refreshError.response && refreshError.response.data.detail
                        ? refreshError.response.data.detail
                        : refreshError.message,
                })
            }
        }else{
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: userInfo.access_token
                }
            }
            const { data } = await axios.post(
                `${BASEURL}/api/products/create/`,
                formData,
                config
            )
            dispatch({
                type: PRODUCT_CREATE_SUCCESS,
                payload: data,
            })
        }
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createProductVariation = (variation) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_VARIATION_CREATE_REQUEST
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
                    const { data } = await axios.post(
                        `${BASEURL}/api/products/${variation.product_id}/create_variation/`,
                        variation,
                        config
                    )
                    dispatch({
                        type: PRODUCT_VARIATION_CREATE_SUCCESS,
                        payload: data,
                    })
            }catch(refreshError){
                dispatch({
                    type: PRODUCT_VARIATION_CREATE_FAIL,
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
                `${BASEURL}/api/products/${variation.product_id}/create_variation/`,
                variation,
                config
            )
            dispatch({
                type: PRODUCT_VARIATION_CREATE_SUCCESS,
                payload: data,
            })
        }
        


    } catch (error) {
        dispatch({
            type: PRODUCT_VARIATION_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST
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
                    const { data } = await axios.put(
                        `${BASEURL}/api/products/update/${product._id}/`,
                        product,
                        config
                    )
                    dispatch({
                        type: PRODUCT_UPDATE_SUCCESS,
                        payload: data,
                    })
            
            
                    dispatch({
                        type: PRODUCT_DETAILS_SUCCESS,
                        payload: data
                    })

            }catch(refreshError){
                dispatch({
                    type: PRODUCT_UPDATE_FAIL,
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
                `${BASEURL}/api/products/update/${product._id}/`,
                product,
                config
            )
            dispatch({
                type: PRODUCT_UPDATE_SUCCESS,
                payload: data,
            })
    
    
            dispatch({
                type: PRODUCT_DETAILS_SUCCESS,
                payload: data
            })
        }
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateProductVariation = (variation) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_VARIATION_UPDATE_REQUEST
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
                    const { data } = await axios.put(
                        `${BASEURL}/api/products/update/variation/${variation.product_variation_id}/`,
                        variation,
                        config
                    )
                    dispatch({
                        type: PRODUCT_VARIATION_UPDATE_SUCCESS,
                        payload: data,
                    })
            }catch(refreshError){
                dispatch({
                    type: PRODUCT_VARIATION_UPDATE_FAIL,
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
                `${BASEURL}/api/products/update/variation/${variation.product_variation_id}/`,
                variation,
                config
            )
            dispatch({
                type: PRODUCT_VARIATION_UPDATE_SUCCESS,
                payload: data,
            })
    
    
            // dispatch({
            //     type: PRODUCT_VARIATION_DETAILS_SUCCESS,
            //     payload: data
            // })
        }
    } catch (error) {
        dispatch({
            type: PRODUCT_VARIATION_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_REQUEST
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
                    const { data } = await axios.post(
                        `${BASEURL}/api/products/${productId}/reviews/`,
                        review,
                        config
                    )
                    dispatch({
                        type: PRODUCT_CREATE_REVIEW_SUCCESS,
                        payload: data,
                    })
            }catch(refreshError){
                dispatch({
                    type: PRODUCT_CREATE_REVIEW_FAIL,
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
                `${BASEURL}/api/products/${productId}/reviews/`,
                review,
                config
            )
            dispatch({
                type: PRODUCT_CREATE_REVIEW_SUCCESS,
                payload: data,
            })
        }
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
import axios from 'axios'
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,

    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,

    
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,

    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_MY_RESET,

    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,

    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_RESET,

    CUSTOMER_ORDER_CREATE_REQUEST,
    CUSTOMER_ORDER_CREATE_SUCCESS,
    CUSTOMER_ORDER_CREATE_FAIL,

    CUSTOMER_ORDER_DETAILS_REQUEST,
    CUSTOMER_ORDER_DETAILS_SUCCESS,
    CUSTOMER_ORDER_DETAILS_FAIL,

    CUSTOMER_ORDER_LIST_REQUEST,
    CUSTOMER_ORDER_LIST_SUCCESS,
    CUSTOMER_ORDER_LIST_FAIL,
} from "../constants/orderConstants"
import {
    
    CART_CLEAR_ITEMS,
} from "../constants/cartConstants"
import {
    USER_LOGIN_SUCCESS
} from '../constants/userConstants'
import jwt_decode from 'jwt-decode'
const BASEURL = 'http://localhost:8003';

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
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
                        `${BASEURL}/api/orders/add/`,
                        order,
                        config
                    )
            
                    dispatch({
                        type: ORDER_CREATE_SUCCESS,
                        payload: data
                    })
            
                    dispatch({
                        type: CART_CLEAR_ITEMS,
                        payload: data
                    })
            
                    localStorage.removeItem('cartItems')

            }catch(refreshError){
                dispatch({
                    type: ORDER_CREATE_FAIL,
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
                `${BASEURL}/api/orders/add/`,
                order,
                config
            )
    
            dispatch({
                type: ORDER_CREATE_SUCCESS,
                payload: data
            })
    
            dispatch({
                type: CART_CLEAR_ITEMS,
                payload: data
            })
    
            localStorage.removeItem('cartItems')
    
        }
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
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
                    const { data } = await axios.get(
                        `${BASEURL}/api/orders/${id}/`,
                        config
                    )
            
                    dispatch({
                        type: ORDER_DETAILS_SUCCESS,
                        payload: data
                    })
            }catch(refreshError){
                dispatch({
                    type: ORDER_DETAILS_FAIL,
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
    
            const { data } = await axios.get(
                `${BASEURL}/api/orders/${id}/`,
                config
            )
    
            dispatch({
                type: ORDER_DETAILS_SUCCESS,
                payload: data
            })
        }
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const payOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
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
                        `${BASEURL}/api/orders/${id}/pay/`,
                        {},
                        config
                    )
            
                    dispatch({
                        type: ORDER_PAY_SUCCESS,
                        payload: data
                    })
            }catch(refreshError){
                dispatch({
                    type: ORDER_PAY_FAIL,
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
                `${BASEURL}/api/orders/${id}/pay/`,
                {},
                config
            )
    
            dispatch({
                type: ORDER_PAY_SUCCESS,
                payload: data
            })
        }
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const deliverOrder = (id,obj) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST
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
                        `${BASEURL}/api/orders/${id}/deliver/`,
                        {"shipping_status":obj.shipping_status},
                        config
                    )
                    dispatch({
                        type: ORDER_DELIVER_SUCCESS,
                        payload: data
                    })
            }catch(refreshError){
                dispatch({
                    type: ORDER_DELIVER_FAIL,
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
                `${BASEURL}/api/orders/${id}/deliver/`,
                {"shipping_status":obj.shipping_status},
                config
            )
            dispatch({
                type: ORDER_DELIVER_SUCCESS,
                payload: data
            })
        }
        

    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST
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
                    const { data } = await axios.get(
                        `${BASEURL}/api/orders/myorders/`,
                        config
                    )
            
                    dispatch({
                        type: ORDER_LIST_MY_SUCCESS,
                        payload: data
                    })

            }catch(refreshError){
                dispatch({
                    type: ORDER_LIST_MY_FAIL,
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
    
            const { data } = await axios.get(
                `${BASEURL}/api/orders/myorders/`,
                config
            )
    
            dispatch({
                type: ORDER_LIST_MY_SUCCESS,
                payload: data
            })
        }
        

    } catch (error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_REQUEST
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
                    const { data } = await axios.get(
                        `${BASEURL}/api/orders/`,
                        config
                    )
                    dispatch({
                        type: ORDER_LIST_SUCCESS,
                        payload: data
                    })
            }catch(refreshError){
                dispatch({
                    type: ORDER_LIST_FAIL,
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
    
            const { data } = await axios.get(
                `${BASEURL}/api/orders/`,
                config
            )
            dispatch({
                type: ORDER_LIST_SUCCESS,
                payload: data
            })
        }
        

    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createCustomerOrder = (customer_order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CUSTOMER_ORDER_CREATE_REQUEST
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
                        `${BASEURL}/api/customer_orders/add/`,
                        customer_order,
                        config
                    )
            
                    dispatch({
                        type: CUSTOMER_ORDER_CREATE_SUCCESS,
                        payload: data
                    })

            }catch(refreshError){
                dispatch({
                    type: CUSTOMER_ORDER_CREATE_FAIL,
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
                `${BASEURL}/api/customer_orders/add/`,
                customer_order,
                config
            )
    
            dispatch({
                type: CUSTOMER_ORDER_CREATE_SUCCESS,
                payload: data
            })
    
            // dispatch({
            //     type: CART_CLEAR_ITEMS,
            //     payload: data
            // })
    
            // localStorage.removeItem('cartItems')
        }
    } catch (error) {
        dispatch({
            type: CUSTOMER_ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getCustomerOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CUSTOMER_ORDER_DETAILS_REQUEST
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
                    const { data } = await axios.get(
                        `${BASEURL}/api/customer_orders/${id}/`,
                        config
                    )
            
                    dispatch({
                        type: CUSTOMER_ORDER_DETAILS_SUCCESS,
                        payload: data
                    })

            }catch(refreshError){
                dispatch({
                    type: CUSTOMER_ORDER_DETAILS_FAIL,
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
    
            const { data } = await axios.get(
                `${BASEURL}/api/customer_orders/${id}/`,
                config
            )
    
            dispatch({
                type: CUSTOMER_ORDER_DETAILS_SUCCESS,
                payload: data
            })
        }
        

    } catch (error) {
        dispatch({
            type: CUSTOMER_ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listCustomerOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: CUSTOMER_ORDER_LIST_REQUEST
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
                    const { data } = await axios.get(
                        `${BASEURL}/api/customer_orders/`,
                        config
                    )
                    dispatch({
                        type: CUSTOMER_ORDER_LIST_SUCCESS,
                        payload: data
                    })
            }catch(refreshError){
                dispatch({
                    type: CUSTOMER_ORDER_LIST_FAIL,
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
    
            const { data } = await axios.get(
                `${BASEURL}/api/customer_orders/`,
                config
            )
            dispatch({
                type: CUSTOMER_ORDER_LIST_SUCCESS,
                payload: data
            })
        }
    } catch (error) {
        dispatch({
            type: CUSTOMER_ORDER_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
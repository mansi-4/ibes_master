import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    
    USER_LOGOUT,
    
    USER_REGISTER_REQUEST,
    USER_REGISTER_FAIL,
    USER_REGISTER_SUCCESS,

    USER_ACTIVATION_REQUEST,
    USER_ACTIVATION_FAIL,
    USER_ACTIVATION_SUCCESS,

    USER_REACTIVATION_REQUEST,
    USER_REACTIVATION_FAIL,
    USER_REACTIVATION_SUCCESS,
    
    USER_VERIFY_REQUEST,
    USER_VERIFY_FAIL,
    USER_VERIFY_SUCCESS,

    USER_DETAILS_REQUEST,
    USER_DETAILS_FAIL,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_RESET,

    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_RESET,

    USER_UPDATE_PASSWORD_REQUEST,
    USER_UPDATE_PASSWORD_SUCCESS,
    USER_UPDATE_PASSWORD_FAIL,
    USER_UPDATE_PASSWORD_RESET,

    USER_LIST_REQUEST,
    USER_LIST_FAIL,
    USER_LIST_SUCCESS,
    USER_LIST_RESET,

    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,

    USER_UPDATE_REQUEST,
    USER_UPDATE_FAIL,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_RESET,

    TOKEN_RENEW_REQUEST,
    TOKEN_RENEW_FAIL,
    TOKEN_RENEW_SUCCESS,

} from '../constants/userConstants'
import {ORDER_LIST_MY_RESET} from '../constants/orderConstants'
import axios from 'axios'
import { CART_CLEAR_ITEMS } from '../constants/cartConstants'
import jwt_decode from 'jwt-decode'

export const login = (email,password) => async (dispatch) => {
    try{
        dispatch({
            type:USER_LOGIN_REQUEST
        })
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data} = await axios.post(
            "http://localhost:8003/api/users/login",
            {'email':email,'password':password},
            config
            )
        dispatch({
            type:USER_LOGIN_SUCCESS,
            payload:data
        })
        
        localStorage.setItem("userInfo",JSON.stringify(data))

    }catch(error){
        console.log(error)
        dispatch({
            type:USER_LOGIN_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}
export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo")
    dispatch({
        type:USER_LOGOUT
    })
    dispatch({
        type:USER_DETAILS_RESET
    })
    dispatch({
        type:ORDER_LIST_MY_RESET
    })
    dispatch({
        type:USER_LIST_RESET
    })
    dispatch({
        type:CART_CLEAR_ITEMS
    })

} 


export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })

        

        const { data } = await axios.post(
            'http://localhost:8003/api/users/register',
            { 'name': name, 'email': email, 'password': password },
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

        // dispatch({
        //     type: USER_LOGIN_SUCCESS,
        //     payload: data
        // })

        // localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const activateUser = (token) => async (dispatch) => {
    try {
        dispatch({
            type: USER_ACTIVATION_REQUEST
        })
        
        const { data } = await axios.put(
            'http://localhost:8003/api/users/activate_user',
            {"token":token}
        )

        dispatch({
            type: USER_ACTIVATION_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: USER_ACTIVATION_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const reActivateUser = (user_id) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REACTIVATION_REQUEST
        })
        
        const { data } = await axios.put(
            'https://ibes.offlinetoonline.in/api/users/re_activate_user',
            {"user_id":user_id}
        )

        dispatch({
            type: USER_REACTIVATION_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: USER_REACTIVATION_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const verifyUser = (email) => async (dispatch) => {
    try {
        dispatch({
            type: USER_VERIFY_REQUEST
        })

        

        const { data } = await axios.post(
            'http://localhost:8003/api/users/verify_user',
            { 'email': email},
        )

        dispatch({
            type: USER_VERIFY_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: USER_VERIFY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getUserDetails = (id) => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
        })
        const {
            userLogin:{userInfo},
        } = getState()

        const config = {
            headers: {
                Authorization :userInfo.token
            }
        }
        const { data } = await axios.get(
            `http://localhost:8003/api/users/${id}`,
            config
        )

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const getUserActivationDetails = (id) => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
        })
        
        const { data } = await axios.get(
            `http://localhost:8003/api/users/${id}`,
           
        )

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



export const updateUserProfile = (user) => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
        })
        
        const {
            userLogin:{userInfo}, 
        } = getState()

        const config = {
            headers: {
                Authorization :userInfo.token
            }
        }
       
        const { data } = await axios.put(
            `http://localhost:8003/api/users/profile_update/`,
            user,
            config
        )

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateUserPassword = (token,password) => async (dispatch,getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PASSWORD_REQUEST
        })
        const config = {
            headers: {
                Authorization :token
            }
        }
      
        const { data } = await axios.put(
            `http://localhost:8003/api/users/password_update/`,
            {'password':password},
            config
            
        )

        dispatch({
            type: USER_UPDATE_PASSWORD_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: USER_UPDATE_PASSWORD_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

// export const listUsers = () => async (dispatch, getState) => {
//     try {
//         dispatch({
//             type: USER_LIST_REQUEST
//         })

//         const {
//             userLogin: { userInfo },
//         } = getState()

//         const config = {
//             headers: {
//                 Authorization: userInfo.token
//             }
//         }

//         const { data } = await axios.get(
//             `http://localhost:8003/api/users/`,
//             config
//         )
//         dispatch({
//             type: USER_LIST_SUCCESS,
//             payload: data
//         })
//     } catch (error) {
//         dispatch({
//             type: USER_LIST_FAIL,
//             payload: error.response && error.response.data.detail
//                 ? error.response.data.detail
//                 : error.message,
//         })
//     }
// }


// export const listUsers = () => async (dispatch, getState) => {
//     try {
//             dispatch({
//                         type: USER_LIST_REQUEST
//                     })
//                     const {
//                         userLogin: { userInfo },
//                     } = getState()
//                     const config = {
//                         headers: {
//                             Authorization: userInfo.access_token
//                         }
//                     }
//                     const { data } = await axios.get(`http://localhost:8003/api/users/`,
//                         config
//                     )
//                     dispatch({
//                         type: USER_LIST_SUCCESS,
//                         payload: data
//                     })
//         } catch (error) {
//             if (error.response.status === 401) {
//             // Access token has expired, try to refresh it
//             try {
//                 const newToken = await dispatch(refreshAccessToken());
//                 // Retry the original request with the new access token
//                 const {
//                     userLogin: { userInfo },
//                 } = getState()
//                 const config = {
//                     headers: {
//                         Authorization: userInfo.access_token
//                     }
//                 }
//                 const { data } = await axios.get(`http://localhost:8003/api/users/`,
//                     config
//                 )
//                 dispatch({
//                     type: USER_LIST_SUCCESS,
//                     payload: data
//                 })
//             } catch (refreshError) {
//                 dispatch({
//                     type: USER_LIST_FAIL,
//                     payload: refreshError.response && refreshError.response.data.detail
//                         ? refreshError.response.data.detail
//                         : refreshError.message,
//                 })
//             }
//             } else {
//                 dispatch({
//                         type: USER_LIST_FAIL,
//                         payload: error.response && error.response.data.detail
//                             ? error.response.data.detail
//                             : error.message,
//                     })
//     }
//   }
// };

export const listUsers = () => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_LIST_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
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
            `http://localhost:8003/api/users/refresh_token`,
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
              isAdmin: userInfoJson.isAdmin,
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
          const { data } = await axios.get(
            `http://localhost:8003/api/users/`,
            config
          );
          dispatch({
            type: USER_LIST_SUCCESS,
            payload: data,
          });
        } catch (refreshError) {
          dispatch({
            type: USER_LIST_FAIL,
            payload:
              refreshError.response && refreshError.response.data.detail
                ? refreshError.response.data.detail
                : refreshError.message,
          });
        }
      } else {
        // access token is still valid, make the api call to list users
        const config = {
          headers: {
            Authorization: userInfo.access_token,
          },
        };
        const { data } = await axios.get(
          `http://localhost:8003/api/users/`,
          config
        );
        dispatch({
          type: USER_LIST_SUCCESS,
          payload: data,
        });
      }
    } catch (error) {
      dispatch({
        type: USER_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const refreshAccessToken = () => async (dispatch, getState) => {
    try{
        dispatch({
            type: TOKEN_RENEW_REQUEST
        })
        const {
            userLogin: { userInfo },
        } = getState()
        const config = {
            headers: {
                Authorization: userInfo.refresh_token
            }
        }
        const { data } = await axios.get(`http://localhost:8003/api/users/refresh_token`,
            config
        )
        dispatch({
            type: TOKEN_RENEW_SUCCESS,
            payload: data
        })
        console.log(data)
        console.log(data.access_token)

        const userInfoObj=localStorage.getItem("userInfo")
        const userInfoJson = JSON.parse(userInfoObj)
        userInfoJson.access_token = data.access_token
        localStorage.setItem("userInfo", JSON.stringify(userInfoJson))

    }catch (error) {
                dispatch({
                    type: TOKEN_RENEW_FAIL,
                    payload: error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message,
                })
            }
  };

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }

        const { data } = await axios.delete(
            `http://localhost:8003/api/users/delete/${id}/`,
            config
        )

        dispatch({
            type: USER_DELETE_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }

        const { data } = await axios.put(
            `http://localhost:8003/api/users/update/${user._id}/`,
            user,
            config
        )

        dispatch({
            type: USER_UPDATE_SUCCESS,
        })

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
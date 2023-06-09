import axios from 'axios'
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'
const BASEURL = 'https://ibes.offlinetoonline.in';

export const addToCart = (id,qty) => async (dispatch,getState) => {
    const {data} = await axios.get(`${BASEURL}/api/products/${id}/variation/`)
    dispatch({
        type:CART_ADD_ITEM,
        payload:{
            product_id:data.product_id,
            name:data.name,
            image:data.image,
            product_variation_id:data.product_variation_id,
            color_id:data.color_id,
            color:data.color,
            size_id:data.size_id,
            size:data.size,
            price:data.price,
            countInStock:data.countInStock,
            qty

        }
    })
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => async (dispatch,getState) => {
    dispatch({
        type:CART_REMOVE_ITEM,
        payload:id
    })
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))

}

export const saveShippingAddress = (data) => async (dispatch) => {
    dispatch({
        type:CART_SAVE_SHIPPING_ADDRESS,
        payload:data
    })
    localStorage.setItem("shippingAddress",JSON.stringify(data))

}

export const savePaymentMethod = (data) => async (dispatch) => {
    dispatch({
        type:CART_SAVE_PAYMENT_METHOD,
        payload:data
    })
    localStorage.setItem("paymentMethod",JSON.stringify(data))

}
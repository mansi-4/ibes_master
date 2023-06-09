import React,{useState,useEffect} from 'react'
import {Form,Button} from 'react-bootstrap'
import { useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import FormContainer from "../components/FormContainer"
import CheckoutSteps from "../components/CheckoutSteps"

import {saveShippingAddress} from "../actions/cartActions"
import {logout} from "../actions/userAction"
import jwt_decode from "jwt-decode";
import DOMPurify from 'dompurify';

function ShippingScreen() {
    let history = useNavigate()
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const dispatch = useDispatch()
    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    useEffect(() => {
        if(userInfo){
            var decodedHeader=jwt_decode(userInfo.refresh_token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }
        }else{
            history('/login')
        }
    },[userInfo])
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        history('/payment')
    }
  return (
    <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>

                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter address'
                        value={address ? address : ''}
                        onChange={(e) => setAddress(DOMPurify.sanitize(e.target.value))}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter city'
                        value={city ? city : ''}
                        onChange={(e) => setCity(DOMPurify.sanitize(e.target.value))}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter postal code'
                        value={postalCode ? postalCode : ''}
                        onChange={(e) => setPostalCode(DOMPurify.sanitize(e.target.value))}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter country'
                        value={country ? country : ''}
                        onChange={(e) => setCountry(DOMPurify.sanitize(e.target.value))}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' className="m-3" variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
  )
}

export default ShippingScreen

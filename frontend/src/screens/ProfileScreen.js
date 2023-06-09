import React,{useState,useEffect} from 'react'
import {Link,useSearchParams, useNavigate} from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from "../components/Loader"
import Message from "../components/Message"
import {USER_UPDATE_PROFILE_RESET} from '../constants/userConstants'
import DOMPurify from 'dompurify'
import {getUserDetails,updateUserProfile} from '../actions/userAction'
import { listMyOrders } from '../actions/orderActions'
import {logout} from "../actions/userAction"
import jwt_decode from "jwt-decode";
import CryptoJS from 'crypto-js';

function ProfileScreen() {
    let history = useNavigate()
    const dispatch= useDispatch()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [message,setMessage] = useState("")

  
    // getting the state of userDetails from store for that we are using useSelector hook
    const userDetails=useSelector(state => state.userDetails)
    // destructuring the response what we get from reducer
    const {error,loading,user} = userDetails

    const userLogin=useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const userUpdateProfile=useSelector(state => state.userUpdateProfile)
    const {success} = userUpdateProfile

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy
    const secretKey = "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4";
    
    useEffect(()=>{
        if (userInfo) {
            // to check if token is expired or not 
            var decodedHeader=jwt_decode(userInfo.refresh_token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }
            else{
                if(!user || !user.name || success || CryptoJS.AES.decrypt(userInfo._id, secretKey).toString(CryptoJS.enc.Utf8) !== String(user.user_id) ){
                    dispatch({type:USER_UPDATE_PROFILE_RESET})
                    dispatch(getUserDetails("profile"))
                    dispatch(listMyOrders())
                    setPassword("")
                    setConfirmPassword("")

                }
                else{
                    setName(user.name)
                    setEmail(user.email)
                }
            }
        }
        else{
            history("/login")
        }
    },[dispatch,history,userInfo,user,success])

    // to submit data using useDispatch
    const submitHandler = (e) => {
        e.preventDefault()
        if(password!=confirmPassword){
            setMessage("Passwords do not match")
        }
        else{
            dispatch(updateUserProfile({
                "id":user.id,
                "name":name,
                "email":email,
                "password":password
            }))
            setMessage("")
        }
    }
    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>

                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>

                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(DOMPurify.sanitize(e.target.value))}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            required
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(DOMPurify.sanitize(e.target.value))}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control

                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(DOMPurify.sanitize(e.target.value))}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control

                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(DOMPurify.sanitize(e.target.value))}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' className="m-3" variant='primary'>
                        Update
                </Button>

                </Form>
            </Col>

            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant='danger'>{errorOrders}</Message>
                ) : (
                            <Table striped responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Paid</th>
                                        <th>Delivered</th>
                                        <th></th>
                                    </tr> 
                                </thead>
                                {orders.length > 0 ?(
                                    
                                <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td>{order._id}</td>
                                                <td>{order.createdAt.substring(0, 10)}</td>
                                                <td>&#8377;{order.totalPrice}</td>
                                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                )}</td>
                                                <td>
                                                    <LinkContainer to={`/order/${order._id}`}>
                                                        <Button className='btn-sm'>Details</Button>
                                                    </LinkContainer>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                                ):(
                                    <tbody>
                                    <Message variant='info'>
                                        Order is empty
                                    </Message>
                                    </tbody>
                                    )}
                            </Table>
                        )}
            </Col>
        </Row>
  )
}

export default ProfileScreen

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button ,Row,Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listCustomerOrders, listOrders } from '../actions/orderActions'
import {logout} from "../actions/userAction"
import jwt_decode from "jwt-decode";
import CryptoJS from 'crypto-js';
 
function OrderListScreen() {
    let history=useNavigate();
    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    const customerOrderList = useSelector(state => state.customerOrderList)
    const { loading:loadingCustomerList, error:errorCustomerList, customer_orders } = customerOrderList

    const secretKey = "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4";
 
    useEffect(() => {
        if (userInfo && CryptoJS.AES.decrypt(userInfo.basic, secretKey).toString(CryptoJS.enc.Utf8)) {
            // to check if token is expired or not 
            var decodedHeader=jwt_decode(userInfo.refresh_token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }else{
                dispatch(listOrders())
                dispatch(listCustomerOrders())
            }
        }
        else{
            history('/login')
        }

    }, [dispatch, history, userInfo])

    
    const createOrderHandler = () => {
        // create product
        history("/admin/ordercreate")
    }
    return (
        <div>
            <Row className='align-items-center'> 
                <Col md={10}>
                    <h1>Orders</h1>
                </Col>

                <Col md={2}>
                    <Button className='my-3' onClick={createOrderHandler}>
                        <i className='fas fa-plus'></i> Create Order
                    </Button>
                </Col>
            </Row>
            <h3>Online Orders</h3>
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>USER</th>
                                    <th>DATE</th>
                                    <th>Total</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {orders.length > 0 ?(
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user && order.user.name}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>&#8377;{order.totalPrice}</td>

                                        <td>{order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}
                                        </td>

                                        <td>{order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}
                                        </td>

                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button variant='light' className='btn-sm'>
                                                    Details
                                                </Button>
                                            </LinkContainer>


                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            ):(
                                <Message variant='info'>
                                    Order is empty
                                </Message>
                                )}
                        </Table>
                    )}
            <h3>Offline Orders</h3>

            {loadingCustomerList
                ? (<Loader />)
                : errorCustomerList
                    ? (<Message variant='danger'>{errorCustomerList}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CUSTOMER</th>
                                    <th>DATE</th>
                                    <th>Total</th>
                                    <th>PAID</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {customer_orders.length > 0 ?(
                            <tbody>
                                {customer_orders.map(customer_order => (
                                    <tr key={customer_order._id}>
                                        <td>{customer_order._id}</td>
                                        <td>{customer_order.customer && customer_order.customer.name}</td>
                                        <td>{customer_order.createdAt.substring(0, 10)}</td>
                                        <td>&#8377;{customer_order.totalPrice}</td>

                                        <td>{customer_order.isPaid ? (
                                            customer_order.paidAt.substring(0, 10)
                                        ) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}
                                        </td>

                                        

                                        <td>
                                            <LinkContainer to={`/admin/customer_order/${customer_order._id}`}>
                                                <Button variant='light' className='btn-sm'>
                                                    Details
                                                </Button>
                                            </LinkContainer>


                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            ):(
                                <Message variant='info'>
                                    Order is empty
                                </Message>
                                )}
                        </Table>
                    )}
        </div>
    )
}

export default OrderListScreen
import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card,Form, Collapse } from 'react-bootstrap'
import { Link ,useNavigate,useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from "../components/Loader"
import {getCustomerOrderDetails,} from '../actions/orderActions'
import {logout} from "../actions/userAction"
import jwt_decode from "jwt-decode";
import axios from 'axios'
import jsPDF from "jspdf"
import html2canvas from 'html2canvas';
import CryptoJS from 'crypto-js';

function CustomerOrderScreen() {
    const { id } = useParams();
    let history=useNavigate()
    const customerOrderDetails = useSelector(state => state.customerOrderDetails)
    const { customer_order, error, loading } = customerOrderDetails

    
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [invoiceLoading,setinvoiceLoading]=useState(false)

    const secretKey = "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4";

    const dispatch=useDispatch();
    
    if(!loading && !error){
        customer_order.itemsPrice = customer_order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }
    const BASEURL='https://ibes.offlinetoonline.in'

    useEffect(() => {
        if (userInfo && CryptoJS.AES.decrypt(userInfo.basic, secretKey).toString(CryptoJS.enc.Utf8)) {
            // to check if token is expired or not 
            var decodedHeader=jwt_decode(userInfo.refresh_token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }
            else{
                if(!customer_order || customer_order._id!==Number(id) ){
                    dispatch(getCustomerOrderDetails(id))
                }
            }
        }
        else{
            history("/login")
        }
        
    }, [customer_order,id,userInfo])
    

    function downloadInvoice(){
            setinvoiceLoading(true)
            const Hide=document.getElementsByClassName("Hide")
            for (var i=0;i<Hide.length;i++){
                Hide[i].hidden=true
            }
            const HideImages=document.getElementsByClassName("hideImages")
            for (var i=0;i<HideImages.length;i++){
                HideImages[i].hidden=true
            }
            const doc = new jsPDF({ format: 'letter' });
            var htmlreport = document.querySelector("#htmlpdfreport"); 
            
            html2canvas(htmlreport, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 10, 10, 200, 240);
                doc.save(customer_order._id+'.pdf');
                const HideImages=document.getElementsByClassName("hideImages")
                for (var i=0;i<HideImages.length;i++){
                    HideImages[i].hidden=false
                }
                setinvoiceLoading(false)
            });
        // try{
        //     setinvoiceLoading(true)
        //     const Hide=document.getElementsByClassName("Hide")
        //     for (var i=0;i<Hide.length;i++){
        //         Hide[i].hidden=true
        //     }
        //     // Hide.hidden=true
        //     var htmlreport = document.querySelector("#htmlpdfreport").innerHTML; 
        //     axios .post( "${BASEURL}/api/orders/invoice/", JSON.stringify(htmlreport), 
        //     { 
        //         responseType: "blob" 
        //     }) 
        //     .then(response => 
        //         { 
        //             var url = window.URL.createObjectURL( new Blob([response.data], { type: "application/pdf" }) ),
        //             anchor = document.createElement("a"); anchor.href = url; 
        //             anchor.download = "invoice.pdf"; 
        //             anchor.click(); 
        //             setinvoiceLoading(false)
        //             const Hide=document.getElementsByClassName("Hide")
        //             for (var i=0;i<Hide.length;i++){
        //                 Hide[i].hidden=false
        //             }
        //         });
        // }catch(error){
        //     setinvoiceLoading(false)
        // }
        

    }


  return loading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>{error}</Message>
        ) : (
            <>
            {invoiceLoading?(
                    <Loader/>
                ):(

                    <Button
                    type='button'
                    className='float-end btn btn-sm'
                    onClick={downloadInvoice}
                    >
                    Download Invoice
                    </Button>
                )}
            
            <div id="htmlpdfreport">
                <h1 className='text-center'>
                    OfflineToOnline</h1>
                    {/* <Image src={`${BASEURL}/static/multimedia/shopping.png`}  width="30px"/>                     */}
                <h1>Order: {customer_order._id}</h1>
            <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h4>Order Date: {customer_order.createdAt.split("T")[0]}</h4>
                            </ListGroup.Item>        
                        </ListGroup>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Customer</h2>
                                <p><strong>Name: </strong> {customer_order.customer.name}</p>
                                <p><strong>Phone No: </strong>{customer_order.customer.phone_no}</p>
                                <p>
                                    <strong>Shipping: </strong>
                                    {customer_order.customer.address},  {customer_order.customer.city}
                                    {'  '}
                                    {customer_order.customer.postalCode},
                                    {'  '}
                                    {customer_order.customer.country}
                                </p>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {customer_order.paymentMethod}
                                </p>
                                {customer_order.isPaid ? (
                                        <Message variant='success'>Paid on {customer_order.paidAt}</Message>
                                    ) : (
                                            <Message variant='warning'>Not Paid</Message>
                                        )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {customer_order.orderItems.length === 0 ? <Message variant='info'>
                                    Order is empty
                                </Message> : (
                                        <ListGroup variant='flush'>
                                            {customer_order.orderItems.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row> 
                                                        <Col className='hideImages'>
                                                            <Image src={`https://ibes.offlinetoonline.in/${item.image}`} alt={item.name} fluid rounded style={{width:"100px"}}/>
                                                        </Col>

                                                        <Col>
                                                            <Link to={`/product/${item.product_id}`}>{item.name}</Link>
                                                        </Col>

                                                        <Col>
                                                            {item.color}
                                                        </Col>

                                                        <Col>
                                                            {item.size}
                                                        </Col>

                                                        <Col>
                                                            {item.qty} X &#8377;{item.price} = &#8377;{(item.qty * item.price).toFixed(2)}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                               
                                            ))}
                                        </ListGroup>
                                    )}
                            </ListGroup.Item>

                        </ListGroup>

                    </Col>
                    <Col md={4}>
                        
                
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items:</Col>
                                            <Col>&#8377;{customer_order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Discount:</Col>
                                            <Col>{customer_order.discountPercentage} %</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>&#8377;{customer_order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                </ListGroup>
                                
                            </Card>
                            
                    </Col>
            </Row>
            
            
            </div>
            </>
        )
  
}

export default CustomerOrderScreen;

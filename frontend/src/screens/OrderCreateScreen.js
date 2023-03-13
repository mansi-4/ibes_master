import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import {Form,Row,Col,Table,Button} from "react-bootstrap";
import FormContainer from '../components/FormContainer'
import { useSelector,UseDispatch, useDispatch } from "react-redux";
import {logout} from '../actions/userAction'
import jwt_decode from "jwt-decode";
import { listCategories } from '../actions/categoryActions'
import { listProducts ,listDistinctProductDetails, listProductSizesByColor, listProductVariationBySize } from '../actions/productActions'
import {PRODUCT_CREATE_REVIEW_RESET,PRODUCT_SIZE_BY_COLOR_RESET} from '../constants/productConstants'
import { createCustomerOrder } from "../actions/orderActions";

import Loader from "../components/Loader"
import Message from "../components/Message"
import { CUSTOMER_ORDER_CREATE_RESET } from "../constants/orderConstants";

function OrderCreateScreen(){
    const dispatch=useDispatch()
    let history=useNavigate()

    
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    const categoryList = useSelector(state => state.categoryList)
    const { loading:loadingCategories, error:errorCategories, categories } = categoryList
    
    const productList = useSelector(state=>state.productList)
    const {error:errorProductList,loading:loadingProductList,products}= productList

    const productDistinctDetails = useSelector(state=>state.productDistinctDetails)
    const {error:errorProductDistinctDetails,loading:loadingProductDistinctDetails,product}= productDistinctDetails

    const productSizesByColor = useSelector(state=>state.productSizesByColor)
    const {error:errorProductSizesByColor,loading:loadingProductSizesByColor,sizes}= productSizesByColor

    const productVariationBySize = useSelector(state=>state.productVariationBySize)
    const {error:errorProductVariationBySize,loading:loadingProductVariationBySize,variation}= productVariationBySize

    const customerOrderCreate = useSelector(state => state.customerOrderCreate)
    const { customer_order, error:errorOrderCreate, success:successOrderCreate } = customerOrderCreate

    const [keyword,setKeyword]=useState("")
    const [customer_name,setCustomerName]=useState("")
    const [phone_no,setPhoneNo]=useState("")
    const [address,setAddress]=useState("")
    const [city,setCity]=useState("")
    const [postal_code,setPostalCode]=useState("")
    const [country,setCountry]=useState("India")

    const [category_id,setCategoryId]=useState("")
    const [product_id,setProductId]=useState("")
    const [color_id,setColorId]=useState("")
    const [size_id,setSizeId]=useState("")
    const [price,setPrice]=useState("")
    const [qty,setQty]= useState("1")
    const [discount,setDiscount]= useState(0)
    const [totalPrice,setTotalPrice]=useState(0)

    const [order_items,setOrderItems]=useState([])

    function handleChangeCategory(e){
        setCategoryId(e.target.value)
        const category_id=e.target.value.split("_")[0]
        setProductId("")
        setColorId("")
        setSizeId("")
        dispatch(listProducts(keyword,category_id))
    }
    function handleChangeProduct(e){
        setProductId(e.target.value)
        const product_id=e.target.value.split("_")[0]
        setColorId("")
        setSizeId("")
        dispatch(listDistinctProductDetails(product_id))
    }
    function handleChangeColor(e){
        setColorId(e.target.value)
        const color_id=e.target.value.split("_")[0]
        const obj={
            "color_id":color_id,
            "product_id":product_id.split("_")[0]
        }
        dispatch({type:PRODUCT_SIZE_BY_COLOR_RESET})
        dispatch(listProductSizesByColor(obj))
        setSizeId("")
        
    }
    function handleChangeSize(e){
        setSizeId(e.target.value)
        const size_id=e.target.value.split("_")[0]
        const obj={
            "size_id":size_id,
            "color_id":color_id.split("_")[0],
            "product_id":product_id.split("_")[0]
        }
        dispatch(listProductVariationBySize(obj))
        setPrice(variation.price)
    }
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            // to check if token is expired or not 
            var decodedHeader=jwt_decode(userInfo.token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }
            else{
                dispatch(listCategories())
                if(successOrderCreate){
                    history(`/admin/customer_order/${customer_order._id}`)

                    dispatch({type:CUSTOMER_ORDER_CREATE_RESET}) 
                }

            }
        }
        else{
            history('/login')
        }
    },[userInfo,successOrderCreate])
    function addOrderItemList(pricee){
        order_items.push({
            "product_id":product_id,
            "product_variation_id":variation.product_variation_id,
            "color_id":color_id.split("_")[0],
            "color":color_id.split("_")[1],
            "size_id":size_id.split("_")[0],
            "size":size_id.split("_")[1],
            "price":pricee,
            "qty":Number(qty)
        })
        setCategoryId("");
        setProductId("");
        setColorId("");
        setSizeId("");
        setPrice("") 
        setQty("1");
    }
    function deleteOrderItemsArrItem(id){
        setOrderItems(order_items.filter((i,index)=>(index!== id)))
    }
    function submitHandler(e){
        e.preventDefault()
        if(order_items.length === 0){
            alert("Please add order items")
        }else{
            var obj={
                customer_name:customer_name,
                phone_no:phone_no,
                address:address,
                city:city,
                postal_code:postal_code,
                country:country,
                discountPercentage:discount,
                totalPrice:totalPrice,
                orderItems:order_items
            }
            // console.log(obj)
            dispatch(createCustomerOrder(obj))
        }
    }
    function getTotalPrice(e){
        if(e.target.value === 0 || e.target.value==="" ){
            setTotalPrice(order_items.reduce((acc,item) => acc+item.qty*item.price,0).toFixed(2))
            setDiscount(0)
        }
        if(e.target.value.length > 2){
            alert("Discount range should be in between 1~99")
            setDiscount(0)
        }
        else{
            setDiscount(e.target.value)
            const actual_price=order_items.reduce((acc,item) => acc+item.qty*item.price,0).toFixed(2)
            const total_price=actual_price-((e.target.value/100)*actual_price)
            setTotalPrice(total_price)
        }
        
    }
    return(
        <div>
        <Link to='/admin/orderlist' className='btn btn-light my-3'>
            Go Back
        </Link>
                    <h1>Create Order</h1>
                    <Form onSubmit={submitHandler}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId='customer_name'>
                                <Form.Label>Customer Name</Form.Label>
                                <Form.Control
                                    required
                                    type='name'
                                    placeholder='Enter Customer Name'
                                    name="customer_name"
                                    value={customer_name}
                                    onChange={(e)=>setCustomerName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId='phone_no'>
                                <Form.Label>Phone No</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Phone No'
                                    name="phone_no"
                                    value={phone_no}
                                    onChange={(e)=>setPhoneNo(e.target.value)}
                                    required
                                >
                                </Form.Control>
                            </Form.Group>                        
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId='address'>
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    required
                                    type='text'
                                    placeholder='Enter Address'
                                    name="address"
                                    value={address}
                                    onChange={(e)=>setAddress(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group controlId='city'>
                                <Form.Label>City</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter City'
                                    name="city"
                                    value={city}
                                    onChange={(e)=>setCity(e.target.value)}
                                    required
                                >
                                </Form.Control>
                            </Form.Group>                        
                        </Col>
                        
                        <Col md={2}>
                            <Form.Group controlId='postal_code'>
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Postal Code'
                                    name="postal_code"
                                    value={postal_code}
                                    onChange={(e)=>setPostalCode(e.target.value)}
                                    required
                                >
                                </Form.Control>
                            </Form.Group>                        
                        </Col>
                        
                        <Col md={2}>
                            <Form.Group controlId='country'>
                                <Form.Label>Country</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Country'
                                    name="country"
                                    value={country}
                                    disabled
                                    // onChange={(e)=>setCountry(e.target.value)}
                                    required
                                >
                                </Form.Control>
                            </Form.Group>                        
                        </Col>
                    </Row>    
                    <hr/>
                    <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <td>
                                                <Form.Select name="category_id" 
                                                value={category_id} 
                                                onChange={handleChangeCategory} 
                                                // isSearchable={true}
                                                required>
                                                    <option>Categories</option>
                                                    {categories.map((category,index)=>(
                                                        <option value={category.id+'_'+category.category}>{category.category}</option>
                                                    ))}
                                                </Form.Select>
                                        </td>  
                                            <td>
                                                <Form.Select name="product_id" 
                                                 value={product_id}
                                                 onChange={handleChangeProduct}
                                                 >
                                                    <option>Products</option>
                                                    {products.map((product,index)=>(
                                                        <option value={product.product_id+'_'+product.name}>{product.name}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>                                
                                            <td>
                                                <Form.Select name="color_id" 
                                                 value={color_id}
                                                 onChange={handleChangeColor}
                                                 >
                                                    <option>Colors</option>
                                                    {product.colors.map((color,index)=>(
                                                        <option value={color.color_id+'_'+color.color}>{color.color}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Select name="size_id" 
                                                 value={size_id}
                                                 onChange={handleChangeSize}
                                                 >
                                                    <option>Sizes</option>
                                                    {sizes.map((size,index)=>(
                                                        <option value={size.size_id+'_'+size.size}>{size.size}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                            {Object.keys(variation).length!==0 && size_id > "0"? (
                                                <>
                                                
                                            <td>
                                            <Form.Control
                                                type='text'
                                                placeholder='Price'
                                                name="price"
                                                disabled
                                                value={variation.price}
                                                // onChange={(e)=>setPrice(e.target.value)}
                                                >
                                            </Form.Control>
                                            </td>
                                            
                                            <td>
                                            {variation.countInStock > 0 ? (
                                                variation.countInStock > 10 ?(
                                                    <Form.Control as="select" 
                                                    value={qty} 
                                                    onChange={(e)=>setQty(e.target.value)}>
                                                    {
                                                        [...Array(10).keys()].map((x)=>
                                                        (
                                                            <option key={x+1} value={x+1}>
                                                                {x+1}
                                                            </option>
                                                        ))
                                                    } 
                                                    </Form.Control>
                                                    ):(
                                                    <Form.Control as="select" 
                                                    value={qty} 
                                                    onChange={(e)=>setQty(e.target.value)}>
                                                    {
                                                        [...Array(variation.countInStock).keys()].map((x)=>
                                                        (
                                                            <option key={x+1} value={x+1}>
                                                                {x+1}
                                                            </option>
                                                        ))
                                                    } 
                                                    </Form.Control>
                                                )
                                            ):(
                                                "Out of Stock"
                                            )}    
                                            </td>
                                            <td>
                                            <Button type='button' variant='dark' disabled={variation.countInStock == 0}
                                            onClick={()=> addOrderItemList(variation.price)}
                                            >
                                            <i class="fa fa-plus"></i>

                                            </Button>
                                            </td>
                                                </>
                                            ):(
                                                ""
                                            )}
                                        </tr>
                                    </thead>
                    </Table>
                    <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>                                
                                            <th>
                                                Product
                                            </th>
                                            <th>
                                                Color
                                            </th>
                                            <th>
                                                Size
                                            </th>
                                            <th>
                                                Price
                                            </th>
                                            <th>
                                                Quantity
                                            </th> 
                                            <th>
                                                Amount
                                            </th>                                           
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order_items.map((order_item,index)=>{
                                                var product=order_item.product_id.split("_");
                                                var product=product[1];
                                                var color=order_item.color.split("_");
                                                var color=color[1];
                                                var size=order_item.size.split("_");
                                                var size=size[1];
                                                return(
                                                <>
                                                <tr>
                                                    <td>{product}</td>
                                                    <td>{color}</td>
                                                    <td>{size}</td>
                                                    <td>&#8377;{order_item.price}</td>
                                                    <td>{order_item.qty}</td>
                                                    <td>&#8377;{order_item.price * order_item.qty}</td>
                                                    <td>
                                                        <Button type="button" variant='danger' onClick={()=>deleteOrderItemsArrItem(index)}>
                                                            <i class="fa fa-trash"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                                </>
                                                );
                                        })}
                                        {order_items.length > 0 && (
                                        <>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Items</td>
                                            <td>&#8377;{order_items.reduce((acc,item) => acc+item.qty*item.price,0).toFixed(2)}</td>
                                            <td></td>

                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Discount</td>
                                            <td>
                                                <Row>
                                                    <Col>
                                                    <Form.Control
                                                    type='number'
                                                    style={{width:"100px"}}
                                                    placeholder='discount'
                                                    name="discount"
                                                    value={discount}
                                                    onChange={(e)=> getTotalPrice(e)}
                                                    max="100"
                                                    >
                                                    </Form.Control>
                                                    </Col>
                                                    <Col className="mt-3">
                                                        %
                                                    </Col>
                                                </Row>
                                                 
                                            </td>
                                            <td></td>

                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Total</td>
                                            <td>&#8377;{totalPrice > 0 ? totalPrice : order_items.reduce((acc,item) => acc+item.qty*item.price,0).toFixed(2)}</td>
                                            <td></td>

                                        </tr>
                                        </>
                                        )}
                                    </tbody>
                    </Table>
                    
                    <Button type='submit' className="float-end" variant='primary'>
                        Place Order
                    </Button>
                    </Form>
        </div>
    )
 }
 export default OrderCreateScreen;
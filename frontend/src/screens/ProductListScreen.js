import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {useNavigate } from 'react-router-dom'
import { Table, Button,Row,Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts,deleteProduct,createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import {logout} from "../actions/userAction"
import jwt_decode from "jwt-decode";
import CryptoJS from 'crypto-js'

function ProductListScreen() {
    let history=useNavigate()
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const secretKey = "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4";

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })
        if (userInfo && CryptoJS.AES.decrypt(userInfo.basic, secretKey).toString(CryptoJS.enc.Utf8)) {
            // to check if token is expired or not 
            var decodedHeader=jwt_decode(userInfo.refresh_token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }else{
                if (successCreate) {
                    history(`/admin/product/${createdProduct.product_id}/edit`)
                } else {
                    dispatch(listProducts())
                }
            }
        }
        else{
            history('/login')
        }

    }, [dispatch, history,userInfo,successDelete,successCreate, createdProduct])


    const deleteHandler = (id) => {

        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = (product) => {
        // create product
        // dispatch(createProduct())
        history("/admin/productcreate")
    }

    return (
        <div>
            <Row className='align-items-center'> 
                <Col md={10}>
                    <h1>Products</h1>
                </Col>

                <Col md={2}>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>                                
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th></th>
                                </tr>

                            </thead>

                            <tbody>
                                    {products.map(product => (
                                        <tr key={product.product_id}>
                                            <td>{product.product_id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>

                                            <td>
                                                <LinkContainer to={`/admin/product/${product.product_id}/edit`}>
                                                    <Button variant='light' className='btn-sm'>
                                                        <i className='fas fa-edit'></i>
                                                    </Button>
                                                </LinkContainer>

                                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product.product_id)}>
                                                    <i className='fas fa-trash'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                        </Table>
                    )}
        </div>
    )
}

export default ProductListScreen
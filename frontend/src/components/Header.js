import React, { useEffect } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {Container,Navbar,Nav, NavDropdown,Image} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {  } from 'react-router-dom'
import {logout} from '../actions/userAction'
import SearchBox from './SearchBox'
import CryptoJS from 'crypto-js';

function Header() {
  const dispatch=useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin
  const logoutHandler = () => {
    dispatch(logout())
  }
  const secretKey = "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4";
  
  return (
  <header>
  <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
    <Container fluid>
        <LinkContainer to="/">
          {/* <Navbar.Brand>ProShop</Navbar.Brand> */}
          <Navbar.Brand> 
          Offlinetoonline
          </Navbar.Brand>

        </LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
          
          {/* <SearchBox/> */}
          <Nav
              className="ms-auto"
          >
          <LinkContainer to="/cart">
            <Nav.Link><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
          </LinkContainer>

          {userInfo?(
            <NavDropdown title={userInfo.name} id="username">
              <LinkContainer to="/profile">
                <NavDropdown.Item>
                  Profile
                </NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item onClick={logoutHandler}>
                  Logout
              </NavDropdown.Item>
            </NavDropdown>
          ):(
            <LinkContainer to="/login">
            <Nav.Link ><i className='fas fa-user'></i>Login</Nav.Link>
          </LinkContainer>  
          )}
          {userInfo && CryptoJS.AES.decrypt(userInfo.basic, secretKey).toString(CryptoJS.enc.Utf8) !== "false" ?(
            <NavDropdown title='Admin' id='adminmenue'>
                <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/colorlist'>
                    <NavDropdown.Item>Colors</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/sizelist'>
                    <NavDropdown.Item>Sizes</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/categorylist'>
                    <NavDropdown.Item>Categories</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>

            </NavDropdown>
          ):""}
          
          </Nav>
          
          </Navbar.Collapse>
    </Container>
  </Navbar>
</header>
  )
}

export default Header
